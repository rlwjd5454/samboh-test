// samboh-web/src/pages/Middle2508.tsx
import { useEffect, useMemo, useState } from 'react';
import { loadMiddle2508, loadClassIndex2508, type SessionPayload, type ClassIndex, type MiddleScore } from '@/utils/fetchScores';

export default function Middle2508Page() {
  const [scores, setScores] = useState<SessionPayload | null>(null);
  const [idx, setIdx] = useState<ClassIndex | null>(null);
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('');
  const [adminView, setAdminView] = useState(false); // 관리자 토글

  useEffect(() => {
    Promise.all([loadMiddle2508(), loadClassIndex2508()])
      .then(([s, i]) => { setScores(s); setIdx(i); })
      .catch(console.error);
  }, []);

  const classes = useMemo(() => {
    if (!idx) return [];
    return Object.keys(idx.by_class).sort((a,b)=>a.localeCompare(b));
  }, [idx]);

  const baseRows = useMemo(() => {
    if (!scores) return [];
    return adminView ? scores.students : scores.students.filter(s => s.is_active_251022);
  }, [scores, adminView]);

  const filtered = useMemo(() => {
    const byText = baseRows.filter(s => {
      const query = q.trim();
      if (!query) return true;
      return (s.id?.includes(query))
        || (s.name && String(s.name).includes(query))
        || (s.school && String(s.school).includes(query))
        || (s.level && String(s.level).includes(query));
    });

    if (!cls || !idx) return byText;
    const allow = new Set(idx.by_class[cls] ?? []);
    // 반 클릭 시 재원생만 노출. 관리자뷰에서는 allow를 무시하지 않고 그대로 적용.
    return byText.filter(s => allow.has(s.id));
  }, [baseRows, q, cls, idx]);

  if (!scores) return <div className="p-4">불러오는 중</div>;

  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">2508 중등 과정평가</h1>
          <p className="text-sm text-gray-500">
            응시 {scores.counts}명 · 평균 GR {scores.averages.gr} / RC {scores.averages.rc} / 총점 {scores.averages.total}
          </p>
          <p className="text-xs text-gray-400">기준일 251022 재원생만 기본 노출. 비재원생 데이터는 보존되며 관리자 보기에서만 표시.</p>
        </div>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={adminView} onChange={(e)=>setAdminView(e.target.checked)} />
          관리자 보기
        </label>
      </header>

      <section className="flex flex-wrap gap-2">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="이름/식별번호/학교/레벨 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={cls}
          onChange={(e) => setCls(e.target.value)}
        >
          <option value="">반 전체</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {cls && (
          <button
            className="border rounded px-3 py-2"
            onClick={()=>setCls('')}
            aria-label="clear class"
          >
            반 선택 해제
          </button>
        )}
      </section>

      <section className="overflow-auto rounded border">
        <table className="min-w-[960px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">식별번호</th>
              <th className="px-3 py-2 text-left">이름</th>
              <th className="px-3 py-2 text-left">학교</th>
              <th className="px-3 py-2">학년</th>
              <th className="px-3 py-2">반명</th>
              <th className="px-3 py-2">레벨</th>
              <th className="px-3 py-2">담임</th>
              <th className="px-3 py-2">GR</th>
              <th className="px-3 py-2">RC</th>
              <th className="px-3 py-2">총점</th>
              <th className="px-3 py-2">재원</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s: MiddleScore) => (
              <tr key={s.id} className="border-t">
                <td className="px-3 py-2 font-mono">{s.id}</td>
                <td className="px-3 py-2">{s.name ?? '-'}</td>
                <td className="px-3 py-2">{s.school ?? '-'}</td>
                <td className="px-3 py-2 text-center">{s.grade ?? '-'}</td>
                <td className="px-3 py-2">{s.class ?? '-'}</td>
                <td className="px-3 py-2 text-center">{s.level ?? '-'}</td>
                <td className="px-3 py-2">{s.teacher ?? '-'}</td>
                <td className="px-3 py-2 text-center">{s.gr}</td>
                <td className="px-3 py-2 text-center">{s.rc}</td>
                <td className="px-3 py-2 text-center font-semibold">{s.total}</td>
                <td className="px-3 py-2 text-center">{s.is_active_251022 ? 'Y' : (adminView ? 'N' : '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
