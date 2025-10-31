import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_ID = "samboh";
const ADMIN_PW = "5623630";

export default function App() {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!id.trim()) return setError("아이디/식별번호를 입력하세요.");
    if (!pw.trim()) return setError("비밀번호를 입력하세요.");

    // 1단계: 관리자만 허용 (데모)
    if (id.trim() === ADMIN_ID && pw === ADMIN_PW) {
      sessionStorage.setItem("samboh-auth", JSON.stringify({ role: "admin" }));
      nav("/admin");
      return;
    }

    // 이후 확장: 담임/학부모 분기는 여기에 추가
    setError("아이디(식별번호) 또는 비밀번호가 올바르지 않습니다.");
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <header style={styles.header}>
          <img
            src="/samboh-logo.jpg"
            alt="samboh 로고"
            style={styles.logo}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h1 style={styles.title}>samboh 과정평가 성적조회</h1>
          <p style={styles.subtitle}>관리자/담임/학부모 통합 로그인 (데모: 관리자만 동작)</p>
        </header>

        <section style={styles.card}>
          <form onSubmit={onSubmit} style={styles.form}>
            <div style={{ width: "100%" }}>
              <label htmlFor="loginId" style={styles.label}>아이디/식별번호</label>
              <input
                id="loginId"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={styles.input}
                autoComplete="username"
              />
            </div>

            <div style={{ width: "100%" }}>
              <label htmlFor="password" style={styles.label}>비밀번호</label>
              <input
                id="password"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.button}>로그인</button>
          </form>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    display: "grid",
    placeItems: "center",
    background: "#0E5FD7",
    color: "#e5e7eb",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Helvetica, Arial',
    padding: 24,
  },
  main: { width: "min(720px, 92vw)" },
  header: { display: "grid", placeItems: "center", gap: 8, marginBottom: 18 },
  logo: { width: 160, height: 160, objectFit: "contain", display: "block" },
  title: { margin: 0, fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center" },
  subtitle: { margin: 0, opacity: 0.95, fontSize: 13, color: "#EAF1FF", textAlign: "center" },

  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
    border: "1px solid rgba(255,255,255,.09)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 36px rgba(2,6,23,.45)",
    maxWidth: "320px",
    margin: "12px auto 0",
    width: "100%",
  },
  form: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  label: { display: "block", fontSize: 12, color: "#EAF1FF", marginBottom: 6 },
  input: {
    width: "85%", padding: "10px 12px", borderRadius: 10,
    border: "1px solid #20304e", background: "rgba(7,19,48,.35)",
    color: "#f8fafc", outline: "none", display: "block", margin: "0 auto", textAlign: "center",
  },
  error: {
    fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,.12)",
    border: "1px solid rgba(239,68,68,.35)", padding: "9px 10px", borderRadius: 8,
    width: "85%", textAlign: "center",
  },
  button: {
    appearance: "none", border: 0, borderRadius: 10, padding: "8px 10px",
    fontWeight: 700, fontSize: "14px", width: "85%", color: "#0b1220",
    background: "#FFFFFF", cursor: "pointer", display: "block", margin: "0 auto",
  },
};
