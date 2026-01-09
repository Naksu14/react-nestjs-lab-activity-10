import React from "react";
import eventLogo from "../assets/icons/event-logo.png";
import { FaUser } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";

const navLinks = [
  {
    label: "Home",
    href: "#",
    external: true,
  },
  {
    label: "Events",
    href: "#",
    external: true,
  },
  {
    label: "My Tickets",
    href: "#",
    icon: <IoTicketOutline className="text-xl text-[var(--accent-color)]" />,
    isProfile: true,
  },
];

const Header = ({ children }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-[var(--bg-card)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 h-[84px] flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-2 select-none">
          <img
            src={eventLogo}
            alt="QRserve Logo"
            className="h-12 w-auto"
            draggable={false}
          />
          <span className="text-2xl font-semibold tracking-wide">
            <span className="text-[var(--accent-color)]">QR</span>
            <span className="text-[var(--text-primary)]">serve</span>
          </span>
        </div>

        {/* NAV */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(({ label, href, icon, external, isProfile }) => (
              <a
                key={label}
                href={href}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition
                  ${
                    isProfile
                      ? "hover:bg-[var(--accent-color)]/10"
                      : "hover:text-[var(--accent-color)]"
                  }
                `}
              >
                {icon}

                <span>{label}</span>

                {external && (
                  <LuExternalLink className="text-sm text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition" />
                )}

                {isProfile && (
                  <span className="ml-2 flex items-center justify-center w-9 h-9 rounded-full border border-[var(--accent-color)] bg-[var(--accent-color)]/10">
                    <FaUser className="text-[var(--accent-color)] text-lg" />
                  </span>
                )}
              </a>
            ))}
          </nav>

          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
