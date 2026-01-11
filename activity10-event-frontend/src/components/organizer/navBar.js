import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { getCurrentUser, updateUser } from "../../services/authService";
import EditProfileModal from "../modal/EditProfileModal";

const NavBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Extract role from JWT or localStorage
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    } else if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        setUserRole(payload.role);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch current user
    (async () => {
      try {
        const user = await getCurrentUser();
        if (user) setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const fn = currentUser?.firstname || '';
  const ln = currentUser?.lastname || '';
  const displayName = (fn || ln) ? `${fn} ${ln}`.trim() : (userRole === 'organizer' ? 'Organizer' : 'User Name');
  const displayRole = userRole === 'organizer' ? 'Organizer Account' : 'Account';
  const initials = (fn || ln) ? `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase() : (userRole === 'organizer' ? 'OP' : 'UN');

  const handleSaveProfile = async (updated) => {
    try {
      if (currentUser?.id) {
        const result = await updateUser(currentUser.id, updated);
        if (result) {
          setCurrentUser(result);
        } else {
          setCurrentUser({ ...currentUser, ...updated });
        }
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
    return Promise.resolve();
  };

  return (
    <>
    <header
      className="h-16 border flex justify-end items-center px-8 sticky top-0 z-10 backdrop-blur-md rounded-lg m-1"
      style={{
        backgroundColor: "var(--bg-navbar)",
        color: "var(--text-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl hover:scale-105 transition-all"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            backgroundColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div
          className="h-8 w-[1px] mx-2"
          style={{ backgroundColor: "var(--border-color)" }}
        ></div>

        <button onClick={() => setIsProfileOpen(true)} className="flex items-center space-x-3 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">
              {displayName}
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {displayRole}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
            {initials}
          </div>
        </button>
      </div>
    </header>
    <EditProfileModal
      isOpen={isProfileOpen}
      onClose={() => setIsProfileOpen(false)}
      role={userRole || "organizer"}
      initialData={{
        firstname: currentUser?.firstname || "",
        lastname: currentUser?.lastname || "",
        email: currentUser?.email || "",
      }}
      onSave={handleSaveProfile}
    />
    </>
  );
};

export default NavBar;
