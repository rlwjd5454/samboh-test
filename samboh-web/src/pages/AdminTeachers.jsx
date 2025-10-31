import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminTeachers() {
  const { division } = useParams(); // "middle" | "elementary"
  const nav = useNavigate();
  const [items, setItems] = useState([]);   // 선생님 배열
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("samboh-auth");
    if (!token) nav("/");
  }, [nav]);

  useEffect(() => {
    setLoading(true);
    const url =
      division === "elementary"
        ? "/data/teachers-elementary.json"
        : "/data/teachers-middle.json";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [division]);

  const title = division === "elementary" ? "초등 선생님 목록" : "중등 선생님 목록";
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => String(a).localeCompare(String(b), "ko"));
  }, [items]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>nav("/admin")} style={st.backBtn}>←</button>
          <strong>{title}</strong>
        </div>
        <a href="/" style={st.link}>로그아웃</a>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          {loading ? (
            <p>불러오는 중…</p>
          ) : sorted.length === 0 ? (
            <p>선생님 데이터가 없습니다.</p>
          ) : (
            <div style={st.list}>
              {sorted.map((name) => (
                <button
                  key={name}
                  style={st.item}
                  onClick={() =>
                    nav(`/admin/${division}/${encodeURIComponent(name)}`)
                  }
                >
                  {name}
                </button>
              ))}
            </div>
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
  main: { width:"min(900px,94vw)", margin:"24px auto" },
  card: { background:"linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
    border:"1px solid rgba(255,255,255,.12)", borderRadius:16, padding:18,
    boxShadow:"0 10px 30px rgba(2,6,23,.35)" },
  list: { display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:10, marginTop:8 },
  item: { border:0, borderRadius:12, padding:"12px 14px",
    background:"#0b3f9d", color:"#fff", cursor:"pointer",
    textAlign:"left", fontWeight:700, boxShadow:"0 8px 20px rgba(0,0,0,.15)" },
  backBtn: { border:0, borderRadius:8, padding:"6px 10px", cursor:"pointer",
    background:"#fff", color:"#0b1220", fontWeight:700 }
};
