import {
  LayoutDashboard,
  BookOpen,
  DollarSign,
  MessageSquare,
  TicketIcon,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const ParentLayout = () => {
  const { user } = useAuth();
  const { threads, tickets } = useData();
  
  const unreadCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);
  const openTicketsCount = tickets.filter(
    (t) => t.createdBy === user?.id && (t.status === "Open" || t.status === "In Progress")
  ).length;

  const menuItems = [
    { id: "overview", path: "/parent/dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "progress", path: "/parent/dashboard/progress", label: "Student Progress", icon: BookOpen },
    { id: "attendance", path: "/parent/dashboard/attendance", label: "Attendance", icon: Calendar },
    { id: "fees", path: "/parent/dashboard/fees", label: "Fees", icon: DollarSign },
    { id: "chat", path: "/parent/dashboard/chat", label: "Chat", icon: MessageSquare, badge: unreadCount },
    { id: "support", path: "/parent/dashboard/support", label: "Support", icon: TicketIcon, badge: openTicketsCount }
  ];

  const sidebarFooter = (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-4">
      <p className="text-xs text-slate-600 font-medium mb-1">Viewing Profile</p>
      <p className="text-sm font-bold text-slate-900">Ravi Kumar</p>
      <p className="text-xs text-slate-600 mb-2">Class 10 - Section A</p>
      <button className="text-xs text-blue-600 font-medium hover:text-blue-700">
        Switch Student →
      </button>
    </div>
  );

  return (
    <DashboardShell 
      menuItems={menuItems} 
      roleName="Parent Portal" 
      sidebarFooter={sidebarFooter}
    />
  );
};

