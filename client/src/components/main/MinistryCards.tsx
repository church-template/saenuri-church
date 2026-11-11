import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shell/Container";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { MINISTRY, MINISTRIES } from "@/constants/content";

// 사역 카드(ministry-cards) — 사진이 주인공(DESIGN 개요). 카드 전체가 해당 소개 링크, hover 시 사진 1.03 줌.
export function MinistryCards() {
  return (
    <section className="py-section">
      <Container>
        <SectionHead
          eyebrow={MINISTRY.eyebrow}
          title={MINISTRY.title}
          more={{ label: MINISTRY.more, href: MINISTRY.moreHref }}
        />
        <div className="mt-lg grid gap-base sm:grid-cols-3">
          {MINISTRIES.map((m, i) => (
            <Reveal key={m.key} delay={i * 120} className="h-full">
              <Link
                href={m.href}
                className={cn(
                  "group block h-full overflow-hidden rounded-xl bg-surface-soft",
                  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                )}
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={m.image.src}
                    alt={m.image.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-lg">
                  <h3 className={cn(typo.titleMd, "text-ink")}>{m.title}</h3>
                  <p className={cn(typo.bodyMd, "mt-xs text-body")}>{m.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
