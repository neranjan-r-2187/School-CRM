import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  FileText,
  Award
} from "lucide-react";
import { DashboardShell } from "../../../components/layouts/DashboardShell";

export const TeacherLayout = () => {
  const menuItems = [
    { id: "overview", path: "/teacher/dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "classes", path: "/teacher/dashboard/classes", label: "My Classes", icon: BookOpen },
    { id: "attendance", path: "/teacher/dashboard/attendance", label: "Attendance", icon: UserCheck },
    { id: "assignments", path: "/teacher/dashboard/assignments", label: "Assignments", icon: FileText },
    { id: "grades", path: "/teacher/dashboard/grades", label: "Grades", icon: Award }
  ];

  return <DashboardShell menuItems={menuItems} roleName="Staff Portal" />;
};
