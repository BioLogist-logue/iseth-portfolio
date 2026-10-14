"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { directoryOrder, floorHasNew, floorLabel, itemsOfZone, zonesOf } from "@/lib/building";
import { typeLabel } from "@/lib/labels";
import { useTower } from "@/store/tower";
import { NewBadge } from "./bits";

/**
 * Plain 2D directory of the whole building — the non-3D fallback.
 * Fully keyboard navigable; used as the main view when WebGL is unavailable.
 */
export function DirectoryView({ standalone = false }: { standalone?: boolean }) {
  const open = useTower((s) => s.directoryOpen);
  const setOpen = useTower((s) => s.setDirectoryOpen);
  const openItem = useTower((s) => s.openItem);
  const navigate = useTower((s) => s.navigate);
  const reduced = useTower((s) => s.reducedMotion);
  const closeRef = useRef<HTMLButtonElement>(null);
  const show = standalone || open;

  useEffect(() => {
    if (open) requestAnimationFrame(() => closeRef.current?.focus());
  }, [open]);

  const body = (
    <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-6 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Building Directory</p>
          <h2 className="text-2xl font-bold text-[var(--ink-1)]">전체 층 안내</h2>
          <p className="mt-1 text-sm text-[var(--ink-3)]">
            {standalone ? "이 기기에서는 3D 화면을 표시할 수 없어 목록으로 보여 드립니다." : "3D 공간을 거치지 않고 바로 찾아볼 수 있습니다."}
          </p>
        </div>
        {!standalone && (
          <button ref={closeRef} type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="목록 닫기">
            <X size={20} />
          </button>
        )}
      </header>
      {directoryOrder.map((f) => {
        const zones = zonesOf(f.id);
        return (
          <section key={f.id} aria-labelledby={`dir-${f.id}`} className="space-y-3">
            <h3 id={`dir-${f.id}`} className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
              <span className="floor-chip" style={{ background: f.accent }}>
                {floorLabel(f)}
              </span>
              <span className="text-lg font-bold text-[var(--ink-1)]">{f.name}</span>
              {f.nameEn && <span className="text-xs text-[var(--ink-3)]">{f.nameEn}</span>}
              {floorHasNew(f.id) && <span className="badge-new">NEW</span>}
              {!standalone && (
                <button type="button" className="btn btn--sm ml-auto" onClick={() => void navigate({ floorId: f.id })}>
                  이동
                </button>
              )}
            </h3>
            <p className="text-sm text-[var(--ink-2)]">{f.description}</p>
            {zones.map((z) => {
              const items = itemsOfZone(z.id);
              if (!items.length) return null;
              return (
                <div key={z.id} className="space-y-1.5 pl-1">
                  <h4 className="text-sm font-semibold text-[var(--ink-1)]">{z.name}</h4>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {items.map((it) => (
                      <li key={it.id}>
                        <button type="button" className="item-row" onClick={() => openItem(it.id)}>
                          <span className="min-w-0 flex-1 text-left">
                            <span className="line-clamp-2 text-sm text-[var(--ink-1)]">{it.title}</span>
                            <span className="flex items-center gap-1 text-[11px] text-[var(--ink-3)]">
                              {typeLabel[it.type]} <NewBadge date={it.publishedAt} />
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );

  if (standalone) return <main className="directory-page">{body}</main>;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="전체 층 안내"
          className="directory-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          {body}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
