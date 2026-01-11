import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import eventLogo from "../assets/icons/event-logo.png";
import { LuExternalLink } from "react-icons/lu";
import { IoTicketOutline } from "react-icons/io5";
import { getCurrentUser, updateUser } from "../services/authService";
import { LuChevronDown } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import LogoutModal from "./modal/logoutModal";
import EditProfileModal from "./modal/EditProfileModal";

const navLinks = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Events",
    to: "/#events",
  },
  {
    label: "My Tickets",
    to: "/tickets",
    icon: <IoTicketOutline className="text-xl text-[var(--accent-color)]" />,
    isProfile: true,
    requiresAuth: true,
  },
];

const Header = ({ children }) => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: currentUser, refetch } = useQuery({
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

  const handleNav = (to, requiresAuth) => {
    if (requiresAuth && !profile.hasUser) {
      navigate("/login");
      return;
    }
    navigate(to);
  };

  const handleSaveProfile = async (updated) => {
    try {
      if (currentUser?.id) {
        await updateUser(currentUser.id, updated);
        await refetch();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
    return Promise.resolve();
  };

  return (
    <>
    <header className="fixed top-0 left-0 w-full z-[9999] bg-[var(--bg-card)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 h-[84px] flex items-center justify-between">

        {/* LOGO */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 select-none"
        >
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
        </button>

        {/* NAV */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(({ label, to, icon, isProfile, requiresAuth }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNav(to, requiresAuth)}
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

              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 relative">
            <div className="flex flex-col text-right leading-tight">
              <span className="text-sm font-semibold text-[var(--text-primary)]">{profile.name}</span>
              <span className="text-[12px] text-[var(--text-muted)]">QRserve</span>
            </div>
            <button
              type="button"
              onClick={() => profile.hasUser && setIsMenuOpen(!isMenuOpen)}
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
                <LuChevronDown className={`absolute -right-5 text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              ) : null}
            </button>

            {/* Account Dropdown */}
            {isMenuOpen && profile.hasUser && (
              <div 
                className="absolute top-full right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-xl z-[10000] py-1 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-color)]/10 flex items-center gap-2"
                >
                  <FaUser className="text-[var(--accent-color)]" />
                  Edit Profile
                </button>
                <div className="h-[1px] bg-[var(--border-color)] my-1"></div>
                <button
                  onClick={() => {
                    setIsLogoutOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </header>
    {profile.hasUser ? (
      <>
        <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
        <EditProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          role="attendee"
          initialData={{
            firstname: currentUser?.firstname || "",
            lastname: currentUser?.lastname || "",
            email: currentUser?.email || "",
          }}
          onSave={handleSaveProfile}
        />
      </>
    ) : null}
    </>
  );
};

export default Header;
