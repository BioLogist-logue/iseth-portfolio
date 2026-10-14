"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, DoorOpen, MousePointerClick } from "lucide-react";
import { content } from "@/content";
import { directoryOrder, floorHasNew, floorLabel } from "@/lib/building";
import { useTower } from "@/store/tower";

/** Title card and controls for the exterior / approach views. */
export function ExteriorOverlay() {
  const view = useTower((s) => s.view);
  const busy = useTower((s) => s.busy);
  const mobile = useTower((s) => s.mobile);
  const focus = useTower((s) => s.focusBuilding);
  const back = useTower((s) => s.backToExterior);
  const enter = useTower((s) => s.enterBuilding);

  return (
    <>
      <AnimatePresence>
        {view === "approach" && <FloorJump key="jump" />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {view === "exterior" && (
          <motion.section
            key="ext"
            className="hero-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Portfolio Tower
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-[var(--ink-1)] sm:text-[28px]">
              {content.profile.name}의 포트폴리오 타워
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">
              교사로서의 작업은 위로 쌓이고, 경험과 생각은 아래로 깊어집니다.
              옥상은 자유롭게 만든 것들의 정원입니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn--primary"
                onClick={focus}
                disabled={busy}
              >
                <MousePointerClick size={16} />
                건물 가까이 가기
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => void enter()}
                disabled={busy}
              >
                <DoorOpen size={16} />
                바로 입장
              </button>
            </div>
            {!mobile && (
              <p className="mt-3 text-xs text-[var(--ink-3)]">
                건물을 클릭해도 가까이 갈 수 있어요. 드래그하면 조금 둘러볼 수
                있습니다.
              </p>
            )}
          </motion.section>
        )}
        {view === "approach" && (
          <motion.div
            key="app"
            className="approach-bar"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              className="btn"
              onClick={back}
              disabled={busy}
            >
              <ArrowLeft size={16} />
              외관 보기
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => void enter()}
              disabled={busy}
            >
              <DoorOpen size={16} />
              로비로 들어가기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Every floor, one click away, while standing in front of the building.
 * A screen-space list (not tags pinned to the facade), so the rooftop and the
 * deep basements stay reachable however the camera frames the entrance.
 */
function FloorJump() {
  const busy = useTower((s) => s.busy);
  const navigate = useTower((s) => s.navigate);
  return (
    <motion.nav
      className="floor-jump"
      aria-label="층 바로가기"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.35, delay: 0.3 }}
    >
      <p className="floor-jump__title">층 바로가기</p>
      <ol>
        {directoryOrder.map((f) => (
          <li
            key={f.id}
            className={
              f.type === "basement" && f.floorNumber === -1
                ? "floor-jump__below"
                : undefined
            }
          >
            <button
              type="button"
              className="floor-tag floor-tag--list"
              disabled={busy}
              onClick={() => void navigate({ floorId: f.id })}
              aria-label={`${floorLabel(f)} ${f.name}(으)로 이동`}
            >
              <b>{floorLabel(f)}</b>
              <span>{f.name}</span>
              {floorHasNew(f.id) && (
                <i className="floor-tag__new" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}
