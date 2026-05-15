import { Menu, Bell } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNotifications } from "../../app/context/NotificationContext";
import { useChatContext } from "../../app/context/ChatContext";
import { NotificationCenter } from "../../app/components/NotificationCenter";

export const SharedTopbar = ({ setSidebarOpen, menuItems }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Find the single most specific active item for the title
  const getActiveMenu = () => {
    const sortedItems = [...menuItems].sort((a, b) => b.path.length - a.path.length);
    return sortedItems.find(item => 
      currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'))
    ) || { label: "Dashboard" };
  };

  const activeMenu = getActiveMenu();

  const { unreadCount } = useNotifications();
  const { unreadConversationsCount } = useChatContext();
  const totalUnread = unreadCount + unreadConversationsCount;

  return (
    <>
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
              {activeMenu.label}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {totalUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notification Center */}
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </>
  );
};
