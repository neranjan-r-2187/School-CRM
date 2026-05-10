import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ParentLayout } from "../components/layouts/ParentLayout";
import { ChatInterface } from "./ChatInterface";
import { SupportTickets } from "./support/SupportTickets";
import { useData } from "../context/DataContext";
const progressData = [
  { subject: "Math", score: 85, month: "Jan" },
  { subject: "Math", score: 88, month: "Feb" },
  { subject: "Math", score: 92, month: "Mar" },
  { subject: "Math", score: 90, month: "Apr" },
  { subject: "Math", score: 95, month: "May" }
];
const feesData = [
  { id: 1, title: "Tuition Fee - Term 2", amount: "\u20B912,000", date: "Due Mar 15", status: "Pending" },
  { id: 2, title: "Bus Fee - Feb", amount: "\u20B91,500", date: "Paid Feb 10", status: "Paid" },
  { id: 3, title: "Lab Fee", amount: "\u20B93,000", date: "Paid Jan 20", status: "Paid" }
];
const attendanceStats = {
  present: 145,
  absent: 3,
  late: 2,
  percentage: "96.6%"
};
export const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { threads } = useData();
  const renderContent = () => {
    switch (activeTab) {
      case "progress":
        return renderProgressTab();
      case "attendance":
        return renderAttendanceTab();
      case "fees":
        return renderFeesTab();
      case "chat":
        return <ChatInterface />;
      case "support":
        return <SupportTickets />;
      default:
        return renderOverviewTab();
    }
  };
  const renderOverviewTab = () => <motion.div
    key="overview"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
      {
    /* Quick Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Attendance</span>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{attendanceStats.percentage}</p>
          <p className="text-xs text-slate-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Overall Grade</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">A-</p>
          <p className="text-xs text-slate-500 mt-1">Average performance</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Pending Fees</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">₹12,000</p>
          <p className="text-xs text-slate-500 mt-1">Due Mar 15</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 font-medium">Unread Messages</span>
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">
              {threads.reduce((acc, t) => acc + t.unreadCount, 0)}
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{threads.reduce((acc, t) => acc + t.unreadCount, 0)}</p>
          <p className="text-xs text-slate-500 mt-1">From teachers</p>
        </div>
      </div>

      {
    /* Progress Chart & Upcoming Events */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
    /* Academic Progress */
  }
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Academic Progress</h2>
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
        </div>

        {
    /* Recent Announcements */
  }
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Announcements</h2>
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
        </div>
      </div>

      {
    /* Fees Summary */
  }
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Fee Payments</h2>
          <button
    onClick={() => setActiveTab("fees")}
    className="text-sm text-blue-600 font-medium hover:underline"
  >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {feesData.map((fee) => <div key={fee.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
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
            </div>)}
        </div>
      </div>
    </motion.div>;
  const renderProgressTab = () => <motion.div
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

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Performance Trend</h2>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Subject-wise Performance</h3>
          <div className="space-y-4">
            {["Mathematics", "Science", "English", "Hindi", "Social Studies"].map((subject, index) => {
    const scores = [88, 92, 85, 90, 87];
    return <div key={subject}>
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
                </div>;
  })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Strengths & Areas of Improvement</h3>
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
        </div>
      </div>
    </motion.div>;
  const renderAttendanceTab = () => <motion.div
    key="attendance"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Record</h1>
        <p className="text-slate-500 mt-1">Monthly attendance tracking and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
            <p className="text-sm text-slate-500 mt-1">Days Present</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
            <p className="text-sm text-slate-500 mt-1">Days Absent</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{attendanceStats.late}</p>
            <p className="text-sm text-slate-500 mt-1">Times Late</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{attendanceStats.percentage}</p>
            <p className="text-sm text-slate-500 mt-1">Overall %</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Monthly Attendance Overview</h2>
        <div className="grid grid-cols-7 gap-2">
          {
    /* Calendar view would go here */
  }
          <p className="col-span-7 text-center text-slate-500 py-8">
            Calendar view with detailed daily attendance
          </p>
        </div>
      </div>
    </motion.div>;
  const renderFeesTab = () => <motion.div
    key="fees"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fee Payments</h1>
        <p className="text-slate-500 mt-1">Manage and track fee payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-2">Total Fees (Annual)</p>
          <p className="text-3xl font-bold text-slate-900">₹60,000</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-600">₹48,000</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-orange-600">₹12,000</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>
        <div className="space-y-3">
          {feesData.map((fee) => <div key={fee.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{fee.title}</p>
                <p className="text-sm text-slate-500 mt-1">{fee.date}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-lg font-bold text-slate-900">{fee.amount}</p>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium min-w-[80px] text-center ${fee.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {fee.status}
                </span>
                {fee.status === "Pending" && <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Pay Now
                  </button>}
              </div>
            </div>)}
        </div>
      </div>
    </motion.div>;
  return <ParentLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </ParentLayout>;
};
