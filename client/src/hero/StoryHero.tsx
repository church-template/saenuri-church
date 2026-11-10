"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";
import { REDUCED_MQ, useMediaFlag } from "@/lib/hooks/useMediaFlag";
import { chapterAt } from "./storyChapter";
import type { StoryCard, StoryChapter, StoryHeroContent } from "./types";
import styles from "./StoryHero.module.css";

// 메인 스토리 히어로(DESIGN.md story-hero). 인트로(예배 사진 → 카드 축소) → 스플릿 첫 화면 →
// 과거→현재 장 → 마지막 "지금" 장(앞 카드가 풀스크린). 장 번호는 window 스크롤에서 chapterAt으로 계산한다.
const INTRO_HOLD_MS = 1800; // 문구가 떠 있는 시간
const INTRO_HEADER_MS = 3700; // 축소(1.6s)가 끝날 무렵 헤더 복귀
const INTRO_END_MS = 4300; // 인트로 전용 전환 해제

const TONE: Record<StoryChapter["bg"]["tone"], string> = {
  none: "",
  fade1: styles.fade1,
  fade2: styles.fade2,
  mono: styles.mono,
};

export interface StoryHeroProps {
  content: StoryHeroContent;
  /** 히어로를 지나 본문이 보이면 true — 헤더 솔리드 전환 */
  onSolid?: (solid: boolean) => void;
  /** 인트로 동안 true — 헤더를 위로 숨긴다 */
  onConcealHeader?: (hidden: boolean) => void;
}

function Title({ lines, highlight }: { lines: string[]; highlight?: string }) {
  return lines.map((line) => {
    const at = highlight ? line.indexOf(highlight) : -1;
    return (
      <span key={line} className="block">
        {at < 0 ? (
          line
        ) : (
          <>
            {line.slice(0, at)}
            <em className={styles.em}>{highlight}</em>
            {line.slice(at + (highlight ?? "").length)}
          </>
        )}
      </span>
    );
  });
}

