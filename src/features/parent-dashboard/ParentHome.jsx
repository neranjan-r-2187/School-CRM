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

export const ParentHome = ({ data }) => {
  const { threads } = useData();

  if (!data) return <div className="py-20 text-center text-slate-400">Select a student to view overview</div>;

  const { attendance = [], grades = [], fees = [], announcements = [] } = data;

  const totalAttendance = attendance.length;
  const presentAttendance = attendance.filter(a => a.status === "present").length;
  const attendancePercentage = totalAttendance > 0 
    ? ((presentAttendance / totalAttendance) * 100).toFixed(1) + "%"
    : "N/A";

  const pendingFees = fees.filter(f => f.status !== "Paid");
  const totalPendingAmount = pendingFees.reduce((acc, f) => acc + (f.amount || 0), 0);

  const recentGrades = grades.slice(0, 5).map(g => ({
    subject: g.subject?.name || "Subject",
    score: g.marksObtained,
    month: new Date(g.createdAt).toLocaleString('default', { month: 'short' })
  }));

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
          <p className="text-3xl font-bold text-slate-900">{attendancePercentage}</p>
          <p className="text-xs text-slate-500 mt-1">{totalAttendance} Total Days</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Performance</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{grades[0]?.grade || "N/A"}</p>
          <p className="text-xs text-slate-500 mt-1">Latest Evaluation</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Pending Fees</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{totalPendingAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">{pendingFees.length} Pending Invoices</p>
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
              <LineChart data={recentGrades.length > 0 ? recentGrades : progressData}>
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
            {announcements.length > 0 ? announcements.slice(0, 3).map((ann, idx) => (
              <div key={ann._id || idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{ann.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{ann.content.slice(0, 100)}...</p>
                    <p className="text-xs text-indigo-600 mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-400 italic">No recent announcements</div>
            )}
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
          {fees.length > 0 ? fees.slice(0, 5).map((fee) => (
            <div key={fee._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{fee.title || fee.type}</p>
                <p className="text-sm text-slate-500 mt-1">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-slate-900">₹{fee.amount.toLocaleString()}</p>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${fee.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {fee.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center text-slate-400 italic">No fee records found</div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
