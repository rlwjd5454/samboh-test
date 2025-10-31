import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

/** /student/:id 에서 학생 모든 회차 성적 표시 */
async function fetchStudentById(id) {
  // 1) 백엔드 API 우선
  try {
    const r = await fetch(`/api/students/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });
    if (r.ok) {
      const data = await r.json();
      if (data && (data.records?.length || data.name)) return data;
    }
  } catch {}

  // 2) 정적 맵: public/data/student_records.json
  try {
    const r2 = await fetch("/data/student_records.json", {
      headers: { Accept: "application/json" },
    });
    if (r2.ok) {
      const map = await r2.json();
      const row = map?.[id];
      if (row) return row;
    }
  } catch {}

  // 3) window 변수 (선택)
  const local = window.__SAMBO_STUDENT__?.[id];
  if (local) return local;

  return null;
}

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetchStudentById(id)
      .then((data) => {
        if (!alive) return;
        if (!data) setError("학생 데이터를 찾을 수 없습니다.");
        else {
          const sorted = [...(data.records ?? [])].sort((a, b) =>
            String(a.session).localeCompare(String(b.session))
          );
          setStudent({ ...data, records: sorted });
        }
      })
      .catch(() => alive && setError("데이터를 불러오는 중 오류 발생"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  const summary = useMemo(() => {
    if (!student?.records?.length) return null;
    const n = student.records.length;
    const sum = student.records.reduce(
      (acc, r) => {
        acc.GR += Number(r.GR || 0);
        acc.RC += Number(r.RC || 0);
        acc.Total += Number(r.Total || 0);
        return acc;
      },
      { GR: 0, RC: 0, Total: 0 }
    );
    return {
      count: n,
      GR: (sum.GR / n).toFixed(1),
      RC: (sum.RC / n).toFixed(1),
      Total: (sum.Total / n).toFixed(1),
    };
  }, [student]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/login" className="hover:underline">← 로그인으로</Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">학생 성적 상세</h1>

      {loading && <p>불러오는 중...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && student && (
        <>
          <div className="rounded-lg border p-4 mb-6">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-xs text-gray-500">식별번호</div>
                <div className="font-mono text-lg">{id}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">이름</div>
                <div className="text-lg">{student.name ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">학교</div>
                <div className="text-lg">{student.school ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">학년</div>
                <div className="text-lg">{student.grade ?? "-"}</div>
              </div>
              {summary && (
                <div className="ml-auto">
                  <div className="text-xs text-gray-500">회차 수</div>
                  <div className="text-lg">{summary.count}</div>
                </div>
              )}
            </div>
          </div>

          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-gray-500">평균 GR</div>
                <div className="text-2xl font-semibold">{summary.GR}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-gray-500">평균 RC</div>
                <div className="text-2xl font-semibold">{summary.RC}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-gray-500">평균 총점</div>
                <div className="text-2xl font-semibold">{summary.Total}</div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2">회차</th>
                  <th className="px-3 py-2">GR</th>
                  <th className="px-3 py-2">RC</th>
                  <th className="px-3 py-2">총점</th>
                  <th className="px-3 py-2">레벨</th>
                  <th className="px-3 py-2">시험지</th>
                </tr>
              </thead>
              <tbody>
                {student.records.map((r) => (
                  <tr key={r.session} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono">{r.session}</td>
                    <td className="px-3 py-2">{r.GR ?? "-"}</td>
                    <td className="px-3 py-2">{r.RC ?? "-"}</td>
                    <td className="px-3 py-2 font-semibold">{r.Total ?? "-"}</td>
                    <td className="px-3 py-2">{r.level ?? "-"}</td>
                    <td className="px-3 py-2">
                      {pdfHref(r.session) ? (
                        <a
                          className="text-blue-600 hover:underline"
                          href={pdfHref(r.session)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          보기
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!student.records.length && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-6">
                      표시할 성적이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function pdfHref(session) {
  // public/papers/시험지_{회차}_P1~H6_과정평가.pdf 규칙
  return `/papers/${encodeURIComponent(`시험지_${session}_P1~H6_과정평가.pdf`)}`;
}
