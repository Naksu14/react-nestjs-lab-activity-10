import React, { useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import Pagination from "../../../components/organizer/pagination";
import {
  Plus,
  Users,
  Calendar,
  Inbox,
  Loader2,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import CreateAnnouncementModal from "../../../components/modal/createAnnouncementModal";
import ViewAnnouncementModal from "../../../components/modal/viewAnnouncementModal";
import EditAnnouncementModal from "../../../components/modal/editAnnouncementModal";
import DeleteAnnouncementModal from "../../../components/modal/deleteAnnouncementModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllAnnouncementsBySender } from "../../../services/organizerService";
import { deleteAnnouncement } from "../../../services/eventsService";

const Announcements = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [viewAnnouncement, setViewAnnouncement] = useState(null);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date_desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: allAnnouncements, isLoading } = useQuery({
    queryKey: ["allAnnouncements"],
    queryFn: () => getAllAnnouncementsBySender(),
  });

  // Filter based on search term
  const filteredAnnouncements = (allAnnouncements || []).filter((a) => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return true;
    const inTitle = (a.title || "").toLowerCase().includes(q);
    const inMessage = (a.message || "").toLowerCase().includes(q);
    const inEvent = (a.event?.title_event || "").toLowerCase().includes(q);
    return inTitle || inMessage || inEvent;
  });

  // Sort according to selected option
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sortOption === "date_desc") {
      return new Date(b.sent_at) - new Date(a.sent_at);
    }
    if (sortOption === "date_asc") {
      return new Date(a.sent_at) - new Date(b.sent_at);
    }
    if (sortOption === "event_asc") {
      const ta = (a.event?.title_event || "").toLowerCase();
      const tb = (b.event?.title_event || "").toLowerCase();
      return ta.localeCompare(tb);
    }
    if (sortOption === "event_desc") {
      const ta = (a.event?.title_event || "").toLowerCase();
      const tb = (b.event?.title_event || "").toLowerCase();
      return tb.localeCompare(ta);
    }
    return 0;
  });

  // Calculate Pagination using filtered + sorted results
  const totalItems = sortedAnnouncements.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData =
    sortedAnnouncements.slice(startIndex, startIndex + itemsPerPage) || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteAnnouncement = async () => {
    await deleteAnnouncement(announcementToDelete.id);
    queryClient.invalidateQueries({ queryKey: ["allAnnouncements"] });
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
      <div className="ml-[16.5rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-4 max-w-7xl mx-auto w-full flex flex-col min-h-[calc(100-64px)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-left">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Announcements
              </h1>
              <p className="text-sm opacity-60">
                Manage and view broadcasted updates for your events.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95"
              style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
            >
              <Plus size={18} /> New Announcement
            </button>
          </div>
          {/* Controls Bar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 group">
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search title and event..."
                className="w-full rounded-2xl py-3 pl-12 pr-4 focus:ring-2 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-2xl py-3 px-3 text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="date_desc">Date (Newest)</option>
                <option value="date_asc">Date (Oldest)</option>
                <option value="event_asc">Event A → Z</option>
                <option value="event_desc">Event Z → A</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div
            className="flex-1 overflow-hidden rounded-lg border mb-4"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "rgba(var(--accent-rgb), 0.02)",
                    }}
                  >
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">
                      Announcement
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">
                      Event
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">
                      Recipients
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60 text-right">
                      Date Sent
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <Loader2
                          className="animate-spin mx-auto opacity-40"
                          size={32}
                        />
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((a, idx) => (
                      <tr
                        key={a.id}
                        className="group hover:bg-[var(--row-hover)] transition-colors"
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? "transparent" : "var(--table-body)",
                        }}
                      >
                        <td className="px-6 py-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm mb-0.5 group-hover:text-[var(--accent-color)]">
                              {a.title}
                            </span>
                            <span className="text-xs opacity-60 line-clamp-1 max-w-[300px]">
                              {a.message}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium "
                            style={{
                              backgroundColor: "rgba(var(--accent-rgb), 0.1)",
                              color: "var(--accent-color)",
                            }}
                          >
                            <Calendar size={12} />{" "}
                            {a.event?.title_event || "General"}
                          </span>
                        </td>
                         <td className="px-6 py-5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium "
                            style={{
                              backgroundColor: "rgba(var(--accent-rgb), 0.1)",
                              color: "var(--accent-color)",
                            }}
                          >
                            <Calendar size={12} />{" "}
                            {a.event?.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm opacity-80">
                            <Users size={14} className="opacity-40" />{" "}
                            {a.recipients}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-xs font-medium opacity-60">
                            {formatDate(a.sent_at)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-start">
                          <button
                            onClick={() => setViewAnnouncement(a)}
                            className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors opacity-70"
                            style={{ color: "var(--accent-color)" }}
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          {a.event?.status === "published" && (
                            <>
                              <button
                                onClick={() => setEditAnnouncement(a)}
                                className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors opacity-70"
                                style={{ color: "var(--accent-color)" }}
                                title="Edit announcement"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setAnnouncementToDelete(a)}
                                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-70"
                                style={{ color: "#ef4444" }}
                                title="Delete announcement"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <Inbox size={48} className="mx-auto opacity-20" />
                        <p className="mt-2 opacity-40">No records found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Component Integration */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>

      <CreateAnnouncementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(p) => {
          console.log(p);
          setShowModal(false);
        }}
      />
      <EditAnnouncementModal
        isOpen={!!editAnnouncement}
        announcement={editAnnouncement}
        onClose={() => setEditAnnouncement(null)}
      />
      <ViewAnnouncementModal
        isOpen={!!viewAnnouncement}
        announcement={viewAnnouncement}
        onClose={() => setViewAnnouncement(null)}
      />
      <DeleteAnnouncementModal
        isOpen={!!announcementToDelete}
        onClose={() => setAnnouncementToDelete(null)}
        onConfirm={handleDeleteAnnouncement}
        announcementTitle={announcementToDelete?.title}
      />
    </div>
  );
};

export default Announcements;
