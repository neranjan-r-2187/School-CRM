import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle } from "../../components/ui/Card";
import { useParentStudentData } from "./hooks/useParentData";

export const ParentProgress = () => {
  const { linkedStudents, selectedStudentId, setSelectedStudentId, studentData, isLoading } = useParentStudentData();

  if (isLoading || !selectedStudentId) return <div className="py-20 text-center text-slate-400">Loading student data...</div>;

  const grades = studentData.grades || [];
  
  // Prepare chart data
  const progressData = grades.slice(0, 10).map(g => ({
    subject: g.subject?.name || "Subject",
    score: g.marksObtained || g.score || 0,
    month: new Date(g.createdAt).toLocaleString('default', { month: 'short' })
  })).reverse();

  // Aggregate by subject for strengths
  const subjectScores = {};
  grades.forEach(g => {
    const sub = g.subject?.name || "Subject";
    if (!subjectScores[sub]) subjectScores[sub] = [];
    subjectScores[sub].push(g.marksObtained || g.score || 0);
  });

  const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
    subject,
    average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })).sort((a, b) => b.average - a.average);

  const strengths = subjectAverages.slice(0, 3).filter(s => s.average >= 75);
  const areasToImprove = subjectAverages.filter(s => s.average < 75).slice(0, 3);

  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Progress</h1>
          <p className="text-slate-500 mt-1">Academic performance and growth tracking</p>
        </div>
        
        {linkedStudents.length > 1 && (
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            {linkedStudents.map(student => (
              <option key={student._id} value={student._id}>
                {student.user?.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <Card>
        <CardTitle className="mb-6">Performance Trend</CardTitle>
        <div className="h-80">
          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">Not enough data for chart</div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Subject-wise Performance</CardTitle>
          <div className="space-y-4">
            {subjectAverages.length > 0 ? subjectAverages.map(({ subject, average }) => (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{subject}</span>
                    <span className="text-sm font-bold text-blue-600">{average}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${average}%` }}
                    />
                  </div>
                </div>
            )) : <p className="text-sm text-slate-500 italic">No grades available</p>}
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Strengths & Areas of Improvement</CardTitle>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-2">Strengths</p>
              <ul className="text-sm text-green-700 space-y-1">
                {strengths.length > 0 ? strengths.map(s => (
                  <li key={s.subject}>• Excellent performance in {s.subject}</li>
                )) : <li>• Keep working hard!</li>}
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm font-semibold text-orange-800 mb-2">Areas to Improve</p>
              <ul className="text-sm text-orange-700 space-y-1">
                {areasToImprove.length > 0 ? areasToImprove.map(s => (
                  <li key={s.subject}>• Focus on improving {s.subject} concepts</li>
                )) : <li>• No critical areas detected currently.</li>}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
