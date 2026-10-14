"use client";

import { isNew } from "@/lib/building";
import { statusColor, statusLabel } from "@/lib/labels";
import type { ItemStatus } from "@/lib/types";

export function NewBadge({ date, className = "" }: { date: string; className?: string }) {
  if (!isNew(date)) return null;
  return <span className={`badge-new ${className}`}>NEW</span>;
}

export function StatusBadge({ status }: { status?: ItemStatus }) {
  if (!status) return null;
  return (
    <span className="badge-status" style={{ background: statusColor[status] }}>
      {statusLabel[status]}
    </span>
  );
}

const PALETTES = [
  ["#3f7fd6", "#f2c14e", "#f7f3ea"],
  ["#e07a5f", "#81b29a", "#f4efe6"],
  ["#5b6fd6", "#9ad1d4", "#fdf6e3"],
  ["#4a9a7c", "#c9a14a", "#f4efe6"],
  ["#8a4fc0", "#4fb0c6", "#fbf7ef"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Thumbnail image, or deterministic placeholder art when none is provided. */
export function Thumb({
  src,
  alt,
  seed,
  className = "",
}: {
  src?: string;
  alt: string;
  seed: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
  }
  const h = hash(seed);
  const [a, b, bg] = PALETTES[h % PALETTES.length];
  const cx = 30 + (h % 40);
  const cy = 25 + ((h >> 3) % 30);
  return (
    <svg viewBox="0 0 160 100" role="img" aria-label={alt} className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="160" height="100" fill={bg} />
      <circle cx={cx + 60} cy={cy + 20} r={28 + (h % 12)} fill={a} opacity="0.9" />
      <rect x={cx - 20} y={cy} width={46} height={46} rx="8" fill={b} opacity="0.9" />
      <rect x="14" y="78" width="72" height="6" rx="3" fill="#ffffff" opacity="0.85" />
      <rect x="14" y="88" width="44" height="5" rx="2.5" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}
