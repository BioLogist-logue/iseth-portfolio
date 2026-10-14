import * as THREE from "three";

/**
 * Procedural canvas textures. Generated once on the client and cached, so the
 * scene ships no image assets. No readable text is baked except the English
 * brand sign, which is drawn with a system font at runtime.
 */

const cache = new Map<string, THREE.Texture>();

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  draw(g);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  cache.set(key, tex);
  return tex;
}

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function woodFloorTexture(tone: "light" | "mid" | "dark" = "light") {
  const base = { light: [222, 186, 140], mid: [204, 160, 110], dark: [150, 110, 76] }[tone];
  return make(`wood-floor-${tone}`, 512, 512, (g) => {
    const r = rng(tone);
    const plankH = 64;
    for (let y = 0; y < 512; y += plankH) {
      let x = -Math.floor(r() * 256);
      while (x < 512) {
        const len = 180 + r() * 200;
        const v = (r() - 0.5) * 22;
        g.fillStyle = `rgb(${base[0] + v},${base[1] + v * 0.9},${base[2] + v * 0.7})`;
        g.fillRect(x, y, len, plankH);
        g.globalAlpha = 0.07;
        for (let k = 0; k < 6; k++) {
          g.fillStyle = r() > 0.5 ? "#7a5030" : "#fff3dc";
          g.fillRect(x, y + r() * plankH, len, 1 + r() * 2);
        }
        g.globalAlpha = 1;
        g.fillStyle = "rgba(90,60,30,0.16)";
        g.fillRect(x, y, 2, plankH);
        x += len;
      }
      g.fillStyle = "rgba(90,60,30,0.13)";
      g.fillRect(0, y, 512, 2);
    }
  }, [4, 4]);
}

export function woodGrainTexture() {
  // Calm, stylised grain: soft long streaks with low contrast, warm base.
  return make("wood-grain", 256, 256, (g) => {
    const r = rng("grain");
    g.fillStyle = "#c99560";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 36; i++) {
      const x = r() * 256;
      const w = 2 + r() * 6;
      g.fillStyle = r() > 0.5 ? "rgba(120,72,34,0.06)" : "rgba(255,232,196,0.08)";
      g.fillRect(x, 0, w, 256);
    }
    for (let i = 0; i < 18; i++) {
      g.fillStyle = "rgba(110,66,30,0.07)";
      g.fillRect(r() * 256, 0, 1, 256);
    }
  }, [1, 1]);
}

export function tileTexture(dark = false) {
  return make(`tiles-${dark}`, 256, 256, (g) => {
    const r = rng("tiles");
    const s = 64;
    for (let y = 0; y < 256; y += s)
      for (let x = 0; x < 256; x += s) {
        const v = (r() - 0.5) * 10;
        g.fillStyle = dark ? `rgb(${120 + v},${118 + v},${115 + v})` : `rgb(${236 + v},${228 + v},${216 + v})`;
        g.fillRect(x, y, s, s);
      }
    g.strokeStyle = dark ? "rgba(0,0,0,0.25)" : "rgba(150,130,110,0.35)";
    g.lineWidth = 2;
    for (let i = 0; i <= 256; i += s) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 256);
      g.moveTo(0, i);
      g.lineTo(256, i);
      g.stroke();
    }
  }, [10, 10]);
}

export function carpetTexture(color = "#b9ab98") {
  return make(`carpet-${color}`, 128, 128, (g) => {
    const r = rng(color);
    g.fillStyle = color;
    g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 1800; i++) {
      g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
      g.fillRect(r() * 128, r() * 128, 1, 1);
    }
  }, [8, 8]);
}

const ART_PALETTES = [
  ["#3f7fd6", "#f2c14e", "#f7f3ea", "#2f9a5a"],
  ["#e07a5f", "#3d405b", "#81b29a", "#f2cc8f"],
  ["#5b6fd6", "#9ad1d4", "#fdf6e3", "#e0a458"],
  ["#4a9a7c", "#c9a14a", "#f4efe6", "#d0453a"],
  ["#8a4fc0", "#4fb0c6", "#fbf7ef", "#f2a541"],
];

