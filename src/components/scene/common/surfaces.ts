import * as THREE from "three";
import { carpetTexture, tileTexture, woodFloorTexture } from "./textures";

/**
 * Cached floor/deck surface materials. Floors are shared by every floor that
 * uses the same finish, so switching floors never re-creates textures or
 * materials (and never re-uploads them to the GPU).
 */

export type FloorFinish = "light" | "mid" | "dark" | "carpet" | "stone" | "plaza";

const cache = new Map<string, THREE.MeshStandardMaterial>();

function repeated(base: THREE.Texture, rx: number, ry: number) {
  const t = base.clone();
  t.needsUpdate = true;
  t.repeat.set(rx, ry);
  return t;
}

export function floorMaterial(finish: FloorFinish, carpet?: string, repeat?: [number, number]) {
  const key = `${finish}|${carpet ?? ""}|${repeat?.join("x") ?? ""}`;
  let m = cache.get(key);
  if (m) return m;
  let tex: THREE.Texture;
  if (finish === "carpet") tex = carpetTexture(carpet);
  else if (finish === "stone" || finish === "plaza") tex = tileTexture();
  else tex = woodFloorTexture(finish);
  const [rx, ry] = repeat ?? (finish === "stone" ? [9, 7] : [5, 4]);
  m = new THREE.MeshStandardMaterial({
    map: repeated(tex, rx, ry),
    roughness: finish === "stone" ? 0.6 : finish === "plaza" ? 0.9 : 0.75,
    // No polygonOffset: surfaces are separated geometrically instead. A slope-
    // scaled offset here pushed the floor behind the slab just below it at
    // grazing camera angles — the very artefact we are avoiding.
  });
  cache.set(key, m);
  return m;
}

/** All cached surface textures, for GPU pre-upload. */
export function surfaceTextures() {
  return [...cache.values()].map((m) => m.map).filter(Boolean) as THREE.Texture[];
}
