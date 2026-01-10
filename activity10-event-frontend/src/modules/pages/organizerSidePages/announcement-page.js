import React, { useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import { Plus, Users } from "lucide-react";
import CreateAnnouncementModal from "../../../components/modal/createAnnouncementModal";

const Announcements = () => {
  const [showModal, setShowModal] = useState(false);

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

      <CreateAnnouncementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(payload) => {
          // Here you can call your API using payload:
          // { event_id: number, title: string, message: string }
          console.log("Sending announcement:", payload);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default Announcements;
