"use client";

import { List, Moon, Search, Sun, Volume2, VolumeX } from "lucide-react";
import { floorLabel, getFloor, getZone } from "@/lib/building";
import { useShallow } from "zustand/react/shallow";
import { useTower } from "@/store/tower";

export function TopBar() {
  const s = useTower(
    useShallow((st) => ({
      view: st.view,
      sub: st.sub,
      floorId: st.floorId,
      zoneId: st.zoneId,
      theme: st.theme,
      sound: st.sound,
      setTheme: st.setTheme,
      setSearchOpen: st.setSearchOpen,
      setDirectoryOpen: st.setDirectoryOpen,
      toggleSound: st.toggleSound,
    })),
  );
  const floor = getFloor(s.floorId);
  const zone = s.zoneId ? getZone(s.zoneId) : undefined;
  const where =
    s.view === "interior" && floor
      ? `${floorLabel(floor)} ${floor.name}${s.sub === "elevator" ? " · 엘리베이터" : zone ? ` · ${zone.name}` : ""}`
      : s.view === "approach"
        ? "입구"
        : "외관";

  const toggleTheme = () => {
    const next = s.theme === "light" ? "dark" : "light";
    s.setTheme(next, true);
    try {
      localStorage.setItem("iseth-theme", next);
    } catch {}
  };

  return (
    <header className="top-bar">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="brand-mark" aria-hidden>
          i
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] font-bold text-[var(--ink-1)]">iSETH Portfolio Tower</p>
          <p className="truncate text-[11px] text-[var(--ink-3)]" aria-live="polite">
            {where}
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-1" aria-label="빠른 메뉴">
        <button type="button" className="icon-btn icon-btn--bar" onClick={() => s.setSearchOpen(true)} aria-label="검색 (단축키 /)">
          <Search size={18} />
          <span className="hidden text-xs sm:inline">검색</span>
          <kbd className="hidden lg:inline">/</kbd>
        </button>
        <button type="button" className="icon-btn icon-btn--bar" onClick={() => s.setDirectoryOpen(true)} aria-label="전체 목록 보기 (2D)">
          <List size={18} />
          <span className="hidden text-xs sm:inline">목록</span>
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--bar"
          onClick={toggleTheme}
          aria-label={s.theme === "light" ? "밤 모드로 전환" : "낮 모드로 전환"}
          aria-pressed={s.theme === "dark"}
        >
          {s.theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button type="button" className="icon-btn icon-btn--bar" onClick={s.toggleSound} aria-label={s.sound ? "소리 끄기" : "소리 켜기"} aria-pressed={s.sound}>
          {s.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </nav>
    </header>
  );
}
