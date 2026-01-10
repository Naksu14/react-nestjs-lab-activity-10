import React, { useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import Pagination from "../../../components/organizer/pagination";
import { Plus, Users, Calendar, Inbox, Loader2 } from "lucide-react";
import CreateAnnouncementModal from "../../../components/modal/createAnnouncementModal";
import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncementsBySender } from "../../../services/organizerService";

const Announcements = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: allAnnouncements, isLoading } = useQuery({
    queryKey: ["allAnnouncements"],
    queryFn: () => getAllAnnouncementsBySender(),
  });

  // Calculate Pagination
  const totalItems = allAnnouncements?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = allAnnouncements?.slice(startIndex, startIndex + itemsPerPage) || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-primary)" }}>
      <Sidebar />
      <div className="ml-[17rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-4 max-w-6xl mx-auto w-full flex flex-col min-h-[calc(100-64px)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-left">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
              <p className="text-sm opacity-60">Manage and view broadcasted updates for your events.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
              style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
            >
              <Plus size={18} /> New Announcement
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-hidden rounded-2xl border mb-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "rgba(var(--accent-rgb), 0.02)" }}>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Announcement</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Event</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Recipients</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60 text-right">Date Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                  {isLoading ? (
                    <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto opacity-40" size={32} /></td></tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((a) => (
                      <tr key={a.id} className="group hover:bg-slate-500/5 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm mb-0.5 group-hover:text-[var(--accent-color)]">{a.title}</span>
                            <span className="text-xs opacity-60 line-clamp-1 max-w-[300px]">{a.message}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ backgroundColor: "rgba(var(--accent-rgb), 0.1)", color: "var(--accent-color)" }}>
                            <Calendar size={12} /> {a.event?.title_event || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm opacity-80"><Users size={14} className="opacity-40" /> {a.recipients}</div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-xs font-medium opacity-60">{formatDate(a.sent_at)}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-20 text-center"><Inbox size={48} className="mx-auto opacity-20" /><p className="mt-2 opacity-40">No records found</p></td></tr>
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
        onSubmit={(p) => { console.log(p); setShowModal(false); }}
      />
    </div>
  );
};

export default Announcements;