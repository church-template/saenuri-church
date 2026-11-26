import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WORSHIP, SPECIAL_SERVICES } from "@/constants/content";
import { WorshipSpecial } from "./WorshipSpecial";

describe("WorshipSpecial", () => {
  it("특별 예배를 줄 목록(시기·이름·설명·시간)으로 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    // 날짜 고정 — 다음 예배가 부활절이면 띠에도 이름이 나와 getByText가 날짜에 따라 깨진다.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-10T09:00:00+09:00")); // 다음 = 추수감사
    render(<WorshipSpecial />);
    vi.useRealTimers();

    expect(screen.getByRole("heading", { level: 2, name: WORSHIP.specialHeading })).toBeDefined();
    // 예배 이름은 h3 — 전부(slice 회귀 방지)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(SPECIAL_SERVICES.length);
    expect(screen.getAllByRole("listitem")).toHaveLength(SPECIAL_SERVICES.length);

    const first = SPECIAL_SERVICES[0]; // 송구영신예배 — name/date/time/desc 모두 유일값
    expect(screen.getByText(first.name)).toBeDefined();
    expect(screen.getByText(first.date)).toBeDefined();
    expect(screen.getByText(first.time)).toBeDefined();
    expect(screen.getByText(first.desc)).toBeDefined();
  });

  it("다음 특별 예배 띠 — 추수감사주일 다음 날이면 성탄절", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-16T09:00:00+09:00"));
    render(<WorshipSpecial />);
    vi.useRealTimers();

    expect(screen.getByText(WORSHIP.specialNextLabel)).toBeDefined();
    expect(screen.getAllByText("성탄절예배")).toHaveLength(2); // 띠 + 목록
    expect(screen.getByText("12월 25일 금요일 · 추후 안내")).toBeDefined();
    expect(screen.getByText("39일 남았어요")).toBeDefined();
  });

  it("다음 특별 예배 띠 — 새해 첫날이면 그 주 주일의 신년예배", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2027-01-01T09:00:00+09:00"));
    render(<WorshipSpecial />);
    vi.useRealTimers();

    expect(screen.getAllByText("신년예배")).toHaveLength(2);
    expect(screen.getByText("1월 3일 일요일 · 오전 11:00")).toBeDefined();
    expect(screen.getByText("2일 남았어요")).toBeDefined();
  });
});
