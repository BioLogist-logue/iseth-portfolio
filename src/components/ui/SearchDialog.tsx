"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, FileText, LayoutGrid, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { isNew } from "@/lib/building";
import { search, type SearchEntry } from "@/lib/search";
import { getItem } from "@/lib/building";
import { useTower } from "@/store/tower";

const ICON = { item: FileText, zone: LayoutGrid, floor: Building2 };
const KIND_LABEL = { item: "작품", zone: "구역", floor: "층" };
const SUGGEST = ["DNA", "AI 리터러시", "탐구", "Apps Script", "수행평가", "센서"];

/** Quick access: search by title, tag or type without walking the building. */
export function SearchDialog() {
  const open = useTower((s) => s.searchOpen);
  const setOpen = useTower((s) => s.setSearchOpen);
  const navigate = useTower((s) => s.navigate);
  const openItem = useTower((s) => s.openItem);
  const reduced = useTower((s) => s.reducedMotion);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q), [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);
  useEffect(() => setActive(0), [q]);

  const choose = (e: SearchEntry, go: boolean) => {
    setOpen(false);
    if (e.kind === "item") {
      if (go) void navigate({ floorId: e.floorId, zoneId: e.zoneId, itemId: e.id });
      else openItem(e.id);
    } else {
      void navigate({ floorId: e.floorId, zoneId: e.kind === "zone" ? e.zoneId : undefined });
    }
  };

  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (ev.key === "Enter" && results[active] && !ev.nativeEvent.isComposing) {
      ev.preventDefault();
      choose(results[active], ev.shiftKey);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="검색"
            className="search-dialog"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
              <Search size={18} className="shrink-0 text-[var(--ink-3)]" aria-hidden />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="작품 이름, 태그, 유형으로 검색 (예: DNA, 수행평가, 앱)"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--ink-1)] outline-none placeholder:text-[var(--ink-3)]"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${results[active].kind}-${results[active].id}` : undefined}
              />
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="검색 닫기">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!q && (
                <div className="p-3">
                  <p className="mb-2 text-xs text-[var(--ink-3)]">추천 검색어 · 초성 검색도 됩니다 (예: ㅅㅅ → 센서)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGEST.map((s) => (
                      <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {q && results.length === 0 && <p className="p-4 text-sm text-[var(--ink-3)]">‘{q}’에 대한 결과가 없습니다.</p>}
              <ul id="search-results" role="listbox" aria-label="검색 결과">
                {results.map((r, i) => {
                  const Icon = ICON[r.kind];
                  const item = r.kind === "item" ? getItem(r.id) : undefined;
                  return (
                    <li key={`${r.kind}-${r.id}`} id={`sr-${r.kind}-${r.id}`} role="option" aria-selected={i === active}>
                      <div className={`search-row ${i === active ? "is-active" : ""}`} onMouseEnter={() => setActive(i)}>
                        <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => choose(r, false)}>
                          <Icon size={17} className="shrink-0 text-[var(--ink-3)]" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-semibold text-[var(--ink-1)]">{r.title}</span>
                              {item && isNew(item.publishedAt) && <span className="badge-new">NEW</span>}
                            </span>
                            <span className="block truncate text-xs text-[var(--ink-3)]">
                              {KIND_LABEL[r.kind]} · {r.subtitle}
                            </span>
                          </span>
                        </button>
                        {r.kind === "item" && (
                          <button type="button" className="btn btn--sm shrink-0" onClick={() => choose(r, true)} title="해당 층·구역으로 이동">
                            위치로
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="hidden border-t border-[var(--line)] px-4 py-2 text-[11px] text-[var(--ink-3)] sm:block">
              ↑↓ 이동 · Enter 열기 · Shift+Enter 위치로 이동 · Esc 닫기
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
