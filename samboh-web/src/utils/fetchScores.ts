// samboh-web/src/utils/fetchScores.ts
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
  session: string;
  division: string;              // "중등"
  counts: number;
  averages: { gr: number; rc: number; total: number };
  students: MiddleScore[];
};

export type ClassIndex = {
  session: string;               // "2508"
  baseline: string;              // "251022"
  by_class: Record<string, string[]>;
};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetch failed: ${url}`);
  return res.json();
}

// 2508 중등 + 251022 기준 재원 스냅샷
export function loadMiddle2508() {
  return fetchJSON<SessionPayload>('/data/score_2508_middle_251022.json');
}
export function loadClassIndex2508() {
  return fetchJSON<ClassIndex>('/data/index_2508_by_class_251022.json');
}
