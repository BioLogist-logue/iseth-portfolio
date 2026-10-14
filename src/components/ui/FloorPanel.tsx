"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, DoorOpen, LayoutGrid, LogOut, MoveVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { content } from "@/content";
import { floorLabel, getFloor, getZone, isNew, itemsOfZone, zonesOf } from "@/lib/building";
import { typeLabel } from "@/lib/labels";
import { useShallow } from "zustand/react/shallow";
import { useTower, type TowerStore } from "@/store/tower";

const pickControls = (st: TowerStore) => ({
  busy: st.busy,
  sub: st.sub,
  goZone: st.goZone,
  goHall: st.goHall,
  goOverview: st.goOverview,
  enterElevator: st.enterElevator,
  exitBuilding: st.exitBuilding,
  openItem: st.openItem,
  setHovered: st.setHovered,
});
import { NewBadge, StatusBadge } from "./bits";

/**
 * Floor navigation card: floor title, description, zone directory, and
 * hall / overview / elevator controls. In a zone it lists that zone's items,
 * which also makes every 3D object reachable by keyboard.
 */
export function FloorPanel() {
  const visible = useTower((s) => s.view === "interior" && s.sub !== "elevator" && !s.stalled);
  const floorId = useTower((s) => s.floorId);
  const sub = useTower((s) => s.sub);
  const zoneId = useTower((s) => s.zoneId);
  const mobile = useTower((s) => s.mobile);
  const panelOpen = useTower((s) => s.panel !== null);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => setCollapsed(false), [floorId, zoneId]);

  const floor = getFloor(floorId);
  const zone = zoneId ? getZone(zoneId) : undefined;
  if (!floor) return null;
  // On mobile the detail sheet takes the screen; get out of its way.
  const hide = mobile && panelOpen;

  return (
    <AnimatePresence>
      {visible && !hide && (
        <motion.section
          key={`${floor.id}-${sub === "zone" ? zoneId : "hall"}`}
          className={`floor-panel ${collapsed ? "is-collapsed" : ""}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          aria-label={`${floorLabel(floor)} ${floor.name} 안내`}
        >
          {sub === "zone" && zone && !zone.panel ? (
            <ZoneView zoneId={zone.id} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          ) : (
            <HallView floorId={floor.id} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function CollapseBtn({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const mobile = useTower((s) => s.mobile);
  if (!mobile) return null;
  return (
    <button type="button" className="icon-btn" onClick={onToggle} aria-expanded={!collapsed} aria-label={collapsed ? "펼치기" : "접기"}>
      {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );
}

function HallView({ floorId, collapsed, onToggle }: { floorId: string; collapsed: boolean; onToggle: () => void }) {
  const floor = getFloor(floorId)!;
  const zones = zonesOf(floorId);
  const s = useTower(useShallow(pickControls));
  const isLobby = floor.type === "lobby";

  return (
    <>
      <header className="flex items-start gap-3">
        <span className="floor-chip" style={{ background: floor.accent }}>
          {floorLabel(floor)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-tight text-[var(--ink-1)]">{floor.name}</h1>
          {floor.nameEn && <p className="text-xs text-[var(--ink-3)]">{floor.nameEn}</p>}
        </div>
        <CollapseBtn collapsed={collapsed} onToggle={onToggle} />
      </header>

      {!collapsed && (
        <>
          <p className="text-sm leading-relaxed text-[var(--ink-2)]">{isLobby ? content.profile.headline : floor.description}</p>

          {zones.length > 0 && (
            <nav aria-label="구역 안내">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-3)]">
                {isLobby ? "Lobby" : "Zones"} · {zones.length}
              </p>
              <ul className="grid gap-1.5">
                {zones.map((z) => {
                  const items = itemsOfZone(z.id);
                  const fresh = items.some((i) => isNew(i.publishedAt));
                  return (
                    <li key={z.id}>
                      <button type="button" className="zone-row" onClick={() => s.goZone(z.id)} disabled={s.busy}>
                        <i style={{ background: z.accent ?? floor.accent }} aria-hidden />
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block truncate text-sm font-semibold text-[var(--ink-1)]">{z.name}</span>
                          {z.nameEn && <span className="block truncate text-[11px] text-[var(--ink-3)]">{z.nameEn}</span>}
                        </span>
                        {fresh && <span className="badge-new">NEW</span>}
                        {items.length > 0 && <span className="text-xs tabular-nums text-[var(--ink-3)]">{items.length}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div className="flex flex-wrap gap-1.5">
            <button type="button" className="btn btn--sm" onClick={s.goOverview} disabled={s.busy || s.sub === "overview"}>
              <LayoutGrid size={15} />
              전체 보기
            </button>
            {s.sub !== "hall" && (
              <button type="button" className="btn btn--sm" onClick={s.goHall} disabled={s.busy}>
                <ArrowLeft size={15} />
                중앙 홀
              </button>
            )}
            <button type="button" className="btn btn--sm btn--primary" onClick={() => void s.enterElevator()} disabled={s.busy}>
              <MoveVertical size={15} />
              엘리베이터
            </button>
            {isLobby && (
              <button type="button" className="btn btn--sm" onClick={() => void s.exitBuilding()} disabled={s.busy}>
                <LogOut size={15} />
                건물 밖으로
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

function ZoneView({ zoneId, collapsed, onToggle }: { zoneId: string; collapsed: boolean; onToggle: () => void }) {
  const zone = getZone(zoneId)!;
  const floor = getFloor(zone.floorId)!;
  const items = itemsOfZone(zoneId);
  const s = useTower(useShallow(pickControls));
  const accent = zone.accent ?? floor.accent;

  return (
    <>
      <header className="flex items-start gap-2">
        <button type="button" className="icon-btn -ml-1" onClick={s.goHall} disabled={s.busy} aria-label="중앙 홀로 돌아가기">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-[var(--ink-3)]">
            {floorLabel(floor)} {floor.name}
          </p>
          <h1 className="flex items-center gap-2 text-lg font-bold leading-tight text-[var(--ink-1)]">
            <i className="inline-block h-4 w-1 rounded-full" style={{ background: accent }} aria-hidden />
            {zone.name}
          </h1>
          {zone.nameEn && <p className="text-xs text-[var(--ink-3)]">{zone.nameEn}</p>}
        </div>
        <CollapseBtn collapsed={collapsed} onToggle={onToggle} />
      </header>
      {!collapsed && (
        <>
          <p className="text-sm leading-relaxed text-[var(--ink-2)]">{zone.description}</p>
          {items.length === 0 ? (
            <p className="rounded-lg bg-[var(--surface-2)] p-3 text-sm text-[var(--ink-3)]">아직 전시된 작품이 없습니다.</p>
          ) : (
            <ul className="grid max-h-[38vh] gap-1 overflow-y-auto pr-1" aria-label={`${zone.name} 작품 목록`}>
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    className="item-row"
                    onClick={() => s.openItem(it.id)}
                    onMouseEnter={() => s.setHovered(it.id)}
                    onMouseLeave={() => s.setHovered(null)}
                    onFocus={() => s.setHovered(it.id)}
                    onBlur={() => s.setHovered(null)}
                  >
                    <span className="min-w-0 flex-1 text-left">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--ink-1)]">{it.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-[var(--ink-3)]">
                        {typeLabel[it.type]}
                        <NewBadge date={it.publishedAt} />
                        {it.status && it.status !== "RELEASED" && <StatusBadge status={it.status} />}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className="btn btn--sm" onClick={s.goOverview} disabled={s.busy}>
              <LayoutGrid size={15} />
              전체 보기
            </button>
            <button type="button" className="btn btn--sm btn--primary" onClick={() => void s.enterElevator()} disabled={s.busy}>
              <DoorOpen size={15} />
              엘리베이터
            </button>
          </div>
        </>
      )}
    </>
  );
}
