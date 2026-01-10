import React from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import { Calendar } from "lucide-react";
import { getAllEventsByOrganizer } from "../../../services/organizerService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const EventOrganizerPage = () => {
  const queryClient = useQueryClient();
  const {
    data: organizerEvents,
  } = useQuery({
    queryKey: ["organizerEvents"],
    queryFn: () => getAllEventsByOrganizer(),
  });
  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <div className="ml-[17rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="mt-1" style={{ color: "var(--text-muted)" }}>
              Manage your events, scan tickets, and track registrations.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {["Active Events", "Total Attendees", "Tickets Scanned"].map(
              (label, i) => (
                <div
                  key={label}
                  className="p-6 rounded-3xl shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {[organizerEvents?.length || 0, 0, 0][i]}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Content Area */}
          <div
            className="rounded-3xl p-8 shadow-sm min-h-[400px]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-20">
              <div
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <Calendar size={32} />
              </div>
              <p>Select a menu item to get started</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventOrganizerPage;
