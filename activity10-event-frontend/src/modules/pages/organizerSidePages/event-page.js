import React, { useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import CreateEventModal from "../../../components/modal/createEventModal";
import DeleteEventModal from "../../../components/modal/deleteEventModal";
import UpdateEventModal from "../../../components/modal/updateEventModal";
import ViewEvent from "../../../components/organizer/viewEvent";
import Pagination from "../../../components/organizer/pagination";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Search,
  Edit3,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEventsByOrganizer,
  deleteEvent,
} from "../../../services/organizerService";
import { getCurrentUser } from "../../../services/authService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const MyEvent = () => {
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

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  const { data: organizerEvents } = useQuery({
    queryKey: ["organizerEvents"],
    queryFn: () => getAllEventsByOrganizer(),
  });

  const filteredEvents = (organizerEvents || []).filter((ev) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !search ||
      ev.title_event.toLowerCase().includes(search) ||
      ev.location.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ? true : ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort by createdAt (latest first) then paginate
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // Reset to page 1 when filters change
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
      queryClient.invalidateQueries(["organizerEvents"]);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <div className="ml-[16.5rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-4 max-w-7xl mx-auto w-full">
          {selectedEvent ? (
            <ViewEvent
              event={selectedEvent}
              onBack={() => setSelectedEvent(null)}
            />
          ) : (
            <>
              {/* Header & Main Actions */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-4xl text-left font-black tracking-tight">
                    My Events
                  </h1>
                  <p
                    className="mt-2 font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Manage schedules, locations, and capacity for your
                    happenings.
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
                  <span>Create New Event</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="mb-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[300px]">
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

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {(paginatedEvents || []).map((ev) => (
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
                    {/* Status Badge */}
                    <div
                      className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        ev.status === "published"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {ev.status}
                    </div>

                    {/* Admin Created Badge */}
                    {ev.created_by_admin && (
                      <div className="absolute top-6 left-6 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-purple-100 text-purple-600">
                        Admin Created
                      </div>
                    )}

                    <div
                      className="space-y-4 cursor-pointer"
                      onClick={() => setSelectedEvent(ev)}
                    >
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
      </div>
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <UpdateEventModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setEventToEdit(null);
        }}
        event={eventToEdit}
      />
      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        onConfirm={async () => {
          if (eventToDelete) {
            await handleDeleteEvent(eventToDelete.id);
          }
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        eventTitle={eventToDelete?.title_event}
      />
    </div>
  );
};

export default MyEvent;
