"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { isNew } from "@/lib/building";
import { statusColor, statusLabel } from "@/lib/labels";
import type { PortfolioItem } from "@/lib/types";
import { useTower } from "@/store/tower";
import { Label } from "../common/Label";
import { accentMat } from "../common/materials";
import { Cone, Torus } from "../common/primitives";
import { KIND_HEIGHT, ObjectModel, objectKind } from "./objectModels";

const HIT = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
const HIT_GEO = new THREE.BoxGeometry(1, 1, 1);

export interface Slot {
  pos: [number, number, number];
  rot?: number;
}

/**
 * A clickable portfolio object. Hover lifts it; selection adds a glowing
 * ring and a floating marker. Clicking opens the 2D detail panel — the
 * camera is left exactly where it is.
 */
export function PortfolioObject({ item, slot, accent, labelsOn }: { item: PortfolioItem; slot: Slot; accent: string; labelsOn: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const marker = useRef<THREE.Group>(null);
  const hovered = useTower((s) => s.hoveredItemId === item.id);
  const selected = useTower((s) => s.panel?.kind === "item" && s.panel.id === item.id);
  const mobile = useTower((s) => s.mobile);
  const kind = objectKind(item);
  const h = KIND_HEIGHT[kind];

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const active = hovered || selected;
    const reduced = useTower.getState().reducedMotion;
    const targetY = active ? 0.06 : 0;
    const targetS = active ? 1.08 : 1;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 10, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetS, 10, dt));
    if (ring.current) {
      const s = THREE.MathUtils.damp(ring.current.scale.x, active ? 1 : 0.001, 10, dt);
      ring.current.scale.set(s, s, s);
      ring.current.visible = s > 0.01;
    }
    if (marker.current) {
      marker.current.visible = selected;
      marker.current.position.y = h + 0.45 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 3) * 0.05);
    }
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    useTower.getState().openItem(item.id);
  };
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useTower.getState().setHovered(item.id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (useTower.getState().hoveredItemId === item.id) useTower.getState().setHovered(null);
    document.body.style.cursor = "";
  };

  const hit = mobile ? [1.1, h + 0.7, 1.1] : [0.75, h + 0.3, 0.75];
  const fresh = isNew(item.publishedAt);

  return (
    <group position={slot.pos} rotation={[0, slot.rot ?? 0, 0]}>
      <group ref={group}>
        <ObjectModel kind={kind} seed={item.id} accent={accent} />
      </group>
      <mesh
        geometry={HIT_GEO}
        material={HIT}
        position={[0, hit[1] / 2, 0]}
        scale={hit as [number, number, number]}
        onClick={onClick}
        onPointerOver={over}
        onPointerOut={out}
      />
      <Torus ref={ring} p={[0, 0.015, 0]} r={[Math.PI / 2, 0, 0]} s={0.001} m={accentMat(accent, 1.2)} />
      <group ref={marker} visible={false}>
        <Cone r={[Math.PI, 0, 0]} s={[0.14, 0.2, 0.14]} m={accentMat(accent, 0.8)} />
      </group>
      <Label position={[0, h + 0.28, 0]} hidden={!(labelsOn || hovered || selected)} className="item-label">
        <span className="item-label__title">{item.title}</span>
        {(fresh || item.status) && (
          <span className="item-label__meta">
            {fresh && <span className="badge-new">NEW</span>}
            {item.status && item.status !== "RELEASED" && (
              <span className="badge-status" style={{ background: statusColor[item.status] }}>
                {statusLabel[item.status]}
              </span>
            )}
          </span>
        )}
      </Label>
    </group>
  );
}
