// src/pages/Admin.jsx
import { useEffect, useMemo, useState } from "react";

// 25년 8월 중등 기준일(251022) 반별 재원 데이터 기반 관리자 대시보드
export default function Admin() {
  const [data, setData] = useState(null);          // 성적+재원 데이터
  const [idx, setIdx] = useState(null);            // 반별 인덱스
  const [cls, setCls] = useState("");              // 반 선택
  const [q, setQ] = useState("");                  // 검색
  const [adminView, setAdminView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/score_2508_middle_251022.json").then(r => r.json()),
      fetch("/data/index_2508_by_class_251022.json").then(r => r.json()),
    ])
      .then(([score, index]) => {
        setData(score);
        setIdx(index);
      })
      .finally(() => setLoading(false));
  }, []);

  const allRows = useMemo(() => {
    if (!data) return [];
    return adminView ? data.students : data.students.filter(s => s.is_active_251022);
  }, [data, adminView]);

  const filtered = useMemo(() => {
    if (!idx) return allRows;
    const query = q.trim();
    let base = allRows;

    if (cls) {
      const allow = new Set(idx.by_class[cls] || []);
      base = base.filter(s => allow.has(s.id));
    }
    if (query) {
      base = base.filter((r) =>
        [r.id, r.name, r.school, r.level, r.teacher]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query.toLowerCase()))
      );
    }
    return base;
  }, [allRows, q, cls, idx]);

  const classList = useMemo(() => idx ? Object.keys(idx.by_class).sort() : [], [idx]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <h1 style={{margin:0}}>중등 관리자 대시보드</h1>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <label style={{fontSize:13}}>
            <input type="checkbox" checked={adminView} onChange={(e)=>setAdminView(e.target.checked)} /> 관리자 보기
          </label>
          <a href="/" style={st.link}>로그아웃</a>
        </div>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <input
              placeholder="식별번호/이름/학교/레벨/담임 검색"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              style={st.search}
            />
            <select value={cls} onChange={(e)=>setCls(e.target.value)} style={st.select}>
              <option value="">반 전체</option>
              {classList.map((c)=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span style={{opacity:.9,fontSize:12,color:"#DDE8FF"}}>
              {loading ? "불러오는 중…" : `총 ${filtered.length.toLocaleString()}명`}
            </span>
          </div>

          <div style={{overflow:"auto", maxHeight:"65svh", border:"1px solid rgba(255,255,255,.1)", borderRadius:12}}>
            <table style={st.table}>
              <thead>
                <tr>
                  {["식별번호","성명","학교명","학년","반명","레벨","담임","GR","RC","총점","재원"].map(h=>(<th key={h}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11} style={{textAlign:"center",padding:16}}>불러오는 중…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={11} style={{textAlign:"center",padding:16}}>결과가 없습니다.</td></tr>
                ) : (
                  filtered.map((r)=>(
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name ?? "-"}</td>
                      <td>{r.school ?? "-"}</td>
                      <td>{r.grade ?? "-"}</td>
                      <td>{r.class ?? "-"}</td>
                      <td>{r.level ?? "-"}</td>
                      <td>{r.teacher ?? "-"}</td>
                      <td>{r.gr}</td>
                      <td>{r.rc}</td>
                      <td style={{fontWeight:700}}>{r.total}</td>
                      <td style={{textAlign:"center"}}>{r.is_active_251022 ? "Y" : (adminView ? "N" : "")}</td>
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
    fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Helvetica, Arial',
  },
  header: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,.2)"
  },
  link: { color:"#fff", textDecoration:"underline" },
  main: { width:"min(1100px,94vw)", margin:"20px auto" },
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
  select: {
    padding:"10px 12px", borderRadius:10, border:"1px solid #20304e",
    background:"rgba(7,19,48,.35)", color:"#fff", outline:"none"
  },
  table: { width:"100%", borderCollapse:"collapse", fontSize:14 }
};
