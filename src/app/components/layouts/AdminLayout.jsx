import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  TicketIcon,
  GraduationCap,
  Book,
  MessageSquare,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const AdminLayout = () => {
  const { tickets } = useData();
  const openTicketsCount = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;

  const menuItems = [
    { id: "dashboard", path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", path: "/admin/dashboard/users", label: "User Management", icon: Users },
    { id: "students", path: "/admin/dashboard/students", label: "Students", icon: GraduationCap },
    { id: "teachers", path: "/admin/dashboard/teachers", label: "Teachers", icon: Users },
    { id: "classes", path: "/admin/dashboard/classes", label: "Classes", icon: Book },
    { id: "fees", path: "/admin/dashboard/fees", label: "Fees & Payments", icon: DollarSign },
    { id: "reports", path: "/admin/dashboard/reports", label: "Reports", icon: BarChart3 },
    { id: "tickets", path: "/admin/dashboard/tickets", label: "Support Tickets", icon: TicketIcon, badge: openTicketsCount },
    { id: "chat", path: "/admin/dashboard/chat", label: "Messages", icon: MessageSquare },
    { id: "settings", path: "/admin/dashboard/settings", label: "Settings", icon: Settings }
  ];

  return <DashboardShell menuItems={menuItems} roleName="Admin Portal" />;
};

