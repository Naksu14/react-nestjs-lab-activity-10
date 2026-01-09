
import React from "react";
import eventLogo from "../assets/icons/event-logo.png";
import { FaUser } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";


const navLinks = [
  {
    label: "Home",
    icon: null,
    href: "#",
    right: <LuExternalLink className="ml-2 text-base text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors" />,
    placeholder: true,
  },
  {
    label: "Events",
    icon: null,
    href: "#",
    right: <LuExternalLink className="ml-2 text-base text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors" />,
    placeholder: true,
  },
  {
    label: "My Tickets",
    icon: <IoTicketOutline className="text-2xl mr-2 text-[var(--accent-color)]" />, // left icon
    href: "#",
    right: (
      <span className="flex items-center justify-center rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)] w-10 h-10 ml-4">
        <FaUser className="text-xl text-[var(--accent-color)]" />
      </span>
    ),
    placeholder: false,
  },
];

const Header = ({ children }) => (
  <header
    className="w-full flex items-center justify-between bg-[var(--bg-card)] border-b border-[var(--border-color)] fixed top-0 left-0 z-[9999]"
    style={{ color: "var(--text-primary)", minHeight: '84px', padding: '0 10%' }}
  >
    <div className="flex items-center" style={{ marginLeft: '5%' }}>
      <img
        src={eventLogo}
        alt="Event Logo"
        className="h-16 w-auto mr-1 select-none"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.04))" }}
      />
      <span className="text-2xl font-semibold tracking-wide select-none">
        <span style={{ color: '#7c3aed' }}>Q</span>
        <span style={{ color: '#7c3aed' }}>R</span>
        <span style={{ color: '#1f2328' }}>serve</span>
      </span>
    </div>
    <div className="flex flex-col items-end gap-4 pt-2">
      <nav className="flex flex-row items-center gap-3 pt-0 px-2 pb-2 ml-10">
        {navLinks.map(({ label, icon, href, right, placeholder }) => (
          <a
            key={label}
            href={href}
            className="flex items-center group px-3 py-0 rounded text-lg text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors min-h-[40px]"
          >
            {icon}
            <span className={icon ? "mr-2" : ""}>{label}</span>
            {right}
            {placeholder && <span className="w-10 h-10 ml-4" />}
          </a>
        ))}
      </nav>
      {children}
    </div>
  </header>
);

export default Header;
