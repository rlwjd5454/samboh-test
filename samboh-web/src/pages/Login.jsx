import React, { useState } from "react";
import logo from "/samboh-logo.jpg"; // public 폴더에 samboh-logo.jpg 필수

/**
 * 안정 버전 로그인 화면 (화이트스크린 예방)
 * - 특수 Tailwind 임의 속성 제거, 단순 그라디언트만 사용
 * - 로고/카드/입력창 모두 중앙 배치
 * - 관리자 더미: ID samboh / PW 5623630
 */
export default function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_ID = "samboh";
  const ADMIN_PW = "5623630";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedId = id.trim();
    const trimmedPw = pw.trim();
    if (!trimmedId || !trimmedPw) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    if (trimmedId === ADMIN_ID && trimmedPw === ADMIN_PW) {
      localStorage.setItem("samboh_role", "admin");
      window.location.href = "/admin";
      return;
    }

    const isStudentId = /^(\d{4}-\d{4}|\d{8})$/.test(trimmedId);
    if (isStudentId) {
      localStorage.setItem("samboh_role", "student");
      localStorage.setItem("samboh_sid", trimmedId);
      window.location.href = "/student";
      return;
    }

    setError("로그인 정보를 확인해 주세요.");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 중앙 레이아웃 */}
      <div className="mx-auto flex min-h-screen max-w-[1100px] items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          {/* 로고/타이틀 */}
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={logo} alt="Samboh Logo" className="h-16 w-16 rounded-full border border-white/20 shadow" />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Samboh Portal</h1>
            <p className="mt-1 text-sm text-slate-300">성적 조회 및 관리자 콘솔 로그인</p>
          </div>

          {/* 로그인 카드 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-id" className="mb-1 block text-sm font-medium text-slate-200">아이디</label>
                <input
                  id="login-id"
                  name="id"
                  autoComplete="username"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="관리자: samboh / 학생: 식별번호(예: 2505-0123)"
                  className="block w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="login-pw" className="mb-1 block text-sm font-medium text-slate-200">비밀번호</label>
                <div className="relative">
                  <input
                    id="login-pw"
                    name="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="관리자: 5623630 / 학생은 휴대폰 뒤 4자리 등"
                    className="block w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute inset-y-0 right-2 my-auto inline-flex h-9 items-center rounded-lg px-3 text-xs text-slate-300 hover:bg-white/10"
                    aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
                  >
                    {showPw ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500/90 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                로그인
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>문제가 있나요? 관리자에게 문의하세요.</span>
                <a href="mailto:help@samboh.kr" className="underline-offset-2 hover:underline">help@samboh.kr</a>
              </div>
            </form>

            <div className="mt-5 space-y-1 text-xs text-slate-400">
              <p>• 관리자 로그인: <span className="font-semibold text-slate-200">ID</span> samboh / <span className="font-semibold text-slate-200">PW</span> 5623630</p>
              <p>• 학생/학부모 로그인: 식별번호 + 임시 비밀번호(예: 휴대폰 뒤 4자리)</p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">© {new Date().getFullYear()} Samboh Academy</p>
        </div>
      </div>
    </div>
  );
}
