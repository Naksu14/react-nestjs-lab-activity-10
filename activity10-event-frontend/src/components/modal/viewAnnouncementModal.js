import React from "react";
import { X, Calendar, Users, Megaphone } from "lucide-react";

const ViewAnnouncementModal = ({ isOpen, announcement, onClose }) => {
  if (!isOpen || !announcement) return null;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: "rgba(var(--accent-rgb), 0.1)",
                  color: "var(--accent-color)",
                }}
              >
                <Megaphone size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Announcement Details
                </h2>
                <p className="text-xs opacity-60">
                  Sent on {formatDate(announcement.sent_at)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-500/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">
                Title
              </label>
              <p className="font-semibold">{announcement.title}</p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">
                Event
              </label>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                style={{
                  backgroundColor: "rgba(var(--accent-rgb), 0.1)",
                  color: "var(--accent-color)",
                }}
              >
                <Calendar size={12} />
                {announcement.event?.title_event || "General"}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1 block">
                Message
              </label>
              <p
                className="text-sm leading-relaxed p-3 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {announcement.message}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Users size={16} />
                <span>{announcement.recipients} recipients</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border hover:bg-slate-500/5 transition-all"
              style={{ borderColor: "var(--border-color)" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncementModal;
