import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Container } from "./Container";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { CTA_BAND } from "@/constants/content";

// 프리푸터 사진 밴드(DESIGN cta-band-dark) — 교회 단체 사진 위 cover-dark 덮개, 헤드라인 + 안내 한 줄 + CTA 2개.
// 사진은 장식(alt="")이고 덮개가 글 대비를 보장한다.
export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden bg-cover-dark py-section">
      <Image src={CTA_BAND.image} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-cover-dark/60 to-cover-dark/90" />
      <Container className="flex flex-col items-center gap-lg text-center">
        <div>
          <h2 className={cn(typo.displayLg, "text-on-dark")}>{CTA_BAND.heading}</h2>
          <p className={cn(typo.bodyMd, "mt-sm text-on-dark")}>{CTA_BAND.lead}</p>
        </div>
        <div className="flex flex-col gap-sm sm:flex-row">
          <Link href="/about" className={buttonVariants("pillCta")}>
            {CTA_BAND.primary}
          </Link>
          {/* outline 보조 CTA도 pill-cta와 동일 크기(56px) — DESIGN.md가 CTA 밴드 버튼 둘 다 대형 필로 명시 */}
          <Link
            href="/about/location"
            className={cn(buttonVariants("outlineOnDark"), "h-14 px-8")}
          >
            {CTA_BAND.secondary}
          </Link>
        </div>
      </Container>
    </section>
  );
}
