import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardTitle } from "../../components/ui/Card";

const progressData = [
  { subject: "Math", score: 85, month: "Jan" },
  { subject: "Math", score: 88, month: "Feb" },
  { subject: "Math", score: 92, month: "Mar" },
  { subject: "Math", score: 90, month: "Apr" },
  { subject: "Math", score: 95, month: "May" }
];

export const ParentProgress = () => {
  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Progress</h1>
        <p className="text-slate-500 mt-1">Academic performance and growth tracking</p>
      </div>

      <Card>
        <CardTitle className="mb-6">Performance Trend</CardTitle>
        <div className="h-80">
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
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Subject-wise Performance</CardTitle>
          <div className="space-y-4">
            {["Mathematics", "Science", "English", "Hindi", "Social Studies"].map((subject, index) => {
              const scores = [88, 92, 85, 90, 87];
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{subject}</span>
                    <span className="text-sm font-bold text-blue-600">{scores[index]}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${scores[index]}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Strengths & Areas of Improvement</CardTitle>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-2">Strengths</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Excellent problem-solving skills in Mathematics</li>
                <li>• Strong analytical thinking</li>
                <li>• Good presentation skills</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm font-semibold text-orange-800 mb-2">Areas to Improve</p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Focus on Hindi grammar concepts</li>
                <li>• Practice more English essays</li>
                <li>• Improve time management during exams</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
