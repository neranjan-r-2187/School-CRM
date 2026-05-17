import { useStudentGrades } from "./hooks/useStudentData";
import { Loader2 } from "lucide-react";

export const StudentGrades = () => {
  const { data: grades, isLoading, isError } = useStudentGrades();

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  if (isError) return <div className="text-center text-red-500 py-10">Failed to load grades.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Academic Performance</h1>
        <p className="text-slate-500">Your grades and performance overview</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Subject</th>
                <th className="text-left p-4 font-semibold text-slate-700">Exam</th>
                <th className="text-center p-4 font-semibold text-slate-700">Marks Obtained</th>
                <th className="text-center p-4 font-semibold text-slate-700">Total Marks</th>
                <th className="text-center p-4 font-semibold text-slate-700">Percentage</th>
                <th className="text-center p-4 font-semibold text-slate-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades && grades.length > 0 ? grades.map((grade, index) => {
                const marks = grade.marksObtained !== undefined ? grade.marksObtained : (grade.score !== undefined ? grade.score : 0);
                const total = grade.totalMarks !== undefined ? grade.totalMarks : (grade.maxScore !== undefined ? grade.maxScore : 100);
                const percentage = total > 0 ? (marks / total) * 100 : 0;
                return (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{grade.subject?.name || grade.subject}</td>
                    <td className="p-4 text-slate-700">{grade.exam || "Term Exam"}</td>
                    <td className="p-4 text-center text-slate-700">{marks}</td>
                    <td className="p-4 text-center text-slate-700">{total}</td>
                    <td className="p-4 text-center">
                      <span className={`font-semibold ${
                        percentage >= 90 ? "text-green-600" : 
                        percentage >= 75 ? "text-blue-600" : 
                        percentage >= 60 ? "text-orange-600" : "text-red-600"
                      }`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">
                      {grade.grade}
                    </span>
                  </td>
                </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No grades available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
