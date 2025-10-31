import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sambohLogo from "/samboh-logo.jpg";

/**
 * Samboh 로그인 페이지
 * - 로고 포함
 * - 식별번호 + 학부모번호 + 관리자ID 입력
 * - 관리자 계정이면 관리자 페이지로, 일반 사용자는 성적 페이지로 이동
 */
export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!studentId || !phone) {
      setError("식별번호와 휴대폰 번호를 모두 입력하세요.");
      return;
    }

    // 관리자 로그인 처리
    if (adminId.trim().toLowerCase() === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    // 일반 로그인 처리 (예시)
    if (studentId.length >= 8 && phone.startsWith("010")) {
      navigate(`/student/${studentId}`);
    } else {
      setError("입력 정보를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-6">
        {/* 로고 */}
        <div className="flex justify-center mb-6">
          <img
            src={sambohLogo}
            alt="Samboh Logo"
            className="h-16 w-auto select-none"
          />
        </div>

        <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Samboh 성적조회 로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">식별번호</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 2308-0077"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              학부모 휴대폰 번호
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 01012345678"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              관리자 ID (선택)
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="관리자만 입력"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            로그인
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          © 2025 Samboh Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
