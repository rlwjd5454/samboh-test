import { useEffect, useMemo, useState } from "react";

export default function Admin() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터 먼저 → 실제 JSON으로 후에 교체
    fetch("/data/sample-중등.json")
      .then((r) => r.json())
      .then((d) => setRows(d))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim();
    if (!needle) return rows;
    return rows.filter((r) =>
      [r.식별번호, r.성명, r.학교명, r.레벨, r.담임]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle.toLowerCase()))
    );
  }, [rows, q]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <h1 style={{margin:0}}>관리자 대시보드</h1>
        <div style={{display:"flex", gap:8}}>
          <a href="/" style={st.link}>로그아웃</a>
        </div>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          <div style={{display:"flex", gap:10, alignItems:"center", marginBottom: 10}}>
            <input
              placeholder="식별번호/이름/학교/레벨/담임 검색"
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
                  {["식별번호","성명","학교명","학년","레벨","담임","GR","RC","총점","회차"].map(h=>(
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} style={{textAlign:"center", padding:16}}>불러오는 중…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{textAlign:"center", padding:16}}>결과가 없습니다.</td></tr>
                ) : (
                  filtered.map((r)=>(
                    <tr key={r.식별번호 + r.회차}>
                      <td>{r.식별번호}</td>
                      <td>{r.성명}</td>
                      <td>{r.학교명}</td>
                      <td>{r.학년}</td>
                      <td>{r.레벨}</td>
                      <td>{r.담임 || "-"}</td>
                      <td>{r.GR}</td>
                      <td>{r.RC}</td>
                      <td style={{fontWeight:700}}>{r.총점}</td>
                      <td>{r.회차}</td>
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
  table: {
    width:"100%", borderCollapse:"collapse", fontSize:14,
  }
};
