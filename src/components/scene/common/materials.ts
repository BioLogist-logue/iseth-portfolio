import * as THREE from "three";
import { glassAlphaTexture, glassSheenTexture, woodGrainTexture } from "./textures";

/**
 * Shared material library. Every prop pulls from here so materials are
 * created once and reused across floors (fewer shader programs, less memory).
 */

type Std = THREE.MeshStandardMaterial;

let lib: ReturnType<typeof build> | null = null;

function std(color: string, opts: THREE.MeshStandardMaterialParameters = {}): Std {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...opts });
}

function build() {
  const grain = woodGrainTexture();
  return {
    white: std("#f6f3ee", { roughness: 0.85, emissive: new THREE.Color("#ffe6c4"), emissiveIntensity: 0 }),
    offWhite: std("#ebe5da", { roughness: 0.9 }),
    plaster: std("#f3eee6", { roughness: 0.95 }),
    // Ceilings face down, away from the key light — give them a soft self-light.
    ceiling: std("#f7f2ea", { roughness: 1, emissive: new THREE.Color("#fff3e2"), emissiveIntensity: 0.55 }),
    // One warm wood family (main / light / dark share a hue).
    wood: std("#ffffff", { map: grain, roughness: 0.62 }),
    woodLight: std("#dcb68a", { roughness: 0.65 }),
    woodDark: std("#8b6142", { roughness: 0.7 }),
    // Architecture
    facade: std("#f4efe7", { roughness: 0.72, emissive: new THREE.Color("#ffe6c4"), emissiveIntensity: 0 }),
    frame: std("#ece6dc", { roughness: 0.45, metalness: 0.15 }),
    reveal: std("#cfc6b8", { roughness: 0.9 }),
    // Architectural glass: tinted, reflective (via the environment), not see-through-flat.
    // No transmission pass — reflections + fresnel come from the env map, which is cheap.
    // A soft vertical sheen (brighter top, clearer bottom) + faint diagonal
    // highlight keeps glass readable without hiding the interior behind it.
    glass: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      map: glassSheenTexture(),
      alphaMap: glassAlphaTexture(),
      transparent: true,
      opacity: 1,
      roughness: 0.08,
      metalness: 0,
      ior: 1.5,
      reflectivity: 0.6,
      envMapIntensity: 1.7,
      depthWrite: false,
    }),
    glassRail: new THREE.MeshPhysicalMaterial({
      color: "#cfe3ea",
      transparent: true,
      opacity: 0.2,
      roughness: 0.06,
      metalness: 0,
      reflectivity: 0.5,
      envMapIntensity: 1.4,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    metal: std("#d3d6d9", { metalness: 0.4, roughness: 0.35 }),
    steel: std("#c9cdd2", { metalness: 0.45, roughness: 0.3 }),
    dark: std("#2b2e33", { roughness: 0.6 }),
    screen: std("#1d2430", { roughness: 0.3, metalness: 0.2 }),
    leaf1: std("#6fa45a", { roughness: 0.9, flatShading: true }),
    leaf2: std("#4f8a46", { roughness: 0.9, flatShading: true }),
    leaf3: std("#8dbf62", { roughness: 0.9, flatShading: true }),
    trunk: std("#8a6446", { roughness: 0.9 }),
    pot: std("#f1ede6", { roughness: 0.8 }),
    potStone: std("#d9d3c8", { roughness: 0.9 }),
    soil: std("#8a6a4e", { roughness: 1 }),
    earth: std("#9b7c5c", { roughness: 1 }),
    earthDark: std("#6f553e", { roughness: 1 }),
    grass: std("#86b85f", { roughness: 1 }),
    hedge: std("#5f9450", { roughness: 0.95, flatShading: true }),
    stone: std("#e4ddd0", { roughness: 0.9, emissive: new THREE.Color("#ffd9a8"), emissiveIntensity: 0 }),
    concrete: std("#d6d0c6", { roughness: 0.95 }),
    fabricGreen: std("#7f9a6a", { roughness: 1 }),
    fabricCream: std("#ece3d3", { roughness: 1 }),
    fabricGrey: std("#a8a39b", { roughness: 1 }),
    rug: std("#d8cfc0", { roughness: 1 }),
    flowerPink: std("#f2a7b8", { roughness: 0.9 }),
    flowerWhite: std("#fbf6ee", { roughness: 0.9 }),
    flowerYellow: std("#f4cf5d", { roughness: 0.9 }),
    // Theme-driven emissives
    interiorGlow: std("#fff3df", { emissive: new THREE.Color("#ffd49a"), emissiveIntensity: 0.25 }),
    lamp: std("#fff6e6", { emissive: new THREE.Color("#ffdca8"), emissiveIntensity: 0.8 }),
    cove: std("#fff6e6", { emissive: new THREE.Color("#ffd08a"), emissiveIntensity: 0.9 }),
    window: std("#cfe6f5", { emissive: new THREE.Color("#cfe6f5"), emissiveIntensity: 0.55, roughness: 0.2 }),
    bulb: std("#fff2c8", { emissive: new THREE.Color("#ffd27a"), emissiveIntensity: 0.4 }),
    // "Lit" variants for interiors seen through exterior glass — glow at night.
    litWood: std("#d9a46a", { emissive: new THREE.Color("#c98a4a"), emissiveIntensity: 0.05, roughness: 0.8 }),
    litWhite: std("#f1e4cf", { emissive: new THREE.Color("#ffe2b8"), emissiveIntensity: 0.14 }),
    litFloor: std("#e2bf8f", { emissive: new THREE.Color("#e0a868"), emissiveIntensity: 0.05 }),
    // Mid-tone for furniture silhouettes seen through the facade (reads against pale walls).
    silhouette: std("#cdbca6", { roughness: 0.85 }),
    // Darker inner face of window frames, for depth.
    frameInner: std("#8f8a83", { roughness: 0.6 }),
    // Opaque lower facade panels (spandrels) in selected bays.
    spandrel: std("#e4ddd2", { roughness: 0.8, emissive: new THREE.Color("#ffe2bd"), emissiveIntensity: 0 }),
  };
}

