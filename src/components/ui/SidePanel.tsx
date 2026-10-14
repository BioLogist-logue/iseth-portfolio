"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Code2, Download, ExternalLink, FileText, Info, MapPin, Play, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { content } from "@/content";
import {
  featuredItems,
  floorLabel,
  getFloor,
  getItem,
  latestItems,
  locateItem,
} from "@/lib/building";
import { formatDate, typeLabel } from "@/lib/labels";
import type { DetailSection, ItemLink, PortfolioItem } from "@/lib/types";
import { useTower, type Panel } from "@/store/tower";
import { NewBadge, StatusBadge, Thumb } from "./bits";

/**
 * Right-side drawer (bottom sheet on mobile) for reading content.
 * The 3D scene underneath is untouched, so closing returns to the same view.
 */
export function SidePanel() {
  const panel = useTower((s) => s.panel);
  const close = useTower((s) => s.closePanel);
  const reduced = useTower((s) => s.reducedMotion);
  const mobile = useTower((s) => s.mobile);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const key = panel ? (panel.kind === "item" ? panel.id : panel.kind) : null;

  useEffect(() => {
    if (key) {
      lastFocus.current ??= document.activeElement;
      requestAnimationFrame(() => closeBtn.current?.focus());
    } else if (lastFocus.current instanceof HTMLElement) {
      lastFocus.current.focus();
      lastFocus.current = null;
    }
  }, [key]);

  const motionProps = mobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: "105%" }, animate: { x: 0 }, exit: { x: "105%" } };

  return (
    <AnimatePresence>
      {panel && (
        <motion.aside
          key="panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="panel-title"
          className="side-panel"
          {...motionProps}
          transition={{ duration: reduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <button ref={closeBtn} type="button" onClick={close} className="icon-btn absolute right-3 top-3 z-10" aria-label="닫기">
            <X size={18} />
          </button>
          <div className="side-panel__scroll">
            <PanelBody panel={panel} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PanelBody({ panel }: { panel: NonNullable<Panel> }) {
  switch (panel.kind) {
    case "item": {
      const item = getItem(panel.id);
      return item ? <ItemDetail item={item} /> : <p className="p-6">항목을 찾을 수 없습니다.</p>;
    }
    case "about":
      return <AboutPanel />;
    case "featured":
      return <ItemListPanel title="추천 작품" subtitle="Featured Work" items={featuredItems} />;
    case "updates":
      return <UpdatesPanel />;
  }
}

function LinkIcon({ kind }: { kind?: ItemLink["kind"] }) {
  if (kind === "github") return <Code2 size={15} />;
  if (kind === "video") return <Play size={15} />;
  return <ExternalLink size={15} />;
}

function ItemDetail({ item }: { item: PortfolioItem }) {
  const { zone, floor } = locateItem(item);
  const navigate = useTower((s) => s.navigate);
  const here = useTower((s) => s.view === "interior" && s.floorId === floor?.id && s.zoneId === zone?.id);
  const paragraphs = (item.details ?? "").split(/\n\s*\n/).filter(Boolean);
  const meta: [string, string | undefined][] = [
    ["유형", typeLabel[item.type]],
    ["기간", item.date ?? formatDate(item.publishedAt)],
    ["역할", item.role],
    ...(item.facts ?? []).map((f) => [f.label, f.value] as [string, string]),
  ];
  // Notices (개인정보 보호, 핵심 질문 …) sit above the body; other sections follow it.
  const notices = item.sections?.filter((s) => s.kind === "notice") ?? [];
  const sections = item.sections?.filter((s) => s.kind !== "notice") ?? [];

  return (
    <article>
      <div className="aspect-[16/9] w-full overflow-hidden bg-[var(--surface-2)]">
        <Thumb src={item.thumbnail} alt={item.thumbnailAlt ?? item.title} seed={item.id} className="h-full w-full" />
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        <header className="space-y-2 pr-8">
          <div className="flex flex-wrap items-center gap-1.5">
            <NewBadge date={item.publishedAt} />
            <StatusBadge status={item.status} />
            {item.sample && (
              <span className="chip chip--plain" title="실제 콘텐츠로 교체될 예시입니다">
                예시
              </span>
            )}
            {floor && zone && (
              <span className="text-xs text-[var(--ink-3)]">
                {floorLabel(floor)} · {zone.name}
              </span>
            )}
          </div>
          <h2 id="panel-title" className="text-xl font-bold leading-snug text-[var(--ink-1)] sm:text-2xl">
            {item.title}
          </h2>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--ink-2)]">{item.description}</p>
        </header>

        {notices.map((n) => (
          <aside key={n.label} className="detail-notice">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
            <div className="min-w-0">
              <b>{n.label}</b>
              <Paragraphs text={n.text} />
            </div>
          </aside>
        ))}

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-xl bg-[var(--surface-2)] p-4 text-sm">
          {meta
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-[var(--ink-3)]">{k}</dt>
                <dd className="text-[var(--ink-1)]">{v}</dd>
              </div>
            ))}
          {item.tools?.length ? (
            <div className="contents">
              <dt className="text-[var(--ink-3)]">도구</dt>
              <dd className="flex flex-wrap gap-1">
                {item.tools.map((t) => (
                  <span key={t} className="chip chip--plain">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>

        {(item.links?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.links!.map((l) => (
              <a key={l.url + l.label} href={l.url} target="_blank" rel="noopener noreferrer" className={l.kind === "live" ? "btn btn--primary" : "btn"}>
                <LinkIcon kind={l.kind} />
                {l.label}
              </a>
            ))}
          </div>
        )}

        {paragraphs.length > 0 && (
          <section className="space-y-3 text-[15px] leading-[1.75] text-[var(--ink-1)]">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </section>
        )}

        {sections.map((sec) => (
          <DetailBlock key={sec.label} section={sec} />
        ))}

        {(item.gallery?.length ?? 0) > 0 && (
          <section>
            <h3 className="section-title">{item.type === "app" ? "스크린샷" : "이미지"}</h3>
            <div className="grid grid-cols-2 gap-2">
              {item.gallery!.map((g, i) => (
                <figure key={i} className="overflow-hidden rounded-lg bg-[var(--surface-2)]">
                  <Thumb src={g.src} alt={g.alt} seed={g.seed ?? `${item.id}-${i}`} className="aspect-[16/10] h-auto w-full" />
                  <figcaption className="px-2 py-1.5 text-xs text-[var(--ink-3)]">{g.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {(item.attachments?.length ?? 0) > 0 && (
          <section className="space-y-3">
            <h3 className="section-title">자료</h3>
            {item.attachments!.map((a) => (
              <div key={a.id} className="space-y-2">
                {a.preview && a.kind === "pdf" && (
                  <iframe
                    src={a.url}
                    title={`${a.label} 미리보기`}
                    loading="lazy"
                    className="h-64 w-full rounded-lg border border-[var(--line)] bg-white"
                  />
                )}
                <a href={a.url} download className="file-row">
                  <FileText size={18} className="shrink-0 text-[var(--accent)]" />
                  <span className="min-w-0 flex-1 truncate">{a.label}</span>
                  {a.sizeLabel && <span className="text-xs text-[var(--ink-3)]">{a.sizeLabel}</span>}
                  <Download size={16} className="shrink-0" />
                </a>
              </div>
            ))}
          </section>
        )}

        {item.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="태그">
            {item.tags.map((t) => (
              <li key={t} className="chip">
                #{t}
              </li>
            ))}
          </ul>
        )}

        {floor && zone && !here && (
          <button type="button" className="btn w-full justify-center" onClick={() => void navigate({ floorId: floor.id, zoneId: zone.id, itemId: item.id })}>
            <MapPin size={16} />
            {floorLabel(floor)} {zone.name}(으)로 이동
          </button>
        )}
      </div>
    </article>
  );
}

/** Multi-line text: blank lines split paragraphs, single line breaks are kept. */
function Paragraphs({ text }: { text?: string }) {
  const parts = (text ?? "").split(/\n\s*\n/).filter((p) => p.trim());
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </>
  );
}

/** One labelled template section (학습 목표, 수업 흐름, 성찰 …). Empty sections never reach here. */
function DetailBlock({ section }: { section: DetailSection }) {
  return (
    <section>
      <h3 className="section-title">{section.label}</h3>
      {section.kind === "list" && (
        <ul className="detail-list">
          {section.items!.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )}
      {section.kind === "steps" && (
        <ol className="detail-steps">
          {section.items!.map((x, i) => (
            <li key={i}>
              <span aria-hidden>{i + 1}</span>
              <p>{x}</p>
            </li>
          ))}
        </ol>
      )}
      {section.kind === "text" && (
        <div className="space-y-2 text-[15px] leading-[1.75] text-[var(--ink-1)]">
          <Paragraphs text={section.text} />
        </div>
      )}
    </section>
  );
}

function AboutPanel() {
  const p = content.profile;
  return (
    <article className="space-y-5 p-5 sm:p-6">
      <header className="space-y-1 pr-8">
        <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">안내 데스크 · About</p>
        <h2 id="panel-title" className="text-2xl font-bold text-[var(--ink-1)]">
          {p.name}
        </h2>
        <p className="text-sm text-[var(--ink-3)]">{p.title}</p>
      </header>
      <p className="text-[17px] font-semibold leading-relaxed text-[var(--ink-1)]">{p.headline}</p>
      <div className="space-y-3 text-[15px] leading-[1.75] text-[var(--ink-2)]">
        {p.intro.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      <dl className="space-y-2 rounded-xl bg-[var(--surface-2)] p-4 text-sm">
        {p.identity.map((x) => (
          <div key={x.label} className="flex gap-3">
            <dt className="w-20 shrink-0 text-[var(--ink-3)]">{x.label}</dt>
            <dd className="text-[var(--ink-1)]">{x.value}</dd>
          </div>
        ))}
      </dl>
      <BuildingOverview />
      {p.contact?.map((c) => (
        <a key={c.url} href={c.url} className="btn">
          <ExternalLink size={15} />
          {c.label}
        </a>
      ))}
    </article>
  );
}

/** Explains the building metaphor: up = visible work, down = depth, roof = play. */
function BuildingOverview() {
  return (
    <section>
      <h3 className="section-title">건물 안내</h3>
      <ul className="space-y-2 text-sm leading-relaxed text-[var(--ink-2)]">
        <li>
          <b className="text-[var(--ink-1)]">지상층</b> — 눈에 보이는 작업과 성과가 위로 쌓입니다.
        </li>
        <li>
          <b className="text-[var(--ink-1)]">지하층</b> — 그 아래에 쌓인 경험, 성찰, 철학, 담임 실천입니다.
        </li>
        <li>
          <b className="text-[var(--ink-1)]">옥상 정원</b> — 자유롭게 만든 앱과 사이드 프로젝트의 전시 공간입니다.
        </li>
      </ul>
    </section>
  );
}

export function ItemCard({ item, onSelect }: { item: PortfolioItem; onSelect: () => void }) {
  const { zone, floor } = locateItem(item);
  return (
    <button type="button" onClick={onSelect} className="item-card">
      <Thumb src={item.thumbnail} alt="" seed={item.id} className="h-16 w-24 shrink-0 rounded-md" />
      <span className="min-w-0 flex-1 text-left">
        <span className="flex flex-wrap items-center gap-1">
          <NewBadge date={item.publishedAt} />
          {floor && (
            <span className="text-[11px] text-[var(--ink-3)]">
              {floorLabel(floor)} · {zone?.name}
            </span>
          )}
        </span>
        <span className="line-clamp-2 block text-sm font-semibold leading-snug text-[var(--ink-1)]">{item.title}</span>
      </span>
    </button>
  );
}

function ItemListPanel({ title, subtitle, items }: { title: string; subtitle: string; items: PortfolioItem[] }) {
  const openItem = useTower((s) => s.openItem);
  return (
    <section className="space-y-4 p-5 sm:p-6">
      <header className="pr-8">
        <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">{subtitle}</p>
        <h2 id="panel-title" className="text-2xl font-bold text-[var(--ink-1)]">
          {title}
        </h2>
      </header>
      <div className="space-y-2">
        {items.map((i) => (
          <ItemCard key={i.id} item={i} onSelect={() => openItem(i.id)} />
        ))}
      </div>
    </section>
  );
}

function UpdatesPanel() {
  const navigate = useTower((s) => s.navigate);
  const openItem = useTower((s) => s.openItem);
  return (
    <section className="space-y-6 p-5 sm:p-6">
      <header className="pr-8">
        <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">라운지 · Lounge</p>
        <h2 id="panel-title" className="text-2xl font-bold text-[var(--ink-1)]">
          최근 소식
        </h2>
      </header>
      <ol className="space-y-2">
        {content.updates.map((u, i) => (
          <li key={i}>
            <button
              type="button"
              className="update-row"
              onClick={() => (u.itemId ? openItem(u.itemId) : u.floorId && void navigate({ floorId: u.floorId }))}
            >
              <time className="shrink-0 text-xs tabular-nums text-[var(--ink-3)]">{formatDate(u.date)}</time>
              <span className="text-sm text-[var(--ink-1)]">{u.text}</span>
            </button>
          </li>
        ))}
      </ol>
      <section>
        <h3 className="section-title">추천 관람 경로</h3>
        <RouteList />
      </section>
      <section>
        <h3 className="section-title">새로 올라온 작품</h3>
        <div className="space-y-2">
          {latestItems.slice(0, 4).map((i) => (
            <ItemCard key={i.id} item={i} onSelect={() => openItem(i.id)} />
          ))}
        </div>
      </section>
    </section>
  );
}

export function RouteList({ compact = false }: { compact?: boolean }) {
  const navigate = useTower((s) => s.navigate);
  const busy = useTower((s) => s.busy);
  return (
    <ul className={compact ? "space-y-1.5" : "space-y-2.5"}>
      {content.recommendations.map((r) => (
        <li key={r.id} className={compact ? "" : "rounded-xl bg-[var(--surface-2)] p-3"}>
          <div className="mb-1 flex items-baseline gap-2">
            <b className="text-sm text-[var(--ink-1)]">{r.title}</b>
            {!compact && r.description && <span className="text-xs text-[var(--ink-3)]">{r.description}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {r.route.map((id, i) => {
              const f = getFloor(id);
              if (!f) return null;
              return (
                <span key={id} className="flex items-center gap-1">
                  {i > 0 && <span className="text-xs text-[var(--ink-3)]">→</span>}
                  <button
                    type="button"
                    disabled={busy}
                    className="route-chip"
                    onClick={() => void navigate({ floorId: id })}
                    title={f.name}
                  >
                    {floorLabel(f)}
                  </button>
                </span>
              );
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
