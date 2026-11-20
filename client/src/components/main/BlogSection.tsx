import { Container } from "@/components/shell/Container";
import { Card } from "@/components/ui/Card";
import { SectionHead } from "./SectionHead";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { MAIN_SECTIONS } from "@/constants/content";
import { CHURCH_BLOG_URL } from "@/constants/church";
import type { BlogPost } from "@/lib/blog/naverRss";

const B = MAIN_SECTIONS.blog;

// 홈 "블로그 새 글"(blog-section, #51) — 네이버 블로그 최근 글을 sermon-card 결의 사진 카드로.
// 글이 없으면(RSS 실패·블로그 없음) 구간째 그리지 않는다 — 빈 상태 문구를 남길 만한 자리가 아니다.
export function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="py-section">
      <Container>
        <SectionHead title={B.title} more={{ label: B.more, href: CHURCH_BLOG_URL, external: true }} />
        <ul className="mt-lg grid gap-base sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.url}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <Card bordered interactive className="group flex h-full flex-col">
                  {p.image ? (
                    <div className="aspect-video overflow-hidden">
                      {/* 네이버 사진 서버는 다른 사이트 리퍼러가 붙으면 403 — no-referrer로 부른다.
                          next/image를 거치지 않는다(외부 주소·리퍼러 제어 불가). */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-xl">
                    <h3 className={cn(typo.titleMd, "text-ink")}>{p.title}</h3>
                    <p className={cn(typo.datetime, "mt-auto pt-base text-muted")}>{formatDate(p.date)}</p>
                  </div>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
