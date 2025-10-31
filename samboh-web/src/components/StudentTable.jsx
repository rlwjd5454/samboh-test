import { Link } from "react-router-dom";

/** 학생 목록 테이블: 이름 클릭 → /student/:id */
export default function StudentTable({ students = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-3 py-2">식별번호</th>
            <th className="px-3 py-2">이름</th>
            <th className="px-3 py-2">학교</th>
            <th className="px-3 py-2">학년</th>
            <th className="px-3 py-2">레벨</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 font-mono">{s.id}</td>
              <td className="px-3 py-2">
                <Link
                  to={`/student/${encodeURIComponent(s.id)}`}
                  className="text-blue-600 hover:underline"
                  title="학생 상세 페이지로 이동"
                >
                  {s.name}
                </Link>
              </td>
              <td className="px-3 py-2">{s.school ?? "-"}</td>
              <td className="px-3 py-2">{s.grade ?? "-"}</td>
              <td className="px-3 py-2">{s.level ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