export type Mats = ReturnType<typeof build>;

/**
 * Three interior "glow tiers" (wall / floor / ceiling light) seen through the
 * exterior glass. Floors cycle through them so brightness varies slightly
 * from floor to floor while every floor still shares materials.
 */
const TIER_SCALE = [0.85, 1.0, 1.2];
const TIER_TINT = ["#ffe0b4", "#ffe6c2", "#ffd9a6"];
type Tier = { wall: Std; floor: Std; lamp: Std };
let tiers: Tier[] | null = null;
export function glowTier(i: number): Tier {
  tiers ??= TIER_SCALE.map((_, k) => ({
    wall: std("#f1e4cf", { emissive: new THREE.Color(TIER_TINT[k]), emissiveIntensity: 0.2 }),
    floor: std("#e2bf8f", { emissive: new THREE.Color("#e0a868"), emissiveIntensity: 0.12 }),
    lamp: std("#fff6e6", { emissive: new THREE.Color("#ffdca8"), emissiveIntensity: 0.9 }),
  }));
  return tiers[((i % 3) + 3) % 3];
}

function applyTiers(night: boolean) {
  if (!tiers) glowTier(0);
  tiers!.forEach((t, k) => {
    const f = TIER_SCALE[k];
    t.wall.emissiveIntensity = (night ? 0.72 : 0.2) * f;
    t.floor.emissiveIntensity = (night ? 0.5 : 0.12) * f;
    t.lamp.emissiveIntensity = (night ? 2.6 : 0.9) * f;
  });
}

export function mats(): Mats {
  lib ??= build();
  return lib;
}

const accentCache = new Map<string, Std>();
export function accentMat(color: string, emissive = 0) {
  const key = `${color}-${emissive}`;
  let m = accentCache.get(key);
  if (!m) {
    m = std(color, { roughness: 0.6, emissive: new THREE.Color(color), emissiveIntensity: emissive });
    accentCache.set(key, m);
  }
  return m;
}

const texMatCache = new Map<THREE.Texture, Std>();
/** Self-lit material for screens / artwork so they read in both themes. */
export function texMat(tex: THREE.Texture, glow = 0.35) {
  let m = texMatCache.get(tex);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color("#ffffff"), emissiveIntensity: glow, roughness: 0.5 });
    texMatCache.set(tex, m);
  }
  return m;
}

export function applyThemeToMaterials(theme: "light" | "dark") {
  const m = mats();
  const night = theme === "dark";
  m.interiorGlow.emissiveIntensity = night ? 1.15 : 0.22;
  m.lamp.emissiveIntensity = night ? 2.4 : 0.8;
  m.cove.emissiveIntensity = night ? 2.0 : 0.9;
  m.bulb.emissiveIntensity = night ? 3.0 : 0.3;
  m.window.color.set(night ? "#1c2850" : "#cfe6f5");
  m.window.emissive.set(night ? "#2a3a6a" : "#d6ecf8");
  m.window.emissiveIntensity = night ? 0.35 : 0.6;
  // Warm "uplight" on white slabs and paving after dark.
  m.white.emissiveIntensity = night ? 0.16 : 0;
  m.facade.emissiveIntensity = night ? 0.2 : 0;
  // Glass lets more of the warm interior through after dark, reflects more by day.
  m.glass.opacity = night ? 0.55 : 1;
  m.glass.envMapIntensity = night ? 0.7 : 1.3;
  m.spandrel.emissiveIntensity = night ? 0.12 : 0;
  applyTiers(night);
  m.stone.emissiveIntensity = night ? 0.1 : 0;
  // Warm interior light reads through the glass by day too, stronger at night.
  m.litWood.emissiveIntensity = night ? 0.55 : 0.12;
  m.litWhite.emissiveIntensity = night ? 0.75 : 0.22;
  m.litFloor.emissiveIntensity = night ? 0.6 : 0.14;
}
