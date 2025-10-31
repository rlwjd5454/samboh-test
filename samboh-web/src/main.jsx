import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 페이지들
import App from "./App.jsx";                                // 로그인
import AdminHome from "./pages/AdminHome.jsx";              // 학제 선택(중등/초등)
import AdminTeachers from "./pages/AdminTeachers.jsx";      // 구분별 선생님 목록
import AdminTeacherClasses from "./pages/AdminTeacherClasses.jsx";        // 담임의 반 목록
import AdminTeacherClassStudents from "./pages/AdminTeacherClassStudents.jsx"; // 반의 학생 목록

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/admin", element: <AdminHome /> },
  { path: "/admin/:division", element: <AdminTeachers /> }, // middle | elementary
  { path: "/admin/:division/:teacher", element: <AdminTeacherClasses /> },
  {
    path: "/admin/:division/:teacher/class/:classname",
    element: <AdminTeacherClassStudents />,
  },
  {
    path: "*",
    element: (
      <div
        style={{
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background: "#0E5FD7",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0 }}>404</h1>
          <p>페이지를 찾을 수 없습니다.</p>
          <a href="/" style={{ color: "#fff", textDecoration: "underline" }}>
            홈으로
          </a>
        </div>
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
