import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  TicketIcon,
  Bell,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Settings
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationCenter } from "../NotificationCenter";
import { useData } from "../../context/DataContext";
export const StaffLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { tickets } = useData();
  const openTicketsCount = tickets.filter(
    (t) => t.createdBy === user?.id && (t.status === "Open" || t.status === "In Progress")
  ).length;
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "students", label: "Students", icon: GraduationCap, path: "/students" },
    { id: "admissions", label: "Admissions", icon: Users, path: "/admissions" },
    { id: "academics", label: "Academics", icon: BookOpen, path: "/academics" },
    { id: "attendance", label: "Attendance", icon: Calendar, path: "/attendance" },
    { id: "fees", label: "Fees & Payments", icon: FileText, path: "/fees" },
    { id: "communications", label: "Communications", icon: MessageSquare, path: "/communications" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "support", label: "Support", icon: TicketIcon, path: "/support", badge: openTicketsCount },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" }
  ];
  const handleMenuClick = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };
  const activeItem = menuItems.find((item) => location.pathname === item.path);
  return <div className="flex min-h-screen bg-slate-50">
      {
    /* Sidebar */
  }
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex flex-col h-full">
          {
    /* Logo */
  }
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">EduMaster</h2>
                <p className="text-xs text-slate-500">Staff Portal</p>
              </div>
            </div>
            <button
    onClick={() => setSidebarOpen(false)}
    className="lg:hidden p-1 hover:bg-slate-100 rounded-lg"
  >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {
    /* Navigation */
  }
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return <button
      key={item.id}
      onClick={() => handleMenuClick(item.path)}
      className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                    `}
    >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== void 0 && item.badge > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                        {item.badge}
                      </span>}
                  </button>;
  })}
            </div>
          </nav>

          {
    /* User Profile */
  }
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button
    onClick={handleLogout}
    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
    title="Logout"
  >
                <LogOut className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {
    /* Main Content */
  }
      <div className="flex-1 flex flex-col min-w-0">
        {
    /* Top Bar */
  }
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
    onClick={() => setSidebarOpen(true)}
    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
  >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {activeItem?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
  >
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {
    /* Content Area */
  }
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {
    /* Sidebar Overlay */
  }
      {sidebarOpen && <div
    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />}

      {
    /* Notification Center */
  }
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>;
};
