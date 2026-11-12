"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";
import { REDUCED_MQ, useMediaFlag } from "@/lib/hooks/useMediaFlag";
import { chapterAt } from "./storyChapter";
import type { StoryCard, StoryChapter, StoryHeroContent } from "./types";
import styles from "./StoryHero.module.css";

// 메인 스토리 히어로(DESIGN.md story-hero). 인트로(사진판 + "축복합니다", 시간이 지나면 넘어감) → 스플릿 첫 화면 →
// 과거→현재 장 → 마지막 "지금" 장(앞 카드가 풀스크린). 모든 장은 고정 무대에서 크로스페이드로 넘어간다.
// 장 번호는 window 스크롤에서 chapterAt으로 계산한다.
const INTRO_HOLD_MS = 1800; // 문구가 떠 있는 시간 — 이 동안은 스크롤 입력을 막아 끝까지 보여 준다
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

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
  const [cur, setCur] = useState(-1); // -1 = 인트로
  const count = content.chapters.length + 1; // 마지막 "지금" 장 번호

  // 인트로 — 끝까지 보여 준 뒤 INTRO_HOLD_MS에 장 0으로 크로스페이드.
  // 그동안 휠·터치·키보드 스크롤을 막는다(overflow 잠금은 스크롤바가 사라져 화면이 옆으로 밀린다).
  useEffect(() => {
    if (reduced) return;
    const el = rootRef.current;
    let timer: ReturnType<typeof setTimeout>;
    const block = (e: Event) => e.preventDefault();
    const blockKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    const unlock = () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKey);
    };
    const finish = () => {
      clearTimeout(timer);
      unlock();
      setCur((c) => (c === -1 ? 0 : c));
      onConcealHeader?.(false);
    };
    // 새로고침·뒤로 가기로 스크롤이 이미 히어로 아래에서 복원됐으면 인트로를 건너뛴다.
    if (el && window.scrollY > el.offsetTop) {
      timer = setTimeout(finish, 0);
      return () => clearTimeout(timer);
    }
    onConcealHeader?.(true);
    timer = setTimeout(finish, INTRO_HOLD_MS);
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKey);
    return () => {
      clearTimeout(timer);
      unlock();
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
      setCur((c) => (c === -1 ? c : chapterAt(window.scrollY, top, vh, count)));
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

  const { split, chapters, intro } = content;
  // 인트로 화면 — 고정 무대에선 맨 앞 덮개(cur -1 동안), 움직임 줄이기에선 맨 위 정적 블록으로 쓴다.
  const introLayer = (
    <div className={styles.intro}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 연출 미디어 */}
      <img src={intro.bg} alt="" fetchPriority="high" />
      <div className={styles.mark} aria-hidden>
        {/* 한 글자씩 떠오르게 글자마다 순번(--i)을 준다 */}
        <b>
          {Array.from(intro.mark).map((ch, i) => (
            <span key={i} className={styles.ch} style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </b>
        <span className={styles.sub}>{intro.sub}</span>
      </div>
    </div>
  );

  if (reduced) {
    return (
      <>
        <div className={styles.introStatic}>{introLayer}</div>
        <StaticStory content={content} />
      </>
    );
  }

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
        {introLayer}

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

        {/* 마지막 "지금" 장 — 로고 + 표어 */}
        <div className={styles.nowCopy} aria-hidden={cur !== count}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 장식 로고(교회명은 글로 이어진다) */}
          <img src={content.now.logo} alt="" className={styles.nowLogo} />
          <p className={cn(typo.displayLg, styles.nowLine)}>{content.now.line}</p>
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
