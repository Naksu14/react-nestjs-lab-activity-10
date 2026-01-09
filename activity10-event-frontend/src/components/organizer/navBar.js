import React, { useState, useEffect } from "react";
import { Moon, Sun, Bell, Search } from "lucide-react";

const NavBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <header
      className="h-16 border flex justify-end items-center px-8 sticky top-0 z-10 backdrop-blur-md rounded-lg m-1"
      style={{
        backgroundColor: "var(--bg-navbar)",
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
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="h-8 w-[1px] mx-2" style={{ backgroundColor: 'var(--border-color)'}}></div>

        <button className="flex items-center space-x-3 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-tight">User Name</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Organizer Account</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
            OP
          </div>
        </button>
      </div>
    </header>
  );
};

export default NavBar;
