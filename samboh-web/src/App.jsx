import { Routes, Route, Navigate } from "react-router-dom";

// 초기 화면(로그인) – 로고/관리자ID 포함 버전이 이미 존재함
import Login from "./pages/Login";

// 관리자 영역
import AdminHome from "./pages/AdminHome";
import Admin from "./pages/Admin";
import AdminTeachers from "./pages/AdminTeachers";
import AdminTeacherClasses from "./pages/AdminTeacherClasses";
import AdminTeacherStudents from "./pages/AdminTeacherStudents";

// 교사/학부모 포털
import Teacher from "./pages/Teacher";
import Parent from "./pages/Parent";

// 학생 개별 상세
import StudentDetail from "./pages/StudentDetail";

/**
 * 라우팅 복구/정리
 * - 초기 진입: 로그인 화면 유지
 * - 관리자 대시보드/교사/학부모/학생 상세 등 기존 페이지 경로 복원
 * - 정의되지 않은 경로는 /login 으로
 */
export default function App() {
  return (
    <Routes>
      {/* 초기화면 & 로그인 */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* 관리자 홈/대시보드 */}
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/scores" element={<Admin />} />

      {/* 관리자 - 선생님/반/학생 뷰 (division: middle | elementary) */}
      <Route path="/admin/:division/teachers" element={<AdminTeachers />} />
      <Route
        path="/admin/:division/teacher/:teacher/classes"
        element={<AdminTeacherClasses />}
      />
      <Route
        path="/admin/:division/teacher/:teacher/students"
        element={<AdminTeacherStudents />}
      />

      {/* 교사/학부모 포털 (향후 확장용) */}
      <Route path="/teacher" element={<Teacher />} />
      <Route path="/parent" element={<Parent />} />

      {/* 학생 개별 상세 페이지 */}
      <Route path="/student/:id" element={<StudentDetail />} />

      {/* 잘못된 경로 → 로그인 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
