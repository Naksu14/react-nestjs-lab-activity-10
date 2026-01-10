import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import eventLogo from "../assets/icons/event-logo.png";
import { LuExternalLink } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";
import { getCurrentUser } from "../services/authService";
import { LuChevronDown } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import LogoutModal from "./modal/logoutModal";

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
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  const profile = useMemo(() => {
    if (!currentUser) {
      return { name: "Guest", initials: "?", hasUser: false };
    }
    const first = currentUser.firstname || "";
    const last = currentUser.lastname || "";
    const initials = `${first.charAt(0) || ""}${last.charAt(0) || ""}` || "?";
    const name = `${first} ${last}`.trim() || "Guest";
    return { name, initials: initials.toUpperCase(), hasUser: true };
  }, [currentUser]);

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

              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex flex-col text-right leading-tight">
              <span className="text-sm font-semibold text-[var(--text-primary)]">{profile.name}</span>
              <span className="text-[12px] text-[var(--text-muted)]">QRserve</span>
            </div>
            <button
              type="button"
              onClick={() => profile.hasUser && setIsLogoutOpen(true)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center relative ${
                profile.hasUser
                  ? "bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)] font-semibold group"
                  : "bg-gray-100 border-[var(--border-color)] text-[var(--text-muted)]"
              }`}
              aria-label={profile.hasUser ? "Open account menu" : "User not logged in"}
            >
              {profile.hasUser ? (
                profile.initials
              ) : (
                <FaUser className="text-base" />
              )}
              {profile.hasUser ? (
                <LuChevronDown className="absolute -right-5 text-[var(--text-muted)] group-hover:text-[var(--accent-color)]" />
              ) : null}
            </button>
          </div>

          {children}
        </div>
      </div>
      {profile.hasUser ? (
        <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
      ) : null}
    </header>
  );
};

export default Header;
