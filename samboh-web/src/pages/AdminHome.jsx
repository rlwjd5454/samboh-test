import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const nav = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("samboh-auth");
    if (!token) nav("/");
  }, [nav]);

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="/samboh-logo.jpg" alt="samboh" style={{width:44,height:44,objectFit:"contain"}} onError={(e)=>e.currentTarget.style.display="none"} />
          <strong>Samboh 관리자</strong>
        </div>
        <a href="/" style={st.link}>로그아웃</a>
      </header>

      <main style={st.main}>
        <section style={st.card}>
          <h2 style={{marginTop:0,marginBottom:14}}>학년 선택</h2>
          <p style={{marginTop:0,opacity:.9}}>조회 항목을 선택하세요.</p>

          <div style={st.grid}>
            {/* ✅ 중등 전체 성적 바로가기 */}
            <button style={st.tile} onClick={()=>nav("/admin/middle/2508-list")}>
              <div style={st.tileTitle}>중등 전체 성적(2508)</div>
              <div style={st.tileDesc}>기준일 적용 · 재원생 기본 노출</div>
            </button>

            {/* 담임/반 탐색 플로우 */}
            <button style={st.tile} onClick={()=>nav("/admin/middle")}>
              <div style={st.tileTitle}>중등 담임별</div>
              <div style={st.tileDesc}>담임 → 반 → 학생</div>
            </button>

            <button style={st.tile} onClick={()=>nav("/admin/elementary")}>
              <div style={st.tileTitle}>초등</div>
              <div style={st.tileDesc}>G/R(Grammar/Reading)</div>
            </button>
          </div>
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
  grid: { display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:14, marginTop:10 },
  tile: { border:0, borderRadius:14, padding:"18px 16px", textAlign:"left",
    background:"#0b3f9d", color:"#fff", cursor:"pointer",
    boxShadow:"0 10px 24px rgba(0,0,0,.15)" },
  tileTitle: { fontSize:18, fontWeight:800, marginBottom:6 },
  tileDesc: { opacity:.95, fontSize:13 }
};
