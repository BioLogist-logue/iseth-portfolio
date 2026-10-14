"use client";

import { memo } from "react";
import type { ZoneScene } from "@/lib/types";
import { statusColor } from "@/lib/labels";
import { accentMat, mats } from "../common/materials";
import { Box, Cyl, Sphere } from "../common/primitives";
import {
  Armchair,
  Beakers,
  Bookshelf,
  Chair,
  CoffeeTable,
  Counter,
  Display,
  Frame,
  Microscope,
  Monitor,
  Plant,
  Pouf,
  Rug,
  Sofa,
  Stool,
  Table,
} from "../common/props";
import { MediaKiosk } from "../common/fixtures";
import type { Slot } from "./PortfolioObject";

/**
 * Furniture sets that dress a zone booth, plus where portfolio objects sit.
 * Booth-local coordinates: origin at the booth centre, back panel at z = -d/2.
 */

function spread(n: number, span: number, y: number, z: number, x0 = 0): Slot[] {
  if (n <= 0) return [];
  const step = n === 1 ? 0 : span / (n - 1);
  return Array.from({ length: n }, (_, i) => ({ pos: [x0 - span / 2 + i * step, y, z] as [number, number, number] }));
}

/** Two rows if needed: first along `rowA`, overflow along `rowB`. */
function twoRows(n: number, perRow: number, a: (k: number) => Slot[], b: (k: number) => Slot[]) {
  const first = Math.min(n, perRow);
  return [...a(first), ...b(n - first)];
}

/** Student-desk columns: spread wider in large classroom wings. */
function deskColumns(w: number) {
  return w >= 11 ? [-w * 0.3, 0, w * 0.3] : [-2.6, 0, 2.6];
}

/** Evenly spaced x positions for `n` units of width `unit` across `span`. */
function evenly(n: number, span: number) {
  if (n <= 1) return [0];
  return Array.from({ length: n }, (_, i) => -span / 2 + (i * span) / (n - 1));
}

export function slotsFor(scene: ZoneScene, n: number, w: number, d: number): Slot[] {
  const b = -d / 2;
  const span = (k: number, max: number) => Math.min(max, Math.max(0, (k - 1) * 1.15));
  switch (scene) {
    case "dev-desk":
    case "inquiry-desk":
      return twoRows(
        n,
        5,
        (k) => spread(k, span(k, w - 2.4), 0.79, b + 1.05),
        (k) => spread(k, span(k, w - 3), 0.77, b + 2.75),
      );
    case "lab-bench":
      return twoRows(
        n,
        4,
        (k) => spread(k, span(k, w * 0.52), 0.98, b + 2.25),
        (k) => spread(k, span(k, w - 3), 0.77, b + 0.95, 0),
      );
    case "bookshelf":
    case "archive-cabinet":
      return twoRows(
        n,
        4,
        (k) => spread(k, span(k, 3.4), 0.78, b + 2.55),
        (k) => spread(k, span(k, 3.4), 0.78, b + 2.0),
      );
    case "gallery-wall":
    case "timeline":
      return spread(n, span(n, w - 2), 1.02, b + 1.7);
    case "badge-wall":
      return spread(n, span(n, w - 3), 1.02, b + 1.5);
    case "seminar":
      return spread(n, span(n, w * 0.45), 0.78, b + 1.25, -w * 0.12);
    case "smart-classroom":
      return twoRows(
        n,
        4,
        (k) => spread(k, span(k, w * 0.5), 0.78, b + 1.3),
        (k) => deskColumns(w).concat(deskColumns(w)).slice(0, k).map((x, i) => ({ pos: [x, 0.76, b + 2.4 + (i > 2 ? 1.1 : 0)] as [number, number, number] })),
      );
    case "lounge":
      return spread(n, span(n, 1.2), 0.45, b + 2.2);
    default:
      return spread(n, span(n, w - 2), 0.78, b + 2);
  }
}

