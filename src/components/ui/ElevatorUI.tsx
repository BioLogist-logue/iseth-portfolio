"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, DoorOpen } from "lucide-react";
import { useState } from "react";
import { buttonLabel, directoryOrder, floorHasNew, floorLabel, getFloor } from "@/lib/building";
import { useTower } from "@/store/tower";
import { RouteList } from "./SidePanel";

/** 2D elevator controls shown while standing in the cab. */
export function ElevatorUI() {
  const inCab = useTower((s) => s.view === "interior" && s.sub === "elevator");
  return (
    <AnimatePresence>
      {inCab && (
        <motion.div key="elev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <Indicator />
          <ControlPanel />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Indicator() {
  const display = useTower((s) => s.elevator.displayFloorId);
  const dir = useTower((s) => s.elevator.direction);
  const phase = useTower((s) => s.elevator.phase);
  const stalled = phase === "stalled";
  const f = getFloor(display);
  return (
    <div className="elevator-indicator" role="status" aria-live="polite">
      <span className="tabular-nums">{f ? floorLabel(f) : ""}</span>
      <span className={`w-4 ${stalled ? "text-[#ffb35c]" : "text-[#7be08a]"}`} aria-hidden>
        {stalled ? "!" : dir === 1 ? "▲" : dir === -1 ? "▼" : ""}
      </span>
      <span className="sr-only">
        {phase === "moving" ? "이동 중" : ""} {f?.name}
      </span>
    </div>
  );
}

function ControlPanel() {
  const floorId = useTower((s) => s.floorId);
  const pressed = useTower((s) => s.elevator.pressed);
  const busy = useTower((s) => s.busy);
  const rideTo = useTower((s) => s.rideTo);
  const exit = useTower((s) => s.exitElevator);
  const stalled = useTower((s) => s.stalled === "elevator");
  const mobile = useTower((s) => s.mobile);
  const [showRoutes, setShowRoutes] = useState(!mobile);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="elevator-panel" aria-label="엘리베이터 층 선택">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]">Floor Guide</p>
          <h2 className="text-base font-bold text-[var(--ink-1)]">층 안내</h2>
        </div>
        {mobile && (
          <button type="button" className="icon-btn" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed} aria-label="층 목록 접기/펼치기">
            {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </header>

      {!collapsed && (
        <>
          <ol className="elevator-list">
            {directoryOrder.map((f) => {
              const current = f.id === floorId && !pressed;
              const lit = pressed === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void rideTo(f.id)}
                    className={`elevator-row ${current ? "is-current" : ""} ${lit ? "is-lit" : ""}`}
                    aria-current={current ? "location" : undefined}
                    aria-label={`${floorLabel(f)} ${f.name}${current ? " (현재 층)" : ""}`}
                  >
                    <span className="elevator-btn" aria-hidden>
                      {buttonLabel(f)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-left">
                      <span className="block truncate text-sm font-semibold">{f.name}</span>
                      {!mobile && f.nameEn && <span className="block truncate text-[11px] text-[var(--ink-3)]">{f.nameEn}</span>}
                    </span>
                    {floorHasNew(f.id) && <span className="badge-new">NEW</span>}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="border-t border-[var(--line)] pt-2">
            <button type="button" className="flex w-full items-center justify-between py-1 text-sm font-semibold text-[var(--ink-1)]" onClick={() => setShowRoutes((v) => !v)} aria-expanded={showRoutes}>
              추천 층
              {showRoutes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showRoutes && (
              <div className="pt-1">
                <RouteList compact />
              </div>
            )}
          </div>
        </>
      )}

      <button type="button" className="btn btn--primary w-full justify-center" disabled={busy || stalled} onClick={() => void exit()}>
        <DoorOpen size={16} />
        이 층에서 내리기
      </button>
    </section>
  );
}
