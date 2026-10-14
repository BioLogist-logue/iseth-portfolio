"use client";

import { Html } from "@react-three/drei";
import type { ReactNode } from "react";

type V3 = [number, number, number];

/**
 * DOM label anchored to a 3D point. Korean text stays real, crisp HTML
 * (never baked into textures). z-index is kept below the 2D UI layers.
 */
export function Label({
  position,
  children,
  className = "",
  interactive = false,
  hidden = false,
}: {
  position: V3;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  hidden?: boolean;
}) {
  return (
    <Html position={position} center zIndexRange={[20, 10]} style={{ pointerEvents: interactive ? "auto" : "none" }}>
      <div className={`scene-label ${hidden ? "scene-label--hidden" : ""} ${className}`} aria-hidden={!interactive}>
        {children}
      </div>
    </Html>
  );
}
