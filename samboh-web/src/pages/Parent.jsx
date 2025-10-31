export default function Parent() {
  return (
    <div style={{
      minHeight:"100svh", display:"grid", placeItems:"center",
      background:"#0E5FD7", color:"#fff"
    }}>
      <div style={{textAlign:"center"}}>
        <h1 style={{margin:0}}>학부모 포털</h1>
        <p>차후 식별번호로 본인 자녀 1명 성적만 조회 예정</p>
        <a href="/" style={{color:"#fff", textDecoration:"underline"}}>홈으로</a>
      </div>
    </div>
  );
}
