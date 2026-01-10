import React, { useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import { Send, Plus, X, Users } from "lucide-react";

const Announcements = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    event_id: "",
    title: "",
    message: "",
  });

  // Mock data
  const events = [
    { id: 1, name: "Tech Conference 2026" },
    { id: 2, name: "Music Festival" },
  ];

  const announcements = [
    {
      id: 1,
      event: "Tech Conference 2026",
      title: "Schedule Update",
      message: "Keynote moved to 10:00 AM.",
      sent_at: "Jan 9, 2026",
      recipients: 245,
    },
    {
      id: 2,
      event: "Music Festival",
      title: "Artist Lineup",
      message: "Full lineup now available!",
      sent_at: "Jan 8, 2026",
      recipients: 1200,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending:", formData);
    setShowModal(false);
    setFormData({ event_id: "", title: "", message: "" });
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />
      <div className=" ml-[17rem] flex-1 flex flex-col">
        <NavBar />
        <main className="p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Announcements</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
              style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
            >
              <Plus size={18} /> New
            </button>
          </div>

          {/* List */}
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(99,102,241,0.1)",
                      color: "var(--accent-color)",
                    }}
                  >
                    {a.event}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {a.sent_at}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{a.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {a.message}
                </p>
                <div
                  className="mt-2 text-xs flex items-center gap-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Users size={12} /> {a.recipients} recipients
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="w-full max-w-md mx-4 rounded-xl p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">New Announcement</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.event_id}
                onChange={(e) =>
                  setFormData({ ...formData, event_id: e.target.value })
                }
                required
                className="w-full px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">Select event...</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
                required
                className="w-full px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Message..."
                rows={4}
                required
                className="w-full px-3 py-2 rounded-lg resize-none"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg"
                  style={{
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "#fff",
                  }}
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
