/**
 * Tiny Web Audio synth for elevator sounds. No audio files are loaded.
 * The AudioContext is only created/resumed from a user gesture, which keeps
 * us within browser autoplay policies.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let hum: { stop: (fade?: number) => void } | null = null;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) stopHum(0.1);
  if (master && ctx) master.gain.setTargetAtTime(on ? 0.55 : 0, ctx.currentTime, 0.05);
}

/** Call from any user gesture handler. Safe to call repeatedly. */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.55 : 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function ready() {
  return enabled && ctx && master && ctx.state === "running" ? { ctx, out: master } : null;
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

export function playClick() {
  const a = ready();
  if (!a) return;
  const { ctx: c, out } = a;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(1500, t);
  o.frequency.exponentialRampToValueAtTime(900, t + 0.05);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.1);
}

/** Soft sliding whoosh with a low motor undertone. */
export function playDoor(kind: "open" | "close", seconds = 0.8) {
  const a = ready();
  if (!a) return;
  const { ctx: c, out } = a;
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, seconds + 0.2);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.8;
  const [f0, f1] = kind === "open" ? [500, 1100] : [1100, 450];
  bp.frequency.setValueAtTime(f0, t);
  bp.frequency.exponentialRampToValueAtTime(f1, t + seconds);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.12);
  g.gain.setValueAtTime(0.12, t + seconds - 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  src.connect(bp).connect(g).connect(out);
  src.start(t);
  src.stop(t + seconds + 0.2);

  const m = c.createOscillator();
  const mg = c.createGain();
  m.type = "sine";
  m.frequency.value = 95;
  mg.gain.setValueAtTime(0.0001, t);
  mg.gain.exponentialRampToValueAtTime(0.06, t + 0.1);
  mg.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  m.connect(mg).connect(out);
  m.start(t);
  m.stop(t + seconds + 0.05);

  if (kind === "close") {
    // gentle bump when the doors meet
    const k = c.createOscillator();
    const kg = c.createGain();
    k.frequency.setValueAtTime(140, t + seconds - 0.05);
    k.frequency.exponentialRampToValueAtTime(60, t + seconds + 0.1);
    kg.gain.setValueAtTime(0.0001, t + seconds - 0.05);
    kg.gain.exponentialRampToValueAtTime(0.18, t + seconds);
    kg.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.15);
    k.connect(kg).connect(out);
    k.start(t + seconds - 0.05);
    k.stop(t + seconds + 0.2);
  }
}

/** Mechanical travel hum. Returns when started; stop with stopHum(). */
export function startHum(seconds: number) {
  stopHum(0.05);
  const a = ready();
  if (!a) return;
  const { ctx: c, out } = a;
  const t = c.currentTime;
  const o1 = c.createOscillator();
  const o2 = c.createOscillator();
  o1.type = "sawtooth";
  o2.type = "sine";
  o1.frequency.setValueAtTime(48, t);
  o1.frequency.linearRampToValueAtTime(62, t + seconds * 0.5);
  o1.frequency.linearRampToValueAtTime(50, t + seconds);
  o2.frequency.value = 110;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  const nsrc = c.createBufferSource();
  nsrc.buffer = noiseBuffer(c, 1);
  nsrc.loop = true;
  const nf = c.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 400;
  const ng = c.createGain();
  ng.gain.value = 0.04;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.25);
  o1.connect(lp);
  o2.connect(lp);
  lp.connect(g);
  nsrc.connect(nf).connect(ng).connect(g);
  g.connect(out);
  o1.start(t);
  o2.start(t);
  nsrc.start(t);
  hum = {
    stop(fade = 0.3) {
      const now = c.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + fade);
      for (const s of [o1, o2, nsrc]) s.stop(now + fade + 0.05);
    },
  };
}

export function stopHum(fade = 0.3) {
  hum?.stop(fade);
  hum = null;
}

/** Single soft bell. No voice announcements. */
export function playDing() {
  const a = ready();
  if (!a) return;
  const { ctx: c, out } = a;
  const t = c.currentTime;
  const partials: [number, number][] = [
    [1318.5, 0.22],
    [1318.5 * 2.76, 0.05],
    [1318.5 * 5.4, 0.015],
  ];
  for (const [f, v] of partials) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + 1.7);
  }
}