/** Abstract art / screen content seeded by a string. */
export function artTexture(seed: string, kind: "art" | "chart" | "screen" | "cover" = "art") {
  return make(`art-${kind}-${seed}`, 256, 192, (g) => {
    const r = rng(seed);
    const pal = ART_PALETTES[Math.floor(r() * ART_PALETTES.length)];
    if (kind === "screen" || kind === "chart") {
      g.fillStyle = kind === "screen" ? "#eef3fb" : "#f7f9fc";
      g.fillRect(0, 0, 256, 192);
      g.fillStyle = pal[0];
      g.fillRect(0, 0, 256, 22);
      if (kind === "chart" || r() > 0.5) {
        const n = 6 + Math.floor(r() * 4);
        for (let i = 0; i < n; i++) {
          const h = 30 + r() * 110;
          g.fillStyle = pal[i % 2 ? 1 : 3];
          g.fillRect(22 + i * (210 / n), 178 - h, (210 / n) * 0.6, h);
        }
        g.strokeStyle = pal[0];
        g.lineWidth = 3;
        g.beginPath();
        for (let i = 0; i < 12; i++) g.lineTo(18 + i * 20, 120 - r() * 70);
        g.stroke();
      } else {
        for (let i = 0; i < 6; i++) {
          g.fillStyle = pal[i % pal.length];
          g.globalAlpha = 0.85;
          g.fillRect(16 + (i % 3) * 78, 36 + Math.floor(i / 3) * 74, 66, 62);
        }
        g.globalAlpha = 1;
      }
      return;
    }
    g.fillStyle = pal[2];
    g.fillRect(0, 0, 256, 192);
    for (let i = 0; i < 5; i++) {
      g.fillStyle = pal[Math.floor(r() * pal.length)];
      g.globalAlpha = 0.9;
      const x = r() * 256;
      const y = r() * 192;
      const s = 30 + r() * 80;
      if (r() > 0.5) {
        g.beginPath();
        g.arc(x, y, s / 2, 0, Math.PI * 2);
        g.fill();
      } else g.fillRect(x - s / 2, y - s / 2, s, s * (0.5 + r()));
    }
    g.globalAlpha = 1;
    if (kind === "cover") {
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.fillRect(24, 130, 208, 10);
      g.fillRect(24, 148, 140, 8);
    }
  });
}

export function booksTexture(seed = "books") {
  return make(`books-${seed}`, 256, 64, (g) => {
    const r = rng(seed);
    const cols = ["#3f7fd6", "#e0a458", "#4a9a7c", "#d0453a", "#f4efe6", "#8a4fc0", "#2f4a6a", "#c9a14a"];
    g.fillStyle = "#e9d8bd";
    g.fillRect(0, 0, 256, 64);
    let x = 0;
    while (x < 256) {
      const w = 6 + r() * 10;
      const h = 40 + r() * 24;
      g.fillStyle = cols[Math.floor(r() * cols.length)];
      g.fillRect(x, 64 - h, w - 1, h);
      x += w;
    }
  });
}

/** English brand sign only — Korean text is always rendered in the DOM. */
export function signTexture(text: string, sub?: string) {
  return make(`sign-${text}-${sub}`, 1024, sub ? 256 : 160, (g) => {
    g.fillStyle = "#fbf8f2";
    g.fillRect(0, 0, 1024, sub ? 256 : 160);
    g.fillStyle = "#2a2622";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `700 ${sub ? 96 : 92}px "Pretendard Variable", Pretendard, "Segoe UI", Arial, sans-serif`;
    g.fillText(text, 512, sub ? 100 : 82);
    if (sub) {
      g.fillStyle = "#8a6a44";
      g.font = `500 48px "Pretendard Variable", Pretendard, "Segoe UI", Arial, sans-serif`;
      g.fillText(sub, 512, 196);
    }
  });
}

export function skyGradientTexture(top: string, mid: string, bottom: string) {
  return make(`sky-${top}-${mid}-${bottom}`, 4, 256, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, top);
    grad.addColorStop(0.55, mid);
    grad.addColorStop(1, bottom);
    g.fillStyle = grad;
    g.fillRect(0, 0, 4, 256);
  });
}

/** Stylised glazing colour: pale sky at the top, slightly deeper below, one soft diagonal highlight. */
export function glassSheenTexture() {
  return make("glass-sheen", 64, 256, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#eef6f8");
    grad.addColorStop(0.45, "#c6dde5");
    grad.addColorStop(1, "#a7c4cf");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 256);
    g.globalAlpha = 0.35;
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.moveTo(0, 70);
    g.lineTo(64, 20);
    g.lineTo(64, 44);
    g.lineTo(0, 94);
    g.fill();
    g.globalAlpha = 1;
  });
}

const alphaCache = new Map<string, THREE.Texture>();
/** Glass alpha (linear, not sRGB): more reflective at the top, clearer at eye level. */
export function glassAlphaTexture() {
  const hit = alphaCache.get("glass");
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "rgb(150,150,150)");
  grad.addColorStop(0.35, "rgb(92,92,92)");
  grad.addColorStop(1, "rgb(58,58,58)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 256);
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.beginPath();
  g.moveTo(0, 70);
  g.lineTo(32, 45);
  g.lineTo(32, 69);
  g.lineTo(0, 94);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  alphaCache.set("glass", t);
  return t;
}
