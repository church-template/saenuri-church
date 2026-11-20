import { describe, it, expect } from "vitest";
import { parseNaverRss } from "./naverRss";

const item = (o: { title: string; guid: string; pubDate: string; desc?: string }) => `
<item>
  <author>snrbtc</author>
  <category><![CDATA[교회 소식]]></category>
  <title><![CDATA[${o.title}]]></title>
  <link><![CDATA[${o.guid}?fromRss=true&trackingCode=rss]]></link>
  <guid>${o.guid}</guid>
  <description><![CDATA[${o.desc ?? "본문"}]]></description>
  <pubDate>${o.pubDate}</pubDate>
</item>`;

const feed = (items: string) => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>
<title><![CDATA[채널 제목]]></title><link><![CDATA[https://blog.naver.com/snrbtc]]></link>${items}</channel></rss>`;

const IMG = "https://blogthumb.pstatic.net/a/b.JPEG/IMG%A3%DF0308.jpg?type=s3";

describe("parseNaverRss", () => {
  it("글의 제목·주소·날짜·대표 사진을 뽑는다(채널 제목은 글이 아니다)", () => {
    const xml = feed(
      item({
        title: "미래의 국대가 나타났다",
        guid: "https://blog.naver.com/snrbtc/224470425297",
        pubDate: "Mon, 09 Nov 2026 15:55:28 +0900",
        desc: `<img src="${IMG}" /> 가을의 단풍`,
      }),
    );
    expect(parseNaverRss(xml, 3)).toEqual([
      {
        title: "미래의 국대가 나타났다",
        url: "https://blog.naver.com/snrbtc/224470425297",
        date: "2026-11-09",
        // 더 큰 대표 사진(type=w2)으로 바꿔 쓴다
        image: "https://blogthumb.pstatic.net/a/b.JPEG/IMG%A3%DF0308.jpg?type=w2",
      },
    ]);
  });

  it("개수 제한 — 4개 중 앞 3개만, 순서 유지", () => {
    const xml = feed(
      [1, 2, 3, 4]
        .map((n) => item({ title: `글${n}`, guid: `https://blog.naver.com/snrbtc/${n}`, pubDate: "Mon, 09 Nov 2026 15:55:28 +0900" }))
        .join(""),
    );
    expect(parseNaverRss(xml, 3).map((p) => p.title)).toEqual(["글1", "글2", "글3"]);
  });

  it("사진 없는 글은 image가 null", () => {
    const xml = feed(item({ title: "글", guid: "https://blog.naver.com/snrbtc/1", pubDate: "Mon, 09 Nov 2026 15:55:28 +0900" }));
    expect(parseNaverRss(xml, 3)[0].image).toBeNull();
  });

  it("날짜는 한국 날짜 기준 — 한국 자정 직후 글이 전날로 밀리지 않는다", () => {
    const xml = feed(item({ title: "글", guid: "https://blog.naver.com/snrbtc/1", pubDate: "Sun, 07 Jun 2026 00:30:00 +0900" }));
    expect(parseNaverRss(xml, 3)[0].date).toBe("2026-06-07");
  });

  it("제목의 HTML 엔티티를 풀어 준다", () => {
    const xml = feed(item({ title: "감사 &amp; 은혜 &lt;1탄&gt;", guid: "https://blog.naver.com/snrbtc/1", pubDate: "Mon, 09 Nov 2026 15:55:28 +0900" }));
    expect(parseNaverRss(xml, 3)[0].title).toBe("감사 & 은혜 <1탄>");
  });

  it("못 믿을 주소는 버린다 — http(s)가 아닌 글 주소·사진 주소", () => {
    const xml = feed(
      item({ title: "나쁜 글", guid: "javascript:alert(1)", pubDate: "Mon, 09 Nov 2026 15:55:28 +0900" }) +
        item({
          title: "좋은 글",
          guid: "https://blog.naver.com/snrbtc/2",
          pubDate: "Mon, 09 Nov 2026 15:55:28 +0900",
          desc: `<img src="javascript:alert(1)" />`,
        }),
    );
    const posts = parseNaverRss(xml, 3);
    expect(posts.map((p) => p.title)).toEqual(["좋은 글"]);
    expect(posts[0].image).toBeNull();
  });

  it("제목·날짜가 깨진 글은 건너뛰고, RSS가 아니면 빈 배열", () => {
    const xml = feed(
      item({ title: "", guid: "https://blog.naver.com/snrbtc/1", pubDate: "Mon, 09 Nov 2026 15:55:28 +0900" }) +
        item({ title: "날짜 깨짐", guid: "https://blog.naver.com/snrbtc/2", pubDate: "어제" }),
    );
    expect(parseNaverRss(xml, 3)).toEqual([]);
    expect(parseNaverRss("<html>점검 중</html>", 3)).toEqual([]);
    expect(parseNaverRss("", 3)).toEqual([]);
  });
});
