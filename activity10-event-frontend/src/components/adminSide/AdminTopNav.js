import React, { useState, useEffect } from "react";
import EditProfileModal from "../modal/EditProfileModal";
import { getCurrentUser, updateUser } from "../../services/authService";

const AdminTopNav = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Extract role from JWT token
    const token = localStorage.getItem("authToken");
    if (token) {
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
  const displayName = (fn || ln) ? `${fn} ${ln}`.trim() : (userRole === 'admin' ? 'Admin' : 'User Name');
  const displayRole = userRole === 'admin' ? 'Admin Account' : 'Organizer Account';
  const initials = (fn || ln) ? `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase() : (userRole === 'admin' ? 'AD' : 'OP');

  const handleSaveProfile = async (updated) => {
    try {
      if (currentUser?.id) {
        const result = await updateUser(currentUser.id, updated);
        if (result) {
          setCurrentUser(result);
        } else {
          // fallback if result is empty
          setCurrentUser({ ...currentUser, ...updated });
        }
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  return (
    <>
    <header
      className="h-16 border flex justify-end items-center px-8 sticky top-0 z-10 backdrop-blur-md rounded-lg m-1"
      style={{
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl hover:scale-105 transition-all"
          style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="h-8 w-[1px] mx-2" style={{ backgroundColor: 'var(--border-color)'}}></div>

        <button className="flex items-center space-x-3 group" onClick={() => setIsProfileOpen(true)}>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">{displayName}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{displayRole}</p>
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
      role={userRole || 'user'}
      initialData={{
        firstname: currentUser?.firstname || '',
        lastname: currentUser?.lastname || '',
        email: currentUser?.email || ''
      }}
      onSave={handleSaveProfile}
    />
    </>
  );
};

export default AdminTopNav;
