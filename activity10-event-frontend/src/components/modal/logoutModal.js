import React from "react";
import ReactDOM from "react-dom";
import { LogOut} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >

        {/* Icon */}
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
        >
          <LogOut size={28} style={{ color: "#ef4444" }} />
        </div>

        {/* Title */}
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Logout
        </h2>

        {/* Message */}
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Are you sure you want to logout? You'll need to sign in again to
          access your account.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-semibold transition-all hover:opacity-80"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#ef4444", color: "#fff" }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutModal;
