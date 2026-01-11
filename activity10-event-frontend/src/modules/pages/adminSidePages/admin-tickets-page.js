import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "../../../components/adminSide/AdminSidebar";
import AdminTopNav from "../../../components/adminSide/AdminTopNav";
import { getCurrentUser } from "../../../services/authService";
import { getTicketsForUser, registerForEvent } from "../../../services/attendeesService";
import { QRCodeCanvas } from "qrcode.react";

const PAGE_SIZE = 5;

const formatDateTime = (value) => {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const AdminTicketsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [qrTicketId, setQrTicketId] = useState(null);
  const qrRef = useRef(null);

  /* ======================
     CURRENT USER
  ====================== */
  const {
    data: currentUser,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  /* ======================
     TICKETS
  ====================== */
  const {
    data: tickets = [],
    isLoading: ticketsLoading,
  } = useQuery({
    queryKey: ["my-tickets", currentUser?.id],
    queryFn: () => getTicketsForUser(currentUser.id),
    enabled: Boolean(currentUser?.id),
    staleTime: 30_000,
  });

  const registerMutation = useMutation({
    mutationFn: ({ eventId, userId }) => registerForEvent({ eventId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    },
  });

  useEffect(() => {
    if (!userLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, userLoading, navigate]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter(
      (ticket) => ticket.status === statusFilter
    );
  }, [tickets, statusFilter]);

  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTickets.slice(start, start + PAGE_SIZE);
  }, [filteredTickets, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "ticket-qr.png";
    link.click();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminTopNav />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1
              className="text-4xl font-black tracking-tight mb-2"
              style={{ color: "var(--accent-color)" }}
            >
              My Tickets
            </h1>
          </div>

          {/* Filter Dropdown */}
          <div className="mb-6 flex justify-end">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <option value="all">All</option>
              <option value="valid">Valid</option>
              <option value="used">Used</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Tickets Table */}
          <div
            className="rounded-xl border shadow-sm overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <table className="w-full">
              <thead
                className="border-b"
                style={{ borderColor: "var(--border-color)" }}
              >
                <tr className="text-left text-sm font-bold uppercase tracking-wider">
                  <th className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    Event
                  </th>
                  <th className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    Start
                  </th>
                  <th className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    End
                  </th>
                  <th className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    Location
                  </th>
                  <th className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    Status
                  </th>
                  <th className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    QR
                  </th>
                </tr>
              </thead>
              <tbody>
                {ticketsLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      Loading tickets...
                    </td>
                  </tr>
                ) : paginatedTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  paginatedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b hover:bg-gray-50/50 transition-colors"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/events?event=${ticket.event?.id || ticket.registration?.event?.id}`)
                          }
                          className="font-medium hover:underline"
                          style={{ color: "var(--accent-color)" }}
                        >
                          {ticket.event?.title_event || ticket.registration?.event?.title_event || "Unknown Event"}
                        </button>
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatDateTime(ticket.event?.start_datetime || ticket.registration?.event?.start_datetime)}
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {formatDateTime(ticket.event?.end_datetime || ticket.registration?.event?.end_datetime)}
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {ticket.event?.location || ticket.registration?.event?.location || "TBA"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            ticket.status === "valid"
                              ? "bg-green-100 text-green-700"
                              : ticket.status === "used"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setQrTicketId(ticket.id)}
                          className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          View QR
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  Prev
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* QR Modal */}
          {qrTicketId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
                <button
                  className="absolute top-3 right-3 text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setQrTicketId(null)}
                >
                  Close
                </button>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Your Ticket QR</h3>
                <div className="flex flex-col items-center gap-3" ref={qrRef}>
                  <QRCodeCanvas
                    value={(tickets.find((t) => t.id === qrTicketId)?.ticket_code) || ""}
                    size={200}
                    includeMargin
                  />
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Ticket code: {tickets.find((t) => t.id === qrTicketId)?.ticket_code}
                  </p>
                  <button
                    className="px-4 py-2 text-sm rounded bg-[var(--accent-color)] text-white font-semibold shadow hover:bg-[var(--accent-color)]/90"
                    onClick={handleDownloadQr}
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
