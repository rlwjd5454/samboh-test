import { Routes, Route, Navigate } from "react-router-dom";
import StudentDetail from "./pages/StudentDetail";
import StudentTable from "./components/StudentTable";

/**
 * 데모용 기본 학생 목록 화면
 * - 실제로는 기존 “반을 클릭하면 뜨는 화면” 컴포넌트가 따로 있을 거야.
 * - 지금은 StudentTable을 임시로 배치해서 링크 동작만 확인 가능하도록 함.
 * - 네 기존 구조가 있으면 이 파일에서 해당 컴포넌트로 바꿔 끼우면 됨.
 */
const DemoClassPage = () => {
  // 데모용 학생 목록 (id, name만 있어도 링크 동작)
  const students = [
    { id: "2308-0077", name: "김원진", level: "H3", school: "대원국제중", grade: 3 },
    { id: "2505-0042", name: "조혜영", level: "M4", school: "대치중", grade: 2 },
    { id: "0021-2406", name: "박민서", level: "P5", school: "대명중", grade: 1 },
  ];
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">반 학생 목록 (데모)</h1>
      <p className="text-sm text-gray-500 mb-4">
        실제 운영에서는 네가 쓰는 “반 화면” 컴포넌트에서 <b>학생 이름</b>을 클릭하면
        <code className="px-1 bg-gray-100 rounded">/student/:id</code>로 이동하도록
        처리하면 돼.
      </p>
      <StudentTable students={students} />
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/class/demo" replace />} />
      <Route path="/class/demo" element={<DemoClassPage />} />
      {/* 학생 전용 상세 페이지 */}
      <Route path="/student/:id" element={<StudentDetail />} />
      {/* 존재하지 않는 경로 */}
      <Route path="*" element={<Navigate to="/class/demo" replace />} />
    </Routes>
  );
}
