import { useEffect, useMemo, useState } from "react";

/**
 * Admin 전체 성적 뷰 (중등)
 * - roster-meta.json의 기준일을 읽어 해당 기준일 파일(score_2508_middle_YYYMMDD.json)을 우선 로드
 * - 실패 시 sample-중등.json으로 폴백
 * - score 파일의 필드를 화면용(KR 키)으로 매핑하여 표출
 */
export default function Admin() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [baseline, setBaseline] = useState("");  // 기준일 (예: 251022)
  const [session, setSession] = useState("");    // 회차 (예: 2508)

  useEffect(() => {
    let meta = null;
    (async () => {
      try {
        const mr = await fetch("/data/roster-meta.json");
        if (mr.ok) {
          meta = await mr.json();
          const yyyymmdd = meta?.middle?.yyyymmdd || meta?.middle?.label || "";
          setBaseline(yyyymmdd);
          // 현재 운영 회차는 업로드 파일명에서 고정(2508). 필요 시 roster-meta.json에 session을 추가해도 됨.
          const url = `/data/score_2508_middle_${yyyymmdd}.json`;
          const r = await fetch(url);
          if (r.ok) {
            const d = await r.json();
            setSession(d?.session || "2508");
            // d.students => 화면용으로 매핑
            const mapped = (d?.students || []).map((s) => ({
              식별번호: s.id,
              성명: s.name,
              학교명: s.school,
              학년: s.grade,
              레벨: s.level,
              반명: s.class,
              담임: s.teacher,
              GR: s.gr,
              RC: s.rc,
              총점: s.total,
              회차: d?.session || "2508",
              구분: "중등",
            }));
            setRows(mapped);
            return;
          }
        }
      } catch (e) {
        // ignore -> fallback
      }
      // 폴백: 샘플
      try {
        const r2 = await fetch("/data/sample-중등.json");
        const d2 = await r2.json();
        setRows(d2);
      } finally {
        setLoading(false);
      }
    })().finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const x = q.trim();
    return rows.filter((r) =>
      [r.식별번호, r.성명, r.학교명, r.레벨, r.담임, r.반명, r.회차]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(x.toLowerCase()))
    );
  }, [rows, q]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <strong>관리자 대시보드 — 전체 성적(중등)</strong>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          {session ? <span style={{opacity:.9}}>회차: <b>{session}</b></span> : null}
          {baseline ? <span style={{opacity:.9}}>· 기준일: <b>{baseline}</b></span> : null}
          <a href="/" style={st.link}>로그아웃</a>
        </div>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          <div style={{display:"flex", gap:10, alignItems:"center", marginBottom: 10}}>
            <input
              placeholder="식별번호/이름/학교/레벨/담임/반명/회차 검색"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              style={st.search}
            />
            <span style={{opacity:.9,fontSize:12,color:"#DDE8FF"}}>
              총 {filtered.length.toLocaleString()}명
            </span>
          </div>

          <div style={{overflow:"auto", maxHeight:"60svh", border:"1px solid rgba(255,255,255,.1)", borderRadius:12}}>
            <table style={st.table}>
              <thead>
                <tr>
                  {["식별번호","성명","학교명","학년","레벨","담임","GR","RC","총점","회차","반명"].map(h=>(
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11} style={{textAlign:"center", padding:16}}>불러오는 중…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={11} style={{textAlign:"center", padding:16}}>결과가 없습니다.</td></tr>
                ) : (
                  filtered.map((r)=>(
                    <tr key={`${r.식별번호}-${r.회차}`}>
                      <td>{r.식별번호}</td>
                      <td>{r.성명}</td>
                      <td>{r.학교명}</td>
                      <td>{r.학년}</td>
                      <td>{r.레벨}</td>
                      <td>{r.담임}</td>
                      <td>{r.GR}</td>
                      <td>{r.RC}</td>
                      <td>{r.총점}</td>
                      <td>{r.회차}</td>
                      <td>{r.반명}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

const st = {
  page: {
    minHeight:"100svh", background:"#0E5FD7", color:"#fff",
    fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Helvetica, Arial'
  },
  header: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,.2)"
  },
  link: { color:"#fff", textDecoration:"underline" },
  main: { width:"min(1100px, 94vw)", margin:"20px auto" },
  card: {
    background:"linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
    border:"1px solid rgba(255,255,255,.09)", borderRadius:16, padding:14,
    boxShadow:"0 10px 30px rgba(2,6,23,.35)"
  },
  search: {
    flex:"1 1 auto", minWidth:240,
    padding:"10px 12px", borderRadius:10, border:"1px solid #20304e",
    background:"rgba(7,19,48,.35)", color:"#fff", outline:"none"
  },
  table: { width:"100%", borderCollapse:"collapse", fontSize:14 }
};
