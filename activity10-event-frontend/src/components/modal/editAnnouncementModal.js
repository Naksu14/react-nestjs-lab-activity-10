import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEventsByOrganizer,
  updateAnnouncement,
} from "../../services/organizerService";
import { Loader2, X } from "lucide-react";

const EditAnnouncementModal = ({
  isOpen,
  announcement,
  onClose,
  onUpdated,
}) => {
  const queryClient = useQueryClient();
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["organizerEvents"],
    queryFn: () => getAllEventsByOrganizer(),
  });

  const [form, setForm] = useState({ event_id: "", title: "", message: "" });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (announcement) {
      setForm({
        event_id: announcement.event?.id || "",
        title: announcement.title || "",
        message: announcement.message || "",
      });
      setCharCount((announcement.message || "").length);
    }
  }, [announcement]);

  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateAnnouncement(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["allAnnouncements"]);
      queryClient.invalidateQueries(["organizerEvents"]);
      if (onUpdated) onUpdated();
      onClose();
    },
  });

  const submitting = mutation.isLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!announcement) return;
    const payload = {
      event_id: form.event_id || null,
      title: form.title,
      message: form.message,
    };
    mutation.mutate({ id: announcement.id, payload });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-[var(--bg-card)] rounded-lg shadow-lg border p-6"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Edit Announcement</h3>
            <p className="text-xs opacity-60">Make updates and save changes.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-slate-500/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs opacity-70 mb-1 block">Event</label>
            <select
              name="event_id"
              value={form.event_id || ""}
              onChange={handleChange}
              className="w-full rounded-md py-2 px-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">General</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title_event}
                </option>
              ))}
            </select>
            {eventsLoading && (
              <div className="text-xs opacity-50">Loading events...</div>
            )}
          </div>

          <div>
            <label className="text-xs opacity-70 mb-1 block">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md py-2 px-3 text-sm"
              style={{
                backgroundColor: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
              required
            />
          </div>

          <div>
            <label className="text-xs opacity-70 mb-1 block">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-md py-2 px-3 text-sm resize-none"
              style={{
                backgroundColor: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
              required
            />
            <div className="text-right text-xs opacity-60 mt-1">
              {charCount} chars
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              border: "1px solid var(--border-color)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnnouncementModal;
