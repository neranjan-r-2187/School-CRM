import { useData } from "../../app/context/DataContext";

export const StudentGrades = () => {
  const { grades } = useData();

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
              {(grades || []).map((grade, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{grade.subject}</td>
                  <td className="p-4 text-slate-700">{grade.exam}</td>
                  <td className="p-4 text-center text-slate-700">{grade.marksObtained}</td>
                  <td className="p-4 text-center text-slate-700">{grade.totalMarks}</td>
                  <td className="p-4 text-center">
                    <span className={`font-semibold ${
                      grade.percentage >= 90 ? "text-green-600" : 
                      grade.percentage >= 75 ? "text-blue-600" : 
                      grade.percentage >= 60 ? "text-orange-600" : "text-red-600"
                    }`}>
                      {grade.percentage}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">
                      {grade.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
