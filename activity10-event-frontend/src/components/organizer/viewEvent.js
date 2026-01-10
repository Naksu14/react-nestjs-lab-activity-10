import React from "react";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncementsByEvent } from "../../services/organizerService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ViewEvent = ({ event, onBack }) => {
  if (!event) return null;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const descriptionParagraphs = (event.description || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const { data: announcements, isLoading: isAnnouncementsLoading } = useQuery({
    queryKey: ["eventAnnouncements", event.id],
    queryFn: () => getAnnouncementsByEvent(event.id),
    enabled: !!event?.id,
  });

  return (
    <div className=" space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 px-1 py-2 text-sm font-medium transition-all hover:text-[var(--accent-color)]"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span>Back to My Events</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Image & Description */}
        <div className="lg:col-span-2 space-y-2">
          {/* Main Hero Card */}
          <div
            className="relative overflow-hidden rounded-lg border shadow-xl shadow-black/5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            {event.eventImage ? (
              <div className="relative h-80 w-full">
                <img
                  src={`${API_URL}${event.eventImage}`}
                  alt={event.title_event}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] bg-white text-black mb-2 inline-block">
                    {event.status}
                  </span>
                  <h1 className="text-3xl font-bold text-white leading-tight">
                    {event.title_event}
                  </h1>
                </div>
              </div>
            ) : (
              <div
                className="p-8 border-b"
                style={{ borderColor: "var(--border-color)" }}
              >
                <h1
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {event.title_event}
                </h1>
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Header Section */}
              <div
                className="flex items-center gap-3 border-b pb-4"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="h-8 w-1.5 rounded-full bg-[var(--accent-color)]" />
                <h2
                  className="text-xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  About this event
                </h2>
              </div>

              {/* Content Section */}
              <div className="prose prose-sm max-w-none">
                {descriptionParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-[15px] leading-relaxed mb-4 last:mb-0 text-justify sm:text-left"
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 400,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
            {/* Announcements Section */}
          <div className="lg:col-span-3">
            <div
              className="rounded-lg border p-6 shadow-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Event Updates
                </h2>
              </div>

              {isAnnouncementsLoading ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Loading updates...
                </p>
              ) : !announcements || announcements.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No announcements for this event yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {a.title}
                        </h3>
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {new Date(a.sent_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {a.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Event Details Sidebar */}
        <div className="space-y-4">
          <div
            className="p-6 rounded-lg border sticky top-6 shadow-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Event Details
            </h3>

            <div className="space-y-6 text-left">
              {/* Organizer */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white font-bold">
                  {event.organizer?.firstname?.[0]}
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Organizer
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {event.organizer?.firstname} {event.organizer?.lastname}
                  </p>
                </div>
              </div>

              <hr style={{ borderColor: "var(--border-color)" }} />

              {/* Location */}
              <div className="flex gap-4">
                <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Location
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex gap-4">
                <div className="mt-1 p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Clock size={20} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Date & Time
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {formatDate(event.start_datetime)}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Ends: {formatDate(event.end_datetime)}
                  </p>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex gap-4">
                <div className="mt-1 p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Users size={20} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Capacity
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {event.capacity} Spots
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              className="w-full mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              onClick={() => navigate(`/organizer/scanner`)}
            >
              Manage Registrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
