import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminTeacherClasses() {
  const { division, teacher } = useParams();        // ex) "middle" | "elementary"
  const nav = useNavigate();
  const [data, setData] = useState({});             // { 담임명: [학생들...] }
  const [loading, setLoading] = useState(true);
  const [baseline, setBaseline] = useState("");     // ✅ 기준일 표시용
  const teacherName = decodeURIComponent(teacher || "");

  // 접근권한 체크
  useEffect(() => {
    const token = sessionStorage.getItem("samboh-auth");
    if (!token) nav("/");
  }, [nav]);

  // JSON 로딩 (학생)
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

  // ✅ 기준일 메타 로딩
  useEffect(() => {
    fetch("/data/roster-meta.json")
      .then((r) => r.ok ? r.json() : {})
      .then((m) => {
        const label = m?.[division]?.label || m?.[division]?.yyyymmdd || "";
        setBaseline(label);   // ex) "2025-10-22" 또는 "251022"
      })
      .catch(() => setBaseline(""));
  }, [division]);

  // 해당 담임 학생들
  const students = useMemo(() => data?.[teacherName] || [], [data, teacherName]);

  // 반(클래스) 목록 만들기: 반명별 그룹 + 학생수
  const classes = useMemo(() => {
    const map = new Map();
    for (const s of students) {
      const cls = (s.반명 || "반명없음").trim();
      const prev = map.get(cls);
      if (prev) prev.count += 1;
      else map.set(cls, { name: cls, count: 1 });
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "ko")
    );
  }, [students]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>nav(`/admin/${division}`)} style={st.backBtn}>←</button>
          <strong>{teacherName} 담임 — 반 목록</strong>
        </div>
        <a href="/" style={st.link}>로그아웃</a>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          {loading ? (
            <p>불러오는 중…</p>
          ) : classes.length === 0 ? (
            <p>해당 담임의 학생 데이터가 없습니다.</p>
          ) : (
            <>
              <div style={{marginBottom:10, opacity:.95, fontSize:13}}>
                총 <b>{classes.length}</b>개 반 / 학생 <b>{students.length.toLocaleString()}</b>명
                {baseline ? <> · <b>기준일</b>: {baseline}</> : null}
              </div>

              <div style={st.list}>
                {classes.map(({name, count}) => (
                  <button
                    key={name}
                    style={st.item}
                    onClick={() =>
                      nav(`/admin/${division}/${encodeURIComponent(teacherName)}/class/${encodeURIComponent(name)}`)
                    }
                  >
                    <div style={{fontWeight:800}}>{name}</div>
                    <div style={{opacity:.9, fontSize:12}}>학생 {count}명</div>
                  </button>
                ))}
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
  list: { display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:12, marginTop:8 },
  item: {
    border:0, borderRadius:12, padding:"12px 14px",
    background:"#0b3f9d", color:"#fff", cursor:"pointer",
    textAlign:"left", boxShadow:"0 8px 20px rgba(0,0,0,.15)"
  },
  backBtn: { border:0, borderRadius:8, padding:"6px 10px", cursor:"pointer",
    background:"#fff", color:"#0b1220", fontWeight:700 }
};
