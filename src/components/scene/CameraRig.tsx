"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CAB_FOV_BOOST, cameraFov } from "@/lib/layout";
import { useTower } from "@/store/tower";

interface Look {
  pos: THREE.Vector3;
  yaw: number;
  pitch: number;
  dist: number;
}

function lookOf(pos: THREE.Vector3, target: THREE.Vector3): Look {
  const d = target.clone().sub(pos);
  const dist = Math.max(d.length(), 0.001);
  d.divideScalar(dist);
  return { pos: pos.clone(), yaw: Math.atan2(d.x, d.z), pitch: Math.asin(THREE.MathUtils.clamp(d.y, -1, 1)), dist };
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * Cinematic camera moves + limited look-around.
 * Moves interpolate position and look direction (yaw/pitch) separately, so
 * turns never flip through the target. After a move, OrbitControls is
 * re-centred on the new pose with tight azimuth/polar/zoom limits.
 */
export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const camera = useThree((s) => s.camera);
  const cmd = useTower((s) => s.camera);
  const sub = useTower((s) => s.sub);
  const view = useTower((s) => s.view);
  const mobile = useTower((s) => s.mobile);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") (window as unknown as { __camera: THREE.Camera }).__camera = camera;
  }, [camera]);
  const tween = useRef<{ from: Look; to: Look; target: THREE.Vector3; start: number; dur: number; arc: number } | null>(null);

  const applyLimits = () => {
    const c = controls.current;
    if (!c) return;
    const offset = camera.position.clone().sub(c.target);
    const r = offset.length();
    const az = Math.atan2(offset.x, offset.z);
    const polar = Math.acos(THREE.MathUtils.clamp(offset.y / r, -1, 1));
    const s = useTower.getState();
    const locked = s.sub === "elevator" && s.view === "interior";
    const azRange = locked ? 0 : s.view !== "interior" ? (s.mobile ? 0.35 : 0.6) : s.mobile ? 0.3 : 0.5;
    const polRange = locked ? 0 : s.mobile ? 0.12 : 0.22;
    c.minAzimuthAngle = wrap(az - azRange);
    c.maxAzimuthAngle = wrap(az + azRange);
    c.minPolarAngle = Math.max(0.12, polar - polRange);
    c.maxPolarAngle = Math.min(Math.PI / 2 - 0.04, polar + polRange);
    c.minDistance = r * (locked ? 1 : 0.7);
    c.maxDistance = r * (locked ? 1 : 1.25);
    c.enableRotate = !locked;
    c.enableZoom = !locked;
  };

  useEffect(() => {
    const c = controls.current;
    const to = new THREE.Vector3(...cmd.pose.position);
    const target = new THREE.Vector3(...cmd.pose.target);
    if (cmd.duration <= 0 || !c) {
      camera.position.copy(to);
      c?.target.copy(target);
      camera.lookAt(target);
      tween.current = null;
      if (c) {
        // New limits first, otherwise update() clamps to the previous pose's range.
        applyLimits();
        c.enabled = true;
        c.update();
      }
      return;
    }
    c.enabled = false;
    tween.current = {
      from: lookOf(camera.position, c.target),
      to: lookOf(to, target),
      target,
      start: performance.now(),
      dur: cmd.duration * 1000,
      arc: cmd.arc,
    };
    // applyLimits reads store state; it is stable for our purposes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmd.id]);

  // Elevator lock / unlock without a camera move.
  useEffect(() => {
    if (!tween.current) applyLimits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub, view, mobile]);

  useFrame((_, dt) => {
    // Field of view eases wider inside the elevator cab.
    const st = useTower.getState();
    const cam = camera as THREE.PerspectiveCamera;
    const wantFov = cameraFov(st.aspect) + (st.view === "interior" && st.sub === "elevator" ? CAB_FOV_BOOST : 0);
    if (Math.abs(cam.fov - wantFov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, wantFov, 4, dt);
      cam.updateProjectionMatrix();
    }

    const tw = tween.current;
    const c = controls.current;
    if (!tw || !c) return;
    const t = Math.min(1, (performance.now() - tw.start) / tw.dur);
    const e = ease(t);
    const pos = tw.from.pos.clone().lerp(tw.to.pos, e);
    pos.y += Math.sin(Math.PI * e) * tw.arc;
    let dy = tw.to.yaw - tw.from.yaw;
    dy = wrap(dy);
    const yaw = tw.from.yaw + dy * e;
    const pitch = THREE.MathUtils.lerp(tw.from.pitch, tw.to.pitch, e);
    const dist = THREE.MathUtils.lerp(tw.from.dist, tw.to.dist, e);
    const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    const look = pos.clone().addScaledVector(dir, dist);
    camera.position.copy(pos);
    c.target.copy(look);
    camera.lookAt(look);
    if (t >= 1) {
      camera.position.copy(tw.to.pos);
      c.target.copy(tw.target);
      camera.lookAt(tw.target);
      tween.current = null;
      applyLimits();
      c.enabled = true;
      c.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={mobile ? 0.45 : 0.55}
      zoomSpeed={0.6}
    />
  );
}
