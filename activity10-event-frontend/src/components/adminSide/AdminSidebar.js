import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "../modal/logoutModal";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const menuItems = [
    {
      group: "Management",
      items: [
        {
          name: "Event Management",
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          ),
          path: "/admin/events-management",
        },
        {
          name: "User Management",
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          ),
          path: "/admin/user-management",
        },
        {
          name: "My Tickets",
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
            </svg>
          ),
          path: "/admin/my-tickets",
        },
      ],
    },
    {
      group: "Communication",
      items: [
        {
          name: "Attendance Reports",
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          ),
          path: "/admin/reports",
        },
      ],
    },
  ];

  return (
    <aside
      className="sidebar sticky top-1 w-64 h-[calc(100vh-0.5rem)] flex flex-col text-left border m-1 rounded-lg transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center space-x-3">
        <svg className="w-8 h-8 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
        </svg>
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
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group cursor-pointer ${
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
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
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

export default AdminSidebar;
