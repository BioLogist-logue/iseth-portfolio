"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Building2, List, LogOut, RotateCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { floorLabel, getFloor, lobby } from "@/lib/building";
import { failureCopy } from "@/lib/scenePrep";
import { useTower } from "@/store/tower";

/**
 * Shown when a destination floor failed to prepare. The elevator doors (or
 * the entry fade) stay shut, so the visitor never sees a broken scene, and
 * can retry, go back to the lobby / outside, or use the 2D directory.
 * Elevator floor buttons stay usable the whole time.
 */
export function SceneRecovery() {
  const s = useTower(
    useShallow((st) => ({
      stalled: st.stalled,
      floorId: st.floorId,
      prep: st.prep,
      busy: st.busy,
      retry: st.retryScene,
      leave: st.leaveFailedScene,
      setDirectoryOpen: st.setDirectoryOpen,
    })),
  );
  const retryBtn = useRef<HTMLButtonElement>(null);
  const floor = getFloor(s.floorId);
  const show = s.stalled !== null && floor !== undefined;
  const retrying = show && s.prep.status === "loading";

  useEffect(() => {
    if (show) requestAnimationFrame(() => retryBtn.current?.focus());
  }, [show]);

  if (!floor) return null;
  const reason = s.prep.failure?.reason ?? "timeout";
  const toLobby = s.stalled === "elevator" && floor.id !== lobby.id;

  return (
    // Static wrapper does the positioning; the inner element animates (its
    // inline transform would otherwise override the CSS centring).
    <div className={`recovery-anchor ${s.stalled === "entrance" ? "recovery-anchor--center" : ""}`}>
      <AnimatePresence>
        {show && (
          <motion.div
            key="recovery"
            role="alertdialog"
            aria-modal="false"
            aria-labelledby="recovery-title"
            aria-describedby="recovery-desc"
            className="recovery-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start gap-3">
              <span className="recovery-icon" aria-hidden>
                <AlertTriangle size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="recovery-title" className="text-base font-bold leading-snug text-[var(--ink-1)]">
                  {floorLabel(floor)} {floor.name} 공간을 열지 못했어요
                </h2>
                <p id="recovery-desc" className="mt-1 text-sm leading-relaxed text-[var(--ink-2)]">
                  {retrying ? "다시 준비하고 있어요…" : failureCopy[reason]}{" "}
                  {s.stalled === "elevator" ? "문은 안전하게 닫혀 있어요." : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button ref={retryBtn} type="button" className="btn btn--primary" onClick={() => void s.retry()} disabled={s.busy}>
                <RotateCw size={15} className={retrying ? "animate-spin" : ""} />
                다시 시도
              </button>
              <button type="button" className="btn" onClick={() => void s.leave()} disabled={s.busy}>
                {toLobby ? <Building2 size={15} /> : <LogOut size={15} />}
                {toLobby ? "로비로 돌아가기" : "건물 밖으로"}
              </button>
              <button type="button" className="btn" onClick={() => s.setDirectoryOpen(true)}>
                <List size={15} />
                목록으로 보기
              </button>
            </div>
            {s.stalled === "elevator" && (
              <p className="mt-2 text-xs text-[var(--ink-3)]">다른 층 버튼을 눌러 바로 이동할 수도 있어요.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
