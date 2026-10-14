"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getFloor, getItem, getZone, locateItem } from "@/lib/building";
import { setSoundEnabled, unlockAudio } from "@/lib/audio";
import { useTower, type Theme } from "@/store/tower";
import { DirectoryView } from "./ui/DirectoryView";
import { ElevatorUI } from "./ui/ElevatorUI";
import { ExteriorOverlay } from "./ui/ExteriorOverlay";
import { FloorPanel } from "./ui/FloorPanel";
import { SceneRecovery } from "./ui/SceneRecovery";
import { SearchDialog } from "./ui/SearchDialog";
import { SidePanel } from "./ui/SidePanel";
import { TopBar } from "./ui/TopBar";

const TowerCanvas = dynamic(() => import("./scene/TowerCanvas"), { ssr: false, loading: () => <Loading /> });

function Loading() {
  return (
    <div className="loading-screen" role="status">
      <div className="loading-dot" />
      <p>타워를 준비하고 있어요…</p>
    </div>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function usePreferences() {
  const setTheme = useTower((s) => s.setTheme);
  const setReducedMotion = useTower((s) => s.setReducedMotion);
  const theme = useTower((s) => s.theme);

  useEffect(() => {
    // Theme: manual choice wins, otherwise follow the OS.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("iseth-theme");
    } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (stored === "light" || stored === "dark") setTheme(stored as Theme, true);
    else setTheme(mq.matches ? "dark" : "light");
    const onScheme = (e: MediaQueryListEvent) => {
      if (!useTower.getState().themeManual) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onScheme);

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(rm.matches);
    const onRm = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    rm.addEventListener("change", onRm);

    try {
      const snd = localStorage.getItem("iseth-sound");
      if (snd === "off") {
        useTower.setState({ sound: false });
        setSoundEnabled(false);
      }
    } catch {}

    // Audio may only start after a user gesture.
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => {
      mq.removeEventListener("change", onScheme);
      rm.removeEventListener("change", onRm);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [setTheme, setReducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
}

function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useTower.getState();
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if (e.key === "Escape") {
        if (s.searchOpen) s.setSearchOpen(false);
        else if (s.panel) s.closePanel();
        else if (s.directoryOpen) s.setDirectoryOpen(false);
        else if (s.view === "interior" && s.sub === "zone") s.goHall();
        else if (s.view === "approach") s.backToExterior();
        return;
      }
      if (typing) return;
      if (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        s.setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/** Shareable deep links: ?floor=4f&zone=4f-biology&item=app-dna-builder */
function useUrlState(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams(window.location.search);
    const itemId = p.get("item");
    const item = itemId ? getItem(itemId) : undefined;
    const loc = item ? locateItem(item) : undefined;
    const floorId = loc?.floor?.id ?? p.get("floor") ?? undefined;
    const zoneId = loc?.zone?.id ?? p.get("zone") ?? undefined;
    if (floorId && getFloor(floorId)) {
      const t = setTimeout(() => {
        void useTower.getState().navigate({
          floorId,
          zoneId: zoneId && getZone(zoneId)?.floorId === floorId ? zoneId : undefined,
          itemId: item?.id,
        });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    return useTower.subscribe((s, prev) => {
      if (s.view === prev.view && s.floorId === prev.floorId && s.zoneId === prev.zoneId && s.panel === prev.panel) return;
      const p = new URLSearchParams();
      if (s.view === "interior") {
        p.set("floor", s.floorId);
        if (s.zoneId) p.set("zone", s.zoneId);
      }
      if (s.panel?.kind === "item") p.set("item", s.panel.id);
      const qs = p.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    });
  }, [ready]);
}

export default function TowerApp() {
  const [gl, setGl] = useState<boolean | null>(null);
  const fade = useTower((s) => s.fade);
  const booting = useTower((s) => s.view !== "interior" && !s.readyFloors.exterior);
  const reduced = useTower((s) => s.reducedMotion);
  usePreferences();
  useShortcuts();
  useEffect(() => setGl(hasWebGL()), []);
  useUrlState(gl === true);

  if (gl === null) return <Loading />;
  if (!gl)
    return (
      <>
        <DirectoryView standalone />
        <SidePanel />
      </>
    );

  return (
    <div className="app-root">
      <TowerCanvas />
      <TopBar />
      <ExteriorOverlay />
      <FloorPanel />
      <ElevatorUI />
      <SidePanel />
      <SceneRecovery />
      <SearchDialog />
      <DirectoryView />
      <AnimatePresence>{booting && <motion.div key="boot" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><Loading /></motion.div>}</AnimatePresence>
      <AnimatePresence>
        {fade && (
          <motion.div
            className="fade-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.4 }}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </div>
  );
}
