import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  FileDown,
  Megaphone,
  LogOut,
} from "lucide-react";
import eventLogo from "../../assets/icons/event-logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      group: "General",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard size={20} />,
          path: "/organizer",
        },
        { name: "My Events", icon: <Calendar size={20} />, path: "/myevents" },
      ],
    },
    {
      group: "Management",
      items: [
        { name: "Attendees", icon: <Users size={20} />, path: "/attendees" },
        { name: "QR Scanner", icon: <QrCode size={20} />, path: "/scanner" },
      ],
    },
    {
      group: "Communication",
      items: [
        {
          name: "Announcements",
          icon: <Megaphone size={20} />,
          path: "/announcements",
        },
      ],
    },
  ];

  const location = useLocation();

  return (
    <aside
      className="sidebar w-64 h-[calc(100vh-0.5rem)] flex flex-col text-left border m-1 rounded-lg transition-colors duration-300"
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
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");
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
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
