import { UserCheck, FileText, Award, MessageSquare, Bell, Star, AlertCircle, ChevronRight, Clock, Plus, Users } from "lucide-react";
import { Card, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../app/context/AuthContext";
import { useTeacherDashboard } from "./hooks/useTeacherData";
import { AsyncWrapper } from "../../components/ui/AsyncWrapper";
import { DashboardSkeleton } from "../../components/ui/skeletons/DashboardSkeleton";
import { useNavigate } from "react-router-dom";

const todaySchedule = [
  {
    time: "09:00 - 10:00 AM",
    subject: "Physics",
    class: "Class 10-A",
    room: "Room 301",
    topic: "Newton's Laws of Motion",
    status: "completed"
  },
  {
    time: "10:15 - 11:15 AM",
    subject: "Physics",
    class: "Class 10-B",
    room: "Room 301",
    topic: "Force and Momentum",
    status: "ongoing"
  },
  {
    time: "11:30 - 12:30 PM",
    subject: "Chemistry",
    class: "Class 11-A",
    room: "Lab 2",
    topic: "Chemical Bonding",
    status: "upcoming"
  },
  {
    time: "02:00 - 03:00 PM",
    subject: "Chemistry",
    class: "Class 11-B",
    room: "Lab 2",
    topic: "Acids and Bases",
    status: "upcoming"
  }
];

const recentActivities = [
  { id: "1", type: "attendance", message: "Marked attendance for Class 10-A - 40/42 present", time: "30 min ago", icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
  { id: "2", type: "assignment", message: "28 students submitted Physics Lab Report", time: "1 hour ago", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
  { id: "3", type: "grade", message: "Graded Chemistry Quiz for Class 11-A", time: "2 hours ago", icon: Award, color: "text-purple-600", bg: "bg-purple-100" },
  { id: "4", type: "meeting", message: "Parent-teacher meeting with student's parents", time: "3 hours ago", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-100" },
  { id: "5", type: "announcement", message: "Posted announcement about Science Fair on Feb 15", time: "5 hours ago", icon: Bell, color: "text-indigo-600", bg: "bg-indigo-100" }
];

export const TeacherHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useTeacherDashboard();

  const dashboardStats = [
    { label: "Assigned Classes", value: stats?.totalClasses || "0", change: "Current session", icon: UserCheck, color: "bg-blue-500" },
    { label: "My Students", value: stats?.totalAssignedStudents || "0", change: "Linked accounts", icon: Users, color: "bg-indigo-500" },
    { label: "Active Assignments", value: stats?.activeAssignments || "0", change: "Due this week", icon: FileText, color: "bg-green-500" },
    { label: "Pending Attendance", value: stats?.pendingAttendance || "0", change: "Action required", icon: Clock, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Staff Portal</h1>
              <p className="text-blue-100 text-sm">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-blue-100">Identity ID</p>
                <p className="text-sm font-semibold">{user?._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white/30 text-white">
                {user?.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
          </div>

          <AsyncWrapper 
            isLoading={isLoading} 
            isError={isError}
            loadingFallback={<div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white/10 rounded-xl" />)}
            </div>}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {dashboardStats.map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-blue-100">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AsyncWrapper>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <CardTitle className="mb-4">Quick Actions</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate("/teacher/dashboard/attendance")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Mark Attendance</span>
          </button>
          <button 
            onClick={() => navigate("/teacher/dashboard/assignments")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Create Assignment</span>
          </button>
          <button 
            onClick={() => navigate("/teacher/dashboard/grades")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Submit Grades</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50 transition-all">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">Send Announcement</span>
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Today's Schedule</CardTitle>
            <span className="text-sm text-slate-500">Scheduled Classes</span>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((cls, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-2 ${cls.status === "completed" ? "border-green-200 bg-green-50" : cls.status === "ongoing" ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cls.status === "completed" ? "bg-green-500" : cls.status === "ongoing" ? "bg-blue-500 animate-pulse" : "bg-slate-300"}`} />
                    <div>
                      <h3 className="font-semibold text-slate-900">{cls.subject}</h3>
                      <p className="text-sm text-slate-500">{cls.class} • {cls.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{cls.time}</p>
                    <Badge variant={cls.status === "completed" ? "success" : cls.status === "ongoing" ? "primary" : "default"}>
                      {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 ml-5">Topic: {cls.topic}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="mb-4">Recent Activity</CardTitle>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            View All Activity
          </button>
        </Card>
      </div>
    </div>
  );
};
