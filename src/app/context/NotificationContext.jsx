import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
const NotificationContext = createContext(void 0);
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      type: "assignment",
      title: "New Assignment",
      message: "Math homework assigned for Chapter 5",
      timestamp: /* @__PURE__ */ new Date("2026-02-06T09:30:00"),
      read: false,
      actionUrl: "/student/dashboard?tab=assignments"
    },
    {
      id: "notif-2",
      type: "grade",
      title: "Grade Updated",
      message: "Your Physics test score is now available",
      timestamp: /* @__PURE__ */ new Date("2026-02-05T14:20:00"),
      read: false,
      actionUrl: "/student/dashboard?tab=grades"
    },
    {
      id: "notif-3",
      type: "message",
      title: "New Message",
      message: "Ms. Priya Sharma sent you a message",
      timestamp: /* @__PURE__ */ new Date("2026-02-05T11:15:00"),
      read: true
    },
    {
      id: "notif-4",
      type: "attendance",
      title: "Attendance Marked",
      message: "Your attendance has been marked for today",
      timestamp: /* @__PURE__ */ new Date("2026-02-06T08:00:00"),
      read: true
    }
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: /* @__PURE__ */ new Date(),
      read: false
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);
  const markAsRead = useCallback((id) => {
    setNotifications(
      (prev) => prev.map((notif) => notif.id === id ? { ...notif, read: true } : notif)
    );
  }, []);
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  const showToast = useCallback((type, message, description) => {
    switch (type) {
      case "success":
        toast.success(message, { description });
        break;
      case "error":
        toast.error(message, { description });
        break;
      case "warning":
        toast.warning(message, { description });
        break;
      case "info":
      default:
        toast.info(message, { description });
        break;
    }
  }, []);
  return <NotificationContext.Provider
    value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      showToast
    }}
  >
      {children}
    </NotificationContext.Provider>;
};
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