function Card({ card, className, priority }: { card: StoryCard; className?: string; priority?: boolean }) {
  return (
    <figure className={cn(styles.pc, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 연출 미디어(CrossHero 선례) */}
      <img src={card.src} alt={card.caption} fetchPriority={priority ? "high" : undefined} />
      <figcaption>{card.caption}</figcaption>
    </figure>
  );
}

function ChapterCopy({ ch }: { ch: StoryChapter }) {
  return (
    <>
      <p className={styles.yr}>
        {ch.year}
        {ch.yearSuffix ? <small>{ch.yearSuffix}</small> : null}
      </p>
      <h2 className={cn(typo.displayLg, styles.ttl)}>
        <Title lines={ch.title} />
      </h2>
      <p className={cn(typo.bodyMd, styles.desc)}>{ch.desc}</p>
      {ch.verse ? (
        <blockquote className={cn(typo.bodySm, styles.verse)}>
          {ch.verse.lines.map((l) => (
            <span key={l}>{l} </span>
          ))}
          <cite>{ch.verse.cite}</cite>
        </blockquote>
      ) : null}
    </>
  );
}

function SplitCopy({ split }: { split: StoryHeroContent["split"] }) {
  return (
    <>
      <p className={cn(typo.captionStrong, styles.eyebrow)}>{split.eyebrow}</p>
      <h1 className={cn(typo.displayMega, styles.mega)}>
        <Title lines={split.title} highlight={split.highlight} />
      </h1>
      <p className={cn(typo.bodyMd, styles.lead)}>
        {split.lead.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
      <dl className={cn(typo.bodySm, styles.info)}>
        {split.info.map((row) => (
          <div key={row.label} className="contents">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

// 움직임 줄이기 — 인트로·고정·전환 없이 모든 장을 세로로 나열한다.
function StaticStory({ content }: { content: StoryHeroContent }) {
  const { split, chapters } = content;
  return (
    <section className={styles.static}>
      <div className={styles.staticBlock}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 연출 미디어 */}
        <img className={styles.staticBg} src={split.bg} alt="" />
        <div className={styles.staticCopy}>
          <SplitCopy split={split} />
        </div>
        <div className={styles.staticCards}>
          {split.cards.map((c) => (
            <Card key={c.src} card={c} />
          ))}
        </div>
      </div>
      {chapters.map((ch) => (
        <div key={ch.id} className={styles.staticBlock}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 연출 미디어 */}
          <img className={cn(styles.staticBg, TONE[ch.bg.tone])} src={ch.bg.src} alt="" />
          <div className={styles.staticCopy}>
            <ChapterCopy ch={ch} />
          </div>
          <div className={styles.staticCards}>
            {ch.cards.map((c) => (
              <Card key={c.src} card={c} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function StoryHero({ content, onSolid, onConcealHeader }: StoryHeroProps) {
  const reduced = useMediaFlag(REDUCED_MQ);
  const rootRef = useRef<HTMLElement>(null);
  const [cur, setCur] = useState<number | "intro">("intro");
  const count = content.chapters.length + 1; // 마지막 "지금" 장 번호

  // 인트로 — 스크롤이 먼저 오면 즉시 끝낸다(헤더가 숨은 채 남지 않게).
  useEffect(() => {
    if (reduced) return;
    // 인트로 연출 트리거(data-intro)는 서버 HTML에 두지 않고 마운트 시점에 단다 — 문구 애니메이션(CSS)과
    // 축소 타이머(JS)가 같은 시계로 시작해야 하이드레이션이 늦어도 문구가 먼저 사라지지 않는다.
    // 리렌더가 필요 없는 표시용 속성이라 상태 대신 DOM에 직접 쓴다.
    const el = rootRef.current;
    const setRun = (on: boolean) => {
      if (!el) return;
      if (on) el.dataset.intro = "run";
      else delete el.dataset.intro;
    };
    let timers: ReturnType<typeof setTimeout>[] = [];
    const finish = () => {
      timers.forEach(clearTimeout);
      setRun(false);
      setCur((c) => (c === "intro" ? 0 : c));
      onConcealHeader?.(false);
      window.removeEventListener("scroll", finish);
    };
    // 새로고침·뒤로 가기로 스크롤이 이미 히어로 아래에서 복원됐으면 인트로를 건너뛴다
    // (화면 밖 인트로가 헤더를 숨기고 1.8초 뒤 엉뚱한 장을 띄우지 않게).
    if (el && window.scrollY > el.offsetTop) {
      timers = [setTimeout(finish, 0)];
      return () => timers.forEach(clearTimeout);
    }
    onConcealHeader?.(true);
    setRun(true);
    timers = [
      setTimeout(() => setCur((c) => (c === "intro" ? 0 : c)), INTRO_HOLD_MS),
      setTimeout(() => onConcealHeader?.(false), INTRO_HEADER_MS),
      setTimeout(() => {
        setRun(false);
        window.removeEventListener("scroll", finish);
      }, INTRO_END_MS),
    ];
    window.addEventListener("scroll", finish, { passive: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", finish);
      onConcealHeader?.(false);
    };
  }, [reduced, onConcealHeader]);

  // 스크롤 → 장 번호, 히어로를 지나면 헤더 솔리드.
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = rootRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      setCur((c) => (c === "intro" ? c : chapterAt(window.scrollY, top, vh, count)));
      onSolid?.(window.scrollY > top + el.offsetHeight - vh);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // 마운트 직후 한 번 — 스크롤 복원은 scroll 이벤트 없이 일어날 수 있다.
    const first = setTimeout(onScroll, 0);
    return () => {
      clearTimeout(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, count, onSolid]);

  if (reduced) return <StaticStory content={content} />;

  const { split, chapters, intro } = content;
  const credit = chapters.find((c, i) => c.bg.credit && cur === i + 1)?.bg.credit;
  const toTop = () =>
    window.scrollTo({ top: (rootRef.current?.offsetTop ?? 0), behavior: "smooth" });

  return (
    <section
      ref={rootRef}
      className={styles.root}
      data-cur={cur}
      data-now={cur === count ? "" : undefined}
      style={{ "--steps": count + 1 } as CSSProperties}
    >
      <div className={styles.stage}>
        <div className={styles.dark} />
        <div className={styles.splitBg}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 연출 미디어 */}
          <img src={split.bg} alt="" />
        </div>
        {chapters.map((ch, i) => (
          <div key={ch.id} className={cn(styles.bg, TONE[ch.bg.tone], cur === i + 1 && styles.on)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 연출 미디어 */}
            <img src={ch.bg.src} alt="" />
          </div>
        ))}
        <div className={styles.shade} />

        <div className={styles.split}>
          <SplitCopy split={split} />
        </div>
        <div className={styles.pile}>
          <Card card={split.cards[0]} className={styles.c1} />
          <Card card={split.cards[1]} className={styles.c2} />
          <Card card={split.cards[2]} className={styles.c3} priority />
        </div>

        {/* 장마다 글 + 사진 묶음을 한 덩어리로 — 데스크톱은 각자 절대 배치(글 좌상·카드 우하),
            휴대폰은 세로로 쌓고 카드 묶음이 남은 높이만큼만 줄어든다(짧은 화면에서도 겹침 0). */}
        {chapters.map((ch, i) => (
          <div key={ch.id} className={styles.chap}>
            <div className={cn(styles.copy, cur === i + 1 && styles.on)}>
              <ChapterCopy ch={ch} />
            </div>
            {ch.cards.length > 0 ? (
              <div className={cn(styles.pile2, ch.cards.length >= 3 ? styles.n3 : styles.n2, cur === i + 1 && styles.on)}>
                <div className={styles.pileBox}>
                  {ch.cards.slice(0, 3).map((c) => (
                    <Card key={c.src} card={c} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}

        <div className={styles.mark} aria-hidden>
          <b>{intro.mark}</b>
          <span>{intro.sub}</span>
        </div>
        {credit ? <p className={cn(typo.caption, styles.credit)}>{credit}</p> : null}
        <button
          type="button"
          className={cn(typo.bodySm, styles.back)}
          onClick={toTop}
          tabIndex={cur === count ? 0 : -1} // 마지막 장에서만 보이므로 그때만 탭 순서에 넣는다
        >
          {content.backLabel}
        </button>
        <div className={cn(typo.caption, styles.cue)} aria-hidden>
          <ChevronDown size={20} />
        </div>
      </div>
    </section>
  );
}
