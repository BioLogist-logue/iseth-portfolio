import * as THREE from "three";

const TEXTURE_SLOTS = ["map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap", "alphaMap", "aoMap"] as const;

/** Every texture referenced by materials under `root`. */
export function collectTextures(root: THREE.Object3D) {
  const out = new Set<THREE.Texture>();
  root.traverse((o) => {
    const mat = (o as THREE.Mesh).material;
    if (!mat) return;
    for (const m of Array.isArray(mat) ? mat : [mat]) {
      const rec = m as unknown as Record<string, unknown>;
      for (const slot of TEXTURE_SLOTS) {
        const t = rec[slot];
        if (t instanceof THREE.Texture) out.add(t);
      }
    }
  });
  return out;
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Get a freshly mounted subtree GPU-ready before it is revealed:
 * upload its textures, compile its shader programs (async where supported,
 * so the main thread keeps animating the elevator), then let one frame render.
 */
export async function prepareForReveal(
  gl: THREE.WebGLRenderer,
  root: THREE.Object3D,
  camera: THREE.Camera,
  scene: THREE.Scene,
) {
  for (const t of collectTextures(root)) gl.initTexture(t);
  try {
    await gl.compileAsync(root, camera, scene);
  } catch {
    gl.compile(root, camera, scene);
  }
  await nextFrame();
  await nextFrame();
}
