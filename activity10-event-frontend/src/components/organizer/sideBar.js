import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "../modal/logoutModal";
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  Megaphone,
  LogOut,
} from "lucide-react";
import eventLogo from "../../assets/icons/event-logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const menuItems = [
    {
      group: "General",
      items: [
        {
          name: "My Events",
          icon: <Calendar size={20} />,
          path: "/organizer/myevents",
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          name: "Attendees",
          icon: <Users size={20} />,
          path: "/organizer/attendees",
        },
        {
          name: "QR Scanner",
          icon: <QrCode size={20} />,
          path: "/organizer/scanner",
        },
      ],
    },
    {
      group: "Communication",
      items: [
        {
          name: "Announcements",
          icon: <Megaphone size={20} />,
          path: "/organizer/announcements",
        },
      ],
    },
  ];

  const location = useLocation();

  // Pick the most-specific matching path so only one menu item is active.
  const allPaths = menuItems.flatMap((section) =>
    section.items.map((i) => i.path)
  );
  const bestMatch = allPaths
    .filter(
      (p) => location.pathname === p || location.pathname.startsWith(p + "/")
    )
    .sort((a, b) => b.length - a.length)[0];
  return (
    <aside
      className="sidebar w-64 h-[calc(100vh-0.5rem)] fixed flex flex-col text-left border m-1 rounded-lg transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        color: "var(--text-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center space-x-3">
        <img
          src={eventLogo}
          alt="Logo"
          className="w-8 h-8 rounded-lg shadow-sm"
        />
        <span className="text-xl font-bold tracking-tight">QRserve</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <p
              className="text-[10px] uppercase tracking-widest font-bold mb-2 px-2"
              style={{ color: "var(--text-muted)" }}
            >
              {section.group}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.path === bestMatch;
                return (
                  <li key={item.name}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.path);
                      }}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group ${
                        isActive ? "active" : ""
                      }`}
                    >
                      <span className="transition-colors item-icon">
                        {item.icon}
                      </span>
                      <span className="ml-3">{item.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Profile/Settings */}
      <div
        className="p-4 border-t border-gray-100 dark:border-gray-800"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
