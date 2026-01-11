import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Search,
  Edit3,
} from "lucide-react";
import AdminTopNav from "../../../components/adminSide/AdminTopNav";
import AdminSidebar from "../../../components/adminSide/AdminSidebar";
import CreateEventModal from "../../../components/modal/createEventModal";
import DeleteEventModal from "../../../components/modal/deleteEventModal";
import UpdateEventModal from "../../../components/modal/updateEventModal";
import ViewEvent from "../../../components/organizer/viewEvent";
import Pagination from "../../../components/organizer/pagination";
import { getAllEvents } from "../../../services/eventsService";
import { deleteEvent } from "../../../services/organizerService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const EventAdminSidePage = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  const { data: adminEvents = [] } = useQuery({
    queryKey: ["adminEvents"],
    queryFn: () => getAllEvents(),
  });

  const filteredEvents = adminEvents.filter((ev) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !search ||
      ev.title_event?.toLowerCase().includes(search) ||
      ev.location?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ? true : ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      queryClient.invalidateQueries(["adminEvents"]);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopNav />

        <main className="p-6 max-w-7xl mx-auto w-full">
          {selectedEvent ? (
            <ViewEvent event={selectedEvent} onBack={() => setSelectedEvent(null)} isAdminView={true} />
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>
                    Admin • Events
                  </p>
                  <h1 className="text-4xl text-left font-black tracking-tight">
                    All Events
                  </h1>
                  <p className="mt-2 font-medium" style={{ color: "var(--text-muted)" }}>
                    Search, review, edit, or delete any event across the platform.
                  </p>
                </div>

                <button
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "#fff",
                  }}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus size={20} />
                  <span>Create Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {["All Events", "Published", "Completed"].map((label, i) => {
                  const totals = [
                    adminEvents.length,
                    adminEvents.filter((e) => e.status === "published").length,
                    adminEvents.filter((e) => e.status === "completed").length,
                  ];
                  return (
                    <div
                      key={label}
                      className="p-4 rounded-2xl shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                        {label}
                      </p>
                      <p className="text-3xl font-bold mt-2">{totals[i]}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mb-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[280px]">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    size={18}
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    placeholder="Search by event name or location..."
                    className="w-full rounded-2xl py-3 pl-12 pr-4 outline-none transition-all text-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="rounded-2xl py-3 px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="all">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {paginatedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="event-card group relative rounded-lg p-6 transition-all duration-300"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {ev.eventImage && (
                      <div className="mb-4 -mx-6 -mt-6 h-40 overflow-hidden rounded-t-lg">
                        <img
                          src={`${API_URL}${ev.eventImage}`}
                          alt={ev.title_event}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        ev.status === "published"
                          ? "bg-green-100 text-green-600"
                          : ev.status === "completed"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {ev.status || "draft"}
                    </div>

                    <div className="space-y-4 cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                      <div className="pr-16">
                        <h3 className="text-xl text-left font-bold group-hover:text-indigo-600 transition-colors">
                          {ev.title_event}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <div
                          className="flex items-center text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <MapPin
                            size={16}
                            className="mr-2"
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
                            className="mr-2"
                            style={{ color: "var(--accent-color)" }}
                          />
                          {new Date(ev.start_datetime).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>

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
                              {ev.capacity}
                            </p>
                            <p
                              className="text-[10px] uppercase font-bold tracking-tighter"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Capacity
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventToEdit(ev);
                              setIsUpdateModalOpen(true);
                            }}
                            className="p-2.5 rounded-xl transition-all"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--text-muted)",
                            }}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventToDelete(ev);
                              setIsDeleteModalOpen(true);
                            }}
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

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isAdminCreating={true}
        onSuccess={() => queryClient.invalidateQueries(["adminEvents"])}
      />

      <UpdateEventModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        event={eventToEdit}
        onSuccess={() => queryClient.invalidateQueries(["adminEvents"])}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        eventTitle={eventToDelete?.title_event}
        onConfirm={() => {
          if (eventToDelete?.id) {
            handleDeleteEvent(eventToDelete.id);
          }
          setEventToDelete(null);
        }}
      />
    </div>
  );
};

export default EventAdminSidePage;