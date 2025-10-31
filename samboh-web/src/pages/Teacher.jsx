export default function Teacher() {
  return (
    <div style={{
      minHeight:"100svh", display:"grid", placeItems:"center",
      background:"#0E5FD7", color:"#fff"
    }}>
      <div style={{textAlign:"center"}}>
        <h1 style={{margin:0}}>담임 대시보드</h1>
        <p>차후 담임반 학생 목록/성적만 보이도록 연결 예정</p>
        <a href="/" style={{color:"#fff", textDecoration:"underline"}}>홈으로</a>
      </div>
    </div>
  );
}
