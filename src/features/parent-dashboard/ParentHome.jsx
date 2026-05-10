import { motion } from "motion/react";
import { TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useData } from "../../app/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

const progressData = [
  { subject: "Math", score: 85, month: "Jan" },
  { subject: "Math", score: 88, month: "Feb" },
  { subject: "Math", score: 92, month: "Mar" },
  { subject: "Math", score: 90, month: "Apr" },
  { subject: "Math", score: 95, month: "May" }
];

const feesData = [
  { id: 1, title: "Tuition Fee - Term 2", amount: "₹12,000", date: "Due Mar 15", status: "Pending" },
  { id: 2, title: "Bus Fee - Feb", amount: "₹1,500", date: "Paid Feb 10", status: "Paid" },
  { id: 3, title: "Lab Fee", amount: "₹3,000", date: "Paid Jan 20", status: "Paid" }
];

const attendanceStats = {
  present: 145,
  absent: 3,
  late: 2,
  percentage: "96.6%"
};

export const ParentHome = () => {
  const { threads } = useData();

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Attendance</span>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{attendanceStats.percentage}</p>
          <p className="text-xs text-slate-500 mt-1">This month</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Overall Grade</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">A-</p>
          <p className="text-xs text-slate-500 mt-1">Average performance</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Pending Fees</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">₹12,000</p>
          <p className="text-xs text-slate-500 mt-1">Due Mar 15</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Unread Messages</span>
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">
              {threads.reduce((acc, t) => acc + t.unreadCount, 0)}
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{threads.reduce((acc, t) => acc + t.unreadCount, 0)}</p>
          <p className="text-xs text-slate-500 mt-1">From teachers</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Progress */}
        <Card>
          <CardTitle className="mb-4">Academic Progress</CardTitle>
          <div className="h-64">
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
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardTitle className="mb-4">Recent Announcements</CardTitle>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Parent-Teacher Meeting</p>
                  <p className="text-xs text-slate-600 mt-1">Scheduled for Feb 20, 2026 at 10:00 AM</p>
                  <p className="text-xs text-blue-600 mt-2">2 days from now</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Science Project Submission</p>
                  <p className="text-xs text-slate-600 mt-1">Your child has submitted the project ahead of time</p>
                  <p className="text-xs text-green-600 mt-2">Submitted on Feb 5</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Annual Day Celebration</p>
                  <p className="text-xs text-slate-600 mt-1">Mark your calendar for the grand event on March 10, 2026</p>
                  <p className="text-xs text-purple-600 mt-2">1 month away</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Fees Summary */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <CardTitle>Fee Payments</CardTitle>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {feesData.map((fee) => (
            <div key={fee.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{fee.title}</p>
                <p className="text-sm text-slate-500 mt-1">{fee.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-slate-900">{fee.amount}</p>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${fee.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {fee.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
