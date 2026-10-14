"use client";

import { memo } from "react";
import type { MiniInteriorKind } from "@/lib/archetypes";
import { mats, texMat } from "../common/materials";
import { G, Box, Ico, PotTaper } from "../common/primitives";
import { artTexture, booksTexture } from "../common/textures";

/**
 * Low-detail interior seen through the exterior glass. One "variation module"
 * per scene template so each floor reads differently from outside.
 * Origin: floor centre; back wall at z = -d/2; glass at z = +d/2.
 */
export const MiniInterior = memo(function MiniInterior({
  type,
  w,
  d,
  h,
  seed,
  lowDetail,
}: {
  type: MiniInteriorKind;
  w: number;
  d: number;
  h: number;
  seed: string;
  lowDetail?: boolean;
}) {
  const m = mats();
  const bz = -d / 2 + 0.25;
  const art = (i: number, k: "art" | "chart" | "screen" = "art") => texMat(artTexture(`${seed}-${i}`, k), 0.45);
  const books = texMat(booksTexture(seed), 0.3);
  const xs = [-w * 0.32, 0, w * 0.32];

  const pieces: React.ReactNode[] = [];
  switch (type) {
    case "library":
    case "archive":
      xs.forEach((x, i) =>
        pieces.push(
          <mesh key={`s${i}`} position={[x, 0.95, bz + 0.1]} material={type === "archive" && i === 1 ? m.litWood : books} geometry={G.box} scale={[w * 0.26, 1.8, 0.35]} />,
        ),
      );
      pieces.push(<Box key="t" p={[0, 0.4, 0.6]} s={[w * 0.4, 0.08, 0.9]} m={m.litWood} />);
      break;
    case "lab":
      pieces.push(<mesh key="sc" position={[-w * 0.18, 1.7, bz]} material={art(0, "screen")} geometry={G.plane} scale={[w * 0.36, 0.9, 1]} />);
      pieces.push(<mesh key="sc2" position={[w * 0.24, 1.7, bz]} material={art(1, "chart")} geometry={G.plane} scale={[w * 0.3, 0.9, 1]} />);
      pieces.push(<Box key="b1" p={[-w * 0.2, 0.45, 0.2]} s={[w * 0.36, 0.9, 0.8]} m={m.litWhite} />);
      pieces.push(<Box key="b2" p={[w * 0.22, 0.45, 0.6]} s={[w * 0.3, 0.9, 0.8]} m={m.litWhite} />);
      break;
    case "gallery":
      xs.forEach((x, i) =>
        pieces.push(<mesh key={`f${i}`} position={[x, 1.55, bz]} material={art(i)} geometry={G.plane} scale={[w * 0.2, 0.95, 1]} />),
      );
      [-w * 0.18, w * 0.18].forEach((x, i) => pieces.push(<Box key={`p${i}`} p={[x, 0.4, 0.4]} s={[0.4, 0.8, 0.4]} m={m.litWhite} />));
      break;
    case "conference":
      pieces.push(<mesh key="sc" position={[0, 1.6, bz]} material={art(0, "screen")} geometry={G.plane} scale={[w * 0.5, 1.1, 1]} />);
      for (let r = 0; r < 2; r++)
        pieces.push(<Box key={`r${r}`} p={[0, 0.35, 0.3 + r * 1.2]} s={[w * 0.6, 0.7, 0.45]} m={m.litWood} />);
      break;
    case "classroom":
      pieces.push(<mesh key="bd" position={[0, 1.6, bz]} material={art(2, "screen")} geometry={G.plane} scale={[w * 0.55, 1.0, 1]} />);
      for (let r = 0; r < 2; r++)
        for (let c = -1; c <= 1; c++)
          pieces.push(<Box key={`d${r}${c}`} p={[c * w * 0.26, 0.38, r * 1.3 + 0.1]} s={[w * 0.18, 0.08, 0.6]} m={m.litWood} />);
      break;
    case "office":
      pieces.push(<mesh key="sc" position={[0, 1.6, bz]} material={art(3, "chart")} geometry={G.plane} scale={[w * 0.45, 0.8, 1]} />);
      [-w * 0.25, w * 0.25].forEach((x, i) => pieces.push(<Box key={`d${i}`} p={[x, 0.4, 0.3]} s={[w * 0.3, 0.08, 0.8]} m={m.litWhite} />));
      break;
    case "lobby":
      pieces.push(<Box key="rc" p={[-w * 0.25, 0.5, -0.2]} s={[w * 0.35, 1.0, 0.7]} m={m.litWhite} />);
      pieces.push(<Box key="sf" p={[w * 0.22, 0.3, 0.5]} s={[w * 0.35, 0.6, 0.8]} m={m.fabricCream} />);
      pieces.push(<mesh key="ar" position={[-w * 0.2, 1.9, bz]} material={art(4)} geometry={G.plane} scale={[w * 0.5, 1.1, 1]} />);
      break;
    default:
      break;
  }

  return (
    <group>
      {/* floor, back wall, ceiling glow strip */}
      <Box p={[0, 0.01, 0]} s={[w, 0.02, d]} m={m.litFloor} />
      <Box p={[0, h / 2, -d / 2]} s={[w, h, 0.05]} m={m.litWhite} />
      <Box p={[0, h - 0.06, 0]} s={[w * 0.9, 0.04, 0.25]} m={m.lamp} />
      {pieces}
      {!lowDetail && (
        <>
          {[-w / 2 + 0.45, w / 2 - 0.45].map((x, i) => (
            <group key={i} position={[x, 0, d / 2 - 0.5]}>
              <PotTaper p={[0, 0.2, 0]} s={[0.36, 0.4, 0.36]} m={m.pot} />
              <Ico p={[0, 0.7, 0]} s={[0.55, 0.75, 0.55]} m={i ? m.leaf1 : m.leaf2} />
            </group>
          ))}
        </>
      )}
    </group>
  );
});
