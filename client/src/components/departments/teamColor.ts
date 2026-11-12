import type { TeamColor } from "@/constants/departments";

// 팀 색 점(team-dot) 유틸 매핑 — Tailwind가 클래스를 추출하도록 완성된 문자열로 둔다.
export const TEAM_DOT: Record<TeamColor, string> = {
  orange: "bg-team-orange",
  skyblue: "bg-team-skyblue",
  red: "bg-team-red",
  blue: "bg-team-blue",
  green: "bg-team-green",
  purple: "bg-team-purple",
};

// 팀 색이 없는 부서(템플릿 기본)는 네이비 단일 액센트로 폴백.
export const teamDot = (team?: TeamColor) => (team ? TEAM_DOT[team] : "bg-primary");