export const ZoneFurniture = memo(function ZoneFurniture({
  scene,
  w,
  d,
  accent,
  seed,
  slots,
}: {
  scene: ZoneScene;
  w: number;
  d: number;
  accent: string;
  seed: string;
  slots: Slot[];
}) {
  const m = mats();
  const b = -d / 2;
  const a = accentMat(accent);

  const pedestals = (h: number) =>
    slots.map((s, i) => <Box key={`ped${i}`} p={[s.pos[0], h / 2, s.pos[2]]} s={[0.62, h, 0.62]} m={m.white} cast receive />);

  switch (scene) {
    case "dev-desk": {
      const cols = ["IDEA", "PROTOTYPE", "TESTING", "RELEASE_CANDIDATE"] as const;
      const cw = (w - 1.6) / 4;
      return (
        <group>
          {cols.map((c, i) => (
            <group key={c} position={[-w / 2 + 0.8 + cw * (i + 0.5), 2.0, b + 0.27]}>
              <Box s={[cw - 0.12, 1.1, 0.02]} m={m.white} />
              <Box p={[0, 0.48, 0.015]} s={[cw - 0.12, 0.12, 0.01]} m={accentMat(statusColor[c], 0.3)} />
              {[0, 1, 2].map((k) => (
                <Box key={k} p={[-cw * 0.22 + (k % 2) * cw * 0.4, 0.15 - k * 0.22, 0.015]} s={[cw * 0.3, 0.16, 0.01]} m={accentMat(k === 1 ? "#f4cf5d" : "#fbf3d0")} />
              ))}
            </group>
          ))}
          <Table position={[0, 0, b + 1.05]} w={w - 1.2} d={0.85} h={0.76} top="wood" />
          {slots.length > 5 && <Table position={[0, 0, b + 2.75]} w={w - 2.2} d={0.8} h={0.74} top="white" />}
          {[-w / 2 + 1.0, w / 2 - 1.0].map((x, i) => (
            <Monitor key={x} position={[x, 0.79, b + 0.85]} seed={`${seed}-mon${i}`} />
          ))}
          {[-2.4, 0, 2.4].map((x) => (
            <Chair key={x} position={[x, 0, b + 1.85]} rotation={Math.PI} />
          ))}
          <Plant position={[w / 2 - 0.5, 0, b + 2.6]} variant={1} tall />
        </group>
      );
    }
    case "inquiry-desk": {
      // Ask → Plan → Investigate → Analyze → Share, plus a data-analysis screen.
      const steps = ["#8a4fc0", "#e08a2e", "#2f9a5a", "#3f7fd6", "#5b6fd6"];
      const sw = (w * 0.52) / steps.length;
      return (
        <group>
          {steps.map((c, i) => (
            <group key={c} position={[-w / 2 + 0.9 + sw * (i + 0.5), 2.0, b + 0.27]}>
              <Box s={[sw - 0.16, 0.9, 0.02]} m={m.white} />
              <Cyl p={[0, 0.06, 0.02]} r={[Math.PI / 2, 0, 0]} s={[0.36, 0.02, 0.36]} m={accentMat(c, 0.35)} />
              <Box p={[0, -0.32, 0.015]} s={[sw * 0.5, 0.06, 0.01]} m={accentMat(c)} />
              {i < steps.length - 1 && <Box p={[sw / 2, 0.06, 0.02]} s={[0.12, 0.04, 0.01]} m={m.dark} />}
            </group>
          ))}
          <Display position={[w / 2 - 1.9, 2.05, b + 0.3]} w={2.6} h={1.5} seed={`${seed}-data`} kind="chart" />
          <Table position={[0, 0, b + 1.05]} w={w - 1.2} d={0.85} h={0.76} top="white" />
          {slots.length > 5 && <Table position={[0, 0, b + 2.75]} w={w - 2.2} d={0.8} h={0.74} top="wood" />}
          <Rug position={[0, 0, b + 2.4]} w={w - 2} d={1.8} layer={1} />
          {[-1.6, 1.6].map((x) => (
            <Pouf key={x} position={[x, 0, b + 2.5]} color={x > 0 ? 2 : 1} />
          ))}
          <Plant position={[w / 2 - 0.5, 0, b + 2.6]} variant={2} tall />
        </group>
      );
    }
    case "lab-bench":
      return (
        <group>
          <Display position={[0, 2.05, b + 0.3]} w={w * 0.55} h={1.25} seed={`${seed}-wall`} kind="chart" />
          <Counter position={[0, 0, b + 2.25]} w={w * 0.62} d={1.3} h={0.95} />
          {[-1.6, -0.5, 0.6, 1.7].map((x) => (
            <Stool key={x} position={[x * (w / 9), 0, b + 3.35]} />
          ))}
          <Box p={[-w / 2 + 0.9, 0.5, b + 0.5]} s={[1.2, 1.0, 0.5]} m={m.white} cast />
          <Beakers position={[-w / 2 + 0.7, 1.0, b + 0.5]} />
          <Microscope position={[-w / 2 + 1.15, 1.0, b + 0.5]} />
          <Box p={[w / 2 - 0.9, 0.5, b + 0.5]} s={[1.2, 1.0, 0.5]} m={m.white} cast />
          <Plant position={[w / 2 - 0.9, 1.0, b + 0.5]} variant={0} />
          {slots.length > 4 && <Table position={[0, 0, b + 0.95]} w={w - 3.6} d={0.7} h={0.74} top="white" />}
        </group>
      );
    case "bookshelf": {
      // Shelves fill the back wall; count adapts to the booth width.
      const n = Math.max(1, Math.min(4, Math.floor((w - 1.4) / 1.95)));
      return (
        <group>
          {evenly(n, Math.max(0, w - 3.2)).map((x, i) => (
            <Bookshelf key={x} position={[x, 0, b + 0.45]} w={1.8} h={2.3} seed={`${seed}${i}`} />
          ))}
          <Table position={[0, 0, b + 2.3]} w={Math.min(4.2, w - 1.6)} d={1.1} h={0.75} />
          {[-1.2, 0, 1.2].map((x) => (
            <Chair key={x} position={[x, 0, b + 3.1]} rotation={Math.PI} />
          ))}
        </group>
      );
    }
    case "archive-cabinet": {
      const n = Math.max(2, Math.min(5, Math.floor((w - 1) / 1.4)));
      return (
        <group>
          {evenly(n, w - 2.2).map((x, i) => (
            <group key={i} position={[x, 0, b + 0.5]}>
              <Box p={[0, 0.8, 0]} s={[1.25, 1.6, 0.55]} m={m.white} cast />
              {[0, 1, 2].map((k) => (
                <Box key={k} p={[0, 0.35 + k * 0.48, 0.28]} s={[1.1, 0.04, 0.02]} m={m.wood} />
              ))}
            </group>
          ))}
          <Table position={[0, 0, b + 2.3]} w={Math.min(4.2, w - 1.6)} d={1.1} h={0.75} top="white" />
          <Plant position={[w / 2 - 0.6, 0, b + 2.3]} variant={1} />
        </group>
      );
    }
    case "gallery-wall":
      return (
        <group>
          {[-w * 0.3, 0, w * 0.3].map((x, i) => (
            <Frame key={x} position={[x, 2.1, b + 0.28]} w={1.6} h={1.1} seed={`${seed}${i}`} />
          ))}
          {pedestals(1.0)}
        </group>
      );
    case "badge-wall":
      return (
        <group>
          <Box p={[0, 2.3, b + 0.27]} s={[w - 1.4, 0.06, 0.02]} m={accentMat("#d9b24a", 0.3)} />
          {Array.from({ length: 7 }, (_, i) => (
            <Cyl key={i} p={[-w * 0.33 + i * (w * 0.11), 1.95, b + 0.28]} r={[Math.PI / 2, 0, 0]} s={[0.36, 0.04, 0.36]} m={i % 2 ? a : accentMat("#d9b24a", 0.15)} />
          ))}
          {pedestals(1.0)}
        </group>
      );
    case "timeline":
      return (
        <group>
          <Box p={[0, 1.95, b + 0.28]} s={[w - 1.4, 0.05, 0.02]} m={a} />
          {Array.from({ length: 6 }, (_, i) => (
            <Sphere key={i} p={[-w * 0.38 + i * (w * 0.152), 1.95, b + 0.3]} s={0.14} m={i === 5 ? accentMat(accent, 0.6) : m.white} />
          ))}
          {pedestals(1.0)}
        </group>
      );
    case "seminar":
      return (
        <group>
          <Display position={[w * 0.08, 2.05, b + 0.3]} w={w * 0.5} h={1.4} seed={`${seed}-slides`} kind="screen" />
          <Box p={[w / 2 - 1.2, 0.55, b + 1.1]} s={[0.6, 1.1, 0.45]} m={m.wood} cast />
          <Table position={[-w * 0.12, 0, b + 1.25]} w={w * 0.5} d={0.75} h={0.75} top="white" />
          {/* audience: rows and seats scale with the booth (deep stage zones get more rows) */}
          {Array.from({ length: Math.max(2, Math.min(5, Math.floor((d - 3.0) / 1.0))) }, (_, r) =>
            evenly(Math.max(4, Math.min(7, Math.floor((w * 0.7) / 1.1))), Math.min(w * 0.68, 7)).map((x) => (
              <Chair key={`${r}${x}`} position={[x, 0, b + 2.6 + r * 1.0]} rotation={Math.PI} />
            )),
          )}
        </group>
      );
    case "smart-classroom":
      return (
        <group>
          <Display position={[0, 2.05, b + 0.3]} w={w * 0.58} h={1.4} seed={`${seed}-board`} kind="screen" />
          <Table position={[0, 0, b + 1.3]} w={w * 0.58} d={0.8} h={0.75} top="white" />
          {deskColumns(w).map((x) =>
            [0, 1].map((r) => (
              <group key={`${x}${r}`}>
                <Table position={[x, 0, b + 2.4 + r * 1.1]} w={1.5} d={0.6} h={0.72} />
                <Box p={[x, 0.76, b + 2.4 + r * 1.1]} r={[-Math.PI / 2 + 0.05, 0, 0]} s={[0.36, 0.26, 0.02]} m={m.screen} />
              </group>
            )),
          )}
          {/* large wings get media-analysis stations at the sides */}
          {w >= 11 &&
            [-1, 1].map((sd) => <MediaKiosk key={sd} position={[sd * (w / 2 - 1.0), 0, b + 1.2]} rotation={-sd * 0.35} seed={`${seed}-k${sd}`} />)}
        </group>
      );
    case "lounge":
      return (
        <group>
          <Rug position={[0, 0, b + 2.2]} w={4} d={2.6} color="green" layer={1} />
          <Sofa position={[0, 0, b + 0.9]} color="cream" />
          <Armchair position={[-1.9, 0, b + 2.4]} rotation={Math.PI / 2} />
          <CoffeeTable position={[0, 0, b + 2.2]} />
          <Plant position={[1.9, 0, b + 0.8]} variant={0} tall />
        </group>
      );
    default:
      return null;
  }
});
