import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// 커스텀 타이포 토큰(globals.css @theme --text-*)을 font-size 그룹으로 등록한다.
// 기본 설정은 미지의 `text-*`를 색상으로 분류해 `cn(typo.X, "text-ink")` 조합에서
// 크기 클래스를 제거해 버린다 — 전 섹션 헤딩이 16px로 붕괴했던 원인(T08 발견).
// 새 --text-* 토큰을 추가하면 이 목록에도 함께 등록해야 한다(utils.test.ts가 회귀 감시).
const twMerge = extendTailwindMerge({
  extend: {
    // 간격 토큰(globals.css @theme --spacing-*)도 등록한다 — 모르는 이름(base·xxs 등)은 충돌로 보지 않아
    // 소비자가 넘긴 p-base가 기본 p-xl과 함께 남고 CSS 순서가 승자를 정했다. 새 --spacing-* 토큰도 여기에.
    theme: {
      spacing: ["xxs", "xs", "sm", "base", "md", "lg", "xl", "xxl", "section", "nav"],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "display-mega",
            "display-xl",
            "display-lg",
            "display-md",
            "display-sm",
            "title-lg",
            "title-md",
            "title-sm",
            "body-md",
            "body-lg",
            "body-xl",
            "body-lg-strong",
            "body-strong",
            "body-sm",
            "datetime",
            "datetime-lg",
            "caption",
            "caption-strong",
            "button",
            "nav-link",
          ],
        },
      ],
    },
  },
});

// className 병합·충돌 해소(shadcn 표준 cn). variant 클래스 + 소비자 className override 안전.
// 위치는 shadcn 기본 경로(@/lib/utils) — T04 동작 컴포넌트가 무수정 import.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
