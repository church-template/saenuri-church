import { CHURCH_BLOG_RSS_URL } from "@/constants/church";

export interface BlogPost {
  title: string;
  /** 블로그 글 주소(https) */
  url: string;
  /** 한국 날짜 "YYYY-MM-DD" — formatDate에 그대로 넘긴다 */
  date: string;
  /** 대표 사진 주소. 사진 없는 글은 null */
  image: string | null;
}

const ENTITIES: Record<string, string> = { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&amp;": "&" };
const decode = (s: string) => s.replace(/&(?:lt|gt|quot|apos|amp|#39);/g, (m) => ENTITIES[m]);

// <tag>값</tag> 또는 <tag><![CDATA[값]]></tag>
function field(item: string, tag: string): string {
  const m = item.match(new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
  return m ? m[1].trim() : "";
}

const isHttp = (u: string) => /^https?:\/\//.test(u);
const kstDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });

// 네이버 블로그 RSS에서 최근 글을 뽑는다. 외부 데이터라 제목·날짜·주소가 성하지 않은 글은 버린다.
// XML 파서 대신 정규식 — 필요한 건 item 안의 칸 네 개뿐이고, 형식이 달라지면 빈 배열(구간 숨김)로 끝난다.
export function parseNaverRss(xml: string, limit: number): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    if (posts.length >= limit) break;
    const title = decode(field(item, "title"));
    const url = field(item, "guid");
    const at = new Date(field(item, "pubDate"));
    if (!title || !isHttp(url) || Number.isNaN(at.getTime())) continue;
    const src = item.match(/<img[^>]*\ssrc="([^"]+)"/)?.[1] ?? "";
    posts.push({
      title,
      url,
      date: kstDate.format(at),
      // RSS의 대표 사진은 365px(type=s3)라 카드에서 흐리다 — 같은 주소의 큰 판(type=w2)을 쓴다.
      // ponytail: 네이버 비공식 파라미터. w2가 막히면 이 치환만 지우면 된다(작은 사진으로 돌아감).
      image: isHttp(src) ? src.replace("type=s3", "type=w2") : null,
    });
  }
  return posts;
}

// 홈 블로그 구간용 — 서버 컴포넌트 전용. 실패해도 홈은 살아야 하므로 던지지 않고 빈 배열(구간 숨김).
// 블로그는 자주 안 바뀐다 — 1시간 캐시로 방문마다 네이버를 부르지 않는다.
export async function getBlogPosts(limit = 3): Promise<BlogPost[]> {
  if (!CHURCH_BLOG_RSS_URL) return [];
  try {
    const res = await fetch(CHURCH_BLOG_RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`블로그 RSS 응답 ${res.status}`);
    return parseNaverRss(await res.text(), limit);
  } catch (error) {
    console.error(error); // 서버 로깅 지점, 화면 비노출(page의 getMain 처리와 같은 관례)
    return [];
  }
}
