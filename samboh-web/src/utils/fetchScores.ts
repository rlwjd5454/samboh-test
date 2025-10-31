// samboh-web/src/utils/fetchScores.ts

/** ===== Types ===== */
export type MiddleScore = {
  id: string;
  name?: string | null;
  school?: string | null;
  grade?: number | string | null;
  class?: string | null;
  level?: string | null;
  teacher?: string | null;
  gr: number;
  rc: number;
  total: number;
  is_active_251022?: boolean;
  snapshot_class_251022?: string | null;
  snapshot_level_251022?: string | null;
};

export type SessionPayload = {
  session: string;                // 예: "2508"
  division: string;               // 예: "중등"
  counts: number;                 // 학생 수
  averages: { gr: number; rc: number; total: number };
  students: MiddleScore[];
};

export type ClassIndex = {
  session: string;                // 예: "2508"
  baseline: string;               // 예: "251022"
  by_class: Record<string, string[]>; // 반명 -> 식별번호 배열
};

export type RosterMeta = {
  middle?: { yyyymmdd?: string; label?: string };
  elementary?: { yyyymmdd?: string; label?: string };
};

/** ===== Fetch helper ===== */
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`fetch failed: ${url}`);
  return res.json();
}

/** ===== Meta loader =====
 * 기준일(yyyymmdd/label)을 읽어 동적 파일명을 구성할 때 사용
 */
export async function loadRosterMeta(): Promise<RosterMeta> {
  return fetchJSON<RosterMeta>("/data/roster-meta.json");
}

/** ===== Static loaders (현재 운영: 2508 중등 + 251022) ===== */
export function loadMiddle2508(): Promise<SessionPayload> {
  return fetchJSON<SessionPayload>("/data/score_2508_middle_251022.json");
}
export function loadClassIndex2508(): Promise<ClassIndex> {
  return fetchJSON<ClassIndex>("/data/index_2508_by_class_251022.json");
}

/** ===== Dynamic loaders (메타 기반) =====
 * 향후 기준일을 바꿔도 페이지 코드는 그대로 두고 이 함수만 재사용
 */
export async function loadMiddleByMeta(): Promise<SessionPayload> {
  const meta = await loadRosterMeta();
  const y = meta?.middle?.yyyymmdd || meta?.middle?.label || "251022";
  // 회차가 늘어나면 session도 메타로 확장 가능. 현 시점은 2508 고정.
  return fetchJSON<SessionPayload>(`/data/score_2508_middle_${y}.json`);
}

export async function loadClassIndexByMeta(): Promise<ClassIndex> {
  const meta = await loadRosterMeta();
  const y = meta?.middle?.yyyymmdd || meta?.middle?.label || "251022";
  return fetchJSON<ClassIndex>(`/data/index_2508_by_class_${y}.json`);
}
