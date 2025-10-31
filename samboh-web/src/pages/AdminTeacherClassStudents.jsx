// src/pages/AdminTeacherClassStudents.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminTeacherClassStudents() {
  const { division, teacher, classname } = useParams(); // division === "middle"
  const nav = useNavigate();

  const [byTeacher, setByTeacher] = useState({});     // {담임: [ {식별번호, 성명, 학교명, 학년, 레벨, 반명} ]}
  const [scorePayload, setScorePayload] = useState(null); // { session, students:[ {id, name, gr, rc, total, ...} ] }
  const [baseline, setBaseline] = useState("");       // 기준일 라벨
  const [loading, setLoading] = useState(true);

  const teacherName = decodeURIComponent(teacher || "");
  const className = decodeURIComponent(classname || "");

  // 접근 체크
  useEffect(() => {
    const token = sessionStorage.getItem("samboh-auth");
    if (!token) nav("/");
  }, [nav]);

  // 데이터 로딩: 담임별 재원생, 성적, 기준일
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/data/students-by-teacher-middle.json").then(r => r.json()),
      fetch("/data/score_2508_middle_251022.json").then(r => r.json()),
      fetch("/data/roster-meta.json").then(r => (r.ok ? r.json() : {})),
    ])
      .then(([studentsByT, scoreData, meta]) => {
        setByTeacher(studentsByT || {});
        setScorePayload(scoreData || null);
        const label = meta?.middle?.label || meta?.middle?.yyyymmdd || "";
        setBaseline(label);
      })
      .finally(() => setLoading(false));
  }, []);

  // 해당 담임-반 학생 식별번호 세트
  const idSet = useMemo(() => {
    const list = (byTeacher?.[teacherName] || []).filter(
      s => (s.반명 || "").trim() === className
    );
    return new Set(list.map(s => String(s.식별번호)));
  }, [byTeacher, teacherName, className]);

  // 조인: 반 학생 + 성적
  const rows = useMemo(() => {
    if (!scorePayload) return [];
    // 성적 데이터에서 해당 반 id만 추출. is_active_251022가 있어도 담임-반 JSON이 이미 기준일 필터된 데이터라 그대로 사용.
    const joined = scorePayload.students
      .filter(s => idSet.has(String(s.id)))
      .map(s => ({
        식별번호: s.id,
        성명: s.name ?? "-",
        학교명: s.school ?? "-",
        학년: s.grade ?? "-",
        레벨: s.level ?? "-",
        반명: s.class ?? "-",
        GR: s.gr,
        RC: s.rc,
        총점: s.total,
      }))
      .sort((a,b) => {
        const ga = Number(a.학년 || 0), gb = Number(b.학년 || 0);
        if (ga !== gb) return ga - gb;
        return String(a.성명).localeCompare(String(b.성명), "ko");
      });
    return joined;
  }, [scorePayload, idSet]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <button onClick={()=>nav(`/admin/${division}/${encodeURIComponent(teacherName)}`)} style={st.backBtn}>←</button>
          <strong>{teacherName} 담임 — {className}</strong>
          {baseline ? <span style={{opacity:.95,fontSize:13}}> · 기준일: <b>{baseline}</b></span> : null}
        </div>
        <a href="/" style={st.link}>로그아웃</a>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          {loading ? (
            <p>불러오는 중…</p>
          ) : rows.length === 0 ? (
            <p>해당 반의 학생 데이터가 없습니다.</p>
          ) : (
            <>
              <div style={{marginBottom:10, opacity:.95, fontSize:13}}>
                총 <b>{rows.length.toLocaleString()}</b>명
              </div>
              <div style={{overflow:"auto", maxHeight:"65svh", border:"1px solid rgba(255,255,255,.1)", borderRadius:12}}>
                <table style={st.table}>
                  <thead>
                    <tr>
                      {["식별번호","성명","학교명","학년","레벨","반명","GR","RC","총점"].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.식별번호}>
                        <td>{r.식별번호}</td>
                        <td>{r.성명}</td>
                        <td>{r.학교명}</td>
                        <td>{r.학년}</td>
                        <td>{r.레벨}</td>
                        <td>{r.반명}</td>
                        <td style={{textAlign:"center"}}>{r.GR}</td>
                        <td style={{textAlign:"center"}}>{r.RC}</td>
                        <td style={{textAlign:"center", fontWeight:700}}>{r.총점}</td>
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
