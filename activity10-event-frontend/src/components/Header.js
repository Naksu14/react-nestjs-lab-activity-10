import React from "react";
import eventLogo from "../assets/icons/event-logo.png";

const Header = ({ children }) => {
  return (
    <header
      className="w-full flex items-center justify-between px-6 py-3 shadow-md bg-[var(--bg-card)] border-b border-[var(--border-color)]"
      style={{ color: "var(--text-primary)" }}
    >
      <div className="flex items-center">
        <img
          src={eventLogo}
          alt="Event Logo"
          className="h-10 w-auto mr-4 select-none"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.04))" }}
        />
        <span className="text-xl font-bold tracking-wide uppercase" style={{ color: "var(--accent-color)" }}>
          Event Portal
        </span>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </header>
  );
};

export default Header;
