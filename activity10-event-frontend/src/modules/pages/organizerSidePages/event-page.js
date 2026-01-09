import React, { useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

const MyEvent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Summer Meetup",
      date: "2026-06-15",
      location: "Central Park",
      attendees: 120,
      status: "Active",
    },
    {
      id: 2,
      title: "Tech Talk",
      date: "2026-03-02",
      location: "Room 204",
      attendees: 45,
      status: "Draft",
    },
  ]);

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <NavBar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header & Main Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl text-left font-black tracking-tight">My Events</h1>
              <p
                className="mt-2 font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Manage schedules, locations, and capacity for your happenings.
              </p>
            </div>

            <button
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all active:scale-95"
              style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
            >
              <Plus size={20} />
              <span>Create New Event</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-8 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder="Search by event name or location..."
                className="w-full rounded-2xl py-3 pl-12 pr-4 outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <button
              className="p-3 rounded-2xl transition-colors"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="event-card group relative rounded-lg p-6 transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    ev.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {ev.status}
                </div>

                <div className="space-y-4">
                  <div className="pr-16">
                    <h3 className="text-xl text-left font-bold group-hover:text-indigo-600 transition-colors">
                      {ev.title}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MapPin
                        size={16}
                        className="mr-2 icon-accent"
                        style={{ color: "var(--accent-color)" }}
                      />
                      {ev.location}
                    </div>
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Calendar
                        size={16}
                        className="mr-2 icon-accent"
                        style={{ color: "var(--accent-color)" }}
                      />
                      {new Date(ev.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div
                    className="pt-4 flex items-center justify-between"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--accent-color)",
                        }}
                      >
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-lg font-bold leading-none">
                          {ev.attendees}
                        </p>
                        <p
                          className="text-[10px] uppercase font-bold tracking-tighter"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Attendees
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="p-2.5 rounded-xl transition-all"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="p-2.5 rounded-xl transition-all"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyEvent;
