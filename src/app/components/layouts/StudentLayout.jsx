import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Award,
  UserCheck,
  HelpCircle,
  TrendingUp,
  Target,
  MessageSquare,
  TicketIcon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const StudentLayout = () => {
  const { user } = useAuth();
  const { tickets } = useData();
  
  const openTicketsCount = tickets.filter(
    (t) => t.createdBy === user?.id && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const menuItems = [
    { id: "home", path: "/student/dashboard", label: "Home", icon: LayoutDashboard },
    { id: "timetable", path: "/student/dashboard/timetable", label: "Timetable", icon: Calendar },
    { id: "grades", path: "/student/dashboard/grades", label: "Grades", icon: Award },
    { id: "assignments", path: "/student/dashboard/assignments", label: "Assignments", icon: ClipboardList },
    { id: "attendance", path: "/student/dashboard/attendance", label: "Attendance", icon: UserCheck },
    { id: "doubts", path: "/student/dashboard/doubts", label: "Doubts", icon: HelpCircle },
    { id: "career", path: "/student/dashboard/career", label: "Career", icon: Target },
    { id: "completions", path: "/student/dashboard/completions", label: "Completions", icon: TrendingUp },
    { id: "chat", path: "/student/dashboard/chat", label: "Chat", icon: MessageSquare },
    { id: "support", path: "/student/dashboard/support", label: "Support", icon: TicketIcon, badge: openTicketsCount }
  ];

  return <DashboardShell menuItems={menuItems} roleName="Student Portal" />;
};

