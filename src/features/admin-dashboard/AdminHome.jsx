import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Award,
  Activity,
  Layers,
  TicketIcon,
  Loader2
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/Table";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export const AdminHome = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Fetch real dashboard data
  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    }
  });

  const stats = [
    { label: "Total Students", value: dashboardData?.totalStudents || "0", change: "Sync Active", trend: "up", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
    { label: "Total Teachers", value: dashboardData?.totalTeachers || "0", change: "Faculty Node", trend: "up", icon: Users, color: "text-teal-600 bg-teal-50" },
    { label: "Active Classes", value: dashboardData?.totalClasses || "0", change: "Live Sections", trend: "neutral", icon: BookOpen, color: "text-purple-600 bg-purple-50" },
    { label: "Course Catalog", value: dashboardData?.totalSubjects || "0", change: "Subjects", trend: "up", icon: Layers, color: "text-green-600 bg-green-50" }
  ];

  const quickStats = [
    { label: "Institutional Load", value: "94.2%", icon: Activity, color: "bg-green-500" },
    { label: "Open Tickets", value: dashboardData?.openTickets || "0", icon: TicketIcon, color: "bg-red-500" },
    { label: "Sync Status", value: "Optimal", icon: CheckCircle2, color: "bg-blue-500" }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Aggregating institutional metrics...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Institutional Hub
          </h2>
          <p className="text-slate-500 font-medium mt-1">Holistic synchronization of school operations & metrics</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-200/60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest leading-none mb-3">{stat.label}</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${stat.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card className="p-8 lg:col-span-2 border-slate-200/60 shadow-sm rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Recent System Pulse
            </h2>
            <Badge variant="primary" className="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">LIVE SYNC</Badge>
          </div>
          <div className="space-y-6">
            {dashboardData?.activities?.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-all group">
                <div className={`w-12 h-12 ${activity.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Activity className={`w-6 h-6 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{activity.msg}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{format(new Date(activity.time), "MMM dd, HH:mm")}</p>
                </div>
              </div>
            ))}
            {(!dashboardData?.activities || dashboardData.activities.length === 0) && (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">Waiting for system logs...</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Performance Summary */}
        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-[2.5rem] shadow-2xl border-none relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10">
              <Star className="w-10 h-10 text-yellow-400 mb-4 animate-bounce" />
              <h3 className="text-xl font-black mb-2">Institutional Health</h3>
              <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">System-wide performance metrics are operating within optimal parameters for this session.</p>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.slice(0, 2).map((stat, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-lg font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-8 border-slate-200/60 shadow-sm rounded-[2.5rem]">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Upcoming Deadlines
            </h2>
            <div className="space-y-4 text-sm font-medium text-slate-500">
              <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                <span>Fee Collection End</span>
                <span className="font-bold text-slate-900">2 days left</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                <span>Exam Prep Review</span>
                <span className="font-bold text-slate-900">5 days left</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { Star } from "lucide-react";
