import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminTeacherStudents() {
  const { division, teacher } = useParams(); // ex) middle, "Ella"
  const nav = useNavigate();
  const [data, setData] = useState({});      // { 담임명: [학생들...] }
  const [loading, setLoading] = useState(true);
  const teacherName = decodeURIComponent(teacher || "");

  useEffect(() => {
    const token = sessionStorage.getItem("samboh-auth");
    if (!token) nav("/");
  }, [nav]);

  useEffect(() => {
    setLoading(true);
    const url =
      division === "elementary"
        ? "/data/students-by-teacher-elementary.json"
        : "/data/students-by-teacher-middle.json";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(d || {}))
      .finally(() => setLoading(false));
  }, [division]);

  const rows = useMemo(() => data?.[teacherName] || [], [data, teacherName]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>nav(`/admin/${division}`)} style={st.backBtn}>←</button>
          <strong>{teacherName} 담임 — 학생 목록</strong>
        </div>
        <a href="/" style={st.link}>로그아웃</a>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          {loading ? (
            <p>불러오는 중…</p>
          ) : rows.length === 0 ? (
            <p>해당 담임의 학생 데이터가 없습니다.</p>
          ) : (
            <>
              <div style={{marginBottom:10, opacity:.95, fontSize:13}}>
                총 <b>{rows.length.toLocaleString()}</b>명
              </div>
              <div style={{overflow:"auto", maxHeight:"65svh", border:"1px solid rgba(255,255,255,.1)", borderRadius:12}}>
                <table style={st.table}>
                  <thead>
                    <tr>
                      {["식별번호","성명","학교명","학년","레벨","반명"].map(h=>(
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.식별번호}>
                        <td>{r.식별번호}</td>
                        <td>{r.성명}</td>
                        <td>{r.학교명 || "-"}</td>
                        <td>{r.학년 || "-"}</td>
                        <td>{r.레벨 || "-"}</td>
                        <td>{r.반명 || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

const st = {
  page: { minHeight:"100svh", background:"#0E5FD7", color:"#fff",
    fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Helvetica, Arial' },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,.2)" },
  link: { color:"#fff", textDecoration:"underline" },
  main: { width:"min(1100px, 94vw)", margin:"20px auto" },
  card: { background:"linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
    border:"1px solid rgba(255,255,255,.09)", borderRadius:16, padding:14,
    boxShadow:"0 10px 30px rgba(2,6,23,.35)" },
  table: { width:"100%", borderCollapse:"collapse", fontSize:14 },
  backBtn: { border:0, borderRadius:8, padding:"6px 10px", cursor:"pointer",
    background:"#fff", color:"#0b1220", fontWeight:700 }
};
