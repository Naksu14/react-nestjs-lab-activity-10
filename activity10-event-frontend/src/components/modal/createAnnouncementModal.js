import React, { useEffect, useState } from "react";
import { X, Send, Megaphone, Type, Calendar, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEventsByOrganizer,
  createAnnouncement,
} from "../../services/organizerService";
import { getCurrentUser } from "../../services/authService";

const CreateAnnouncementModal = ({ isOpen, onClose, initialEventId }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    event_id: "",
    title: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: organizerEvents } = useQuery({
    queryKey: ["organizerEvents"],
    queryFn: () => getAllEventsByOrganizer(),
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        event_id: initialEventId ? String(initialEventId) : "",
        title: "",
        message: "",
      });
    }
  }, [isOpen, initialEventId]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.event_id || !formData.title || !formData.message) return;

    setIsSubmitting(true);
    try {
      await createAnnouncement({
        event_id: Number(formData.event_id),
        title: formData.title,
        message: formData.message,
        sent_by: currentUser.id,
      });
      queryClient.invalidateQueries({ queryKey: ["organizerEvents"] });
      queryClient.invalidateQueries({ queryKey: ["allAnnouncements"] });
      onClose();
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
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
                <h2 className="text-xl font-bold tracking-tight">
                  Create Announcement
                </h2>
                <p className="text-sm opacity-70">
                  Broadcast an update to your attendees.
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

          <form className="space-y-5 text-left">
            {/* Event Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                <Calendar size={12} /> Target Event
              </label>
              {initialEventId ? (
                // Show locked event when opened from specific event
                <div
                  className="w-full px-4 py-2.5 rounded-xl text-sm border flex items-center gap-2"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span className="font-medium">
                    {(organizerEvents || []).find(e => e.id === initialEventId)?.title_event || "Selected Event"}
                  </span>
                </div>
              ) : (
                // Show dropdown when no specific event
                <select
                  value={formData.event_id}
                  onChange={(e) =>
                    setFormData({ ...formData, event_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent border transition-all focus:ring-2 focus:ring-blue-500/20 outline-none"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  <option value="">Choose an event...</option>
                  {(organizerEvents || [])
                    .filter((e) => e.status === "published")
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title_event}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                <Type size={12} /> Headline
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Important: Schedule Change"
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent border transition-all focus:ring-2 focus:ring-blue-500/20 outline-none"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                Detailed Message
              </label>
              <div className="relative">
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell your attendees what's happening..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm bg-transparent border transition-all focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                />
                <div className="absolute bottom-3 right-3 text-[10px] opacity-40 font-mono">
                  {formData.message.length} characters
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border hover:bg-slate-500/5 transition-all"
                style={{ borderColor: "var(--border-color)" }}
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex-[2] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "#fff",
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Post Announcement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
