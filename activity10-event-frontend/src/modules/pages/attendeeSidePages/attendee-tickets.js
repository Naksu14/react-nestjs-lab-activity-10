import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "../../../components/Header";
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

const AttendeeTickets = () => {
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
    setCurrentPage(1);
  }, [statusFilter]);

  const isLoading = userLoading || ticketsLoading;

  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "ticket-qr.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-white text-left">
      <Header />

      <section className="pt-[96px] max-w-6xl mx-auto px-4 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="text-2xl font-bold text-[var(--accent-color)]">
            My Tickets
          </h1>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          >
            <option value="all">All</option>
            <option value="valid">Valid</option>
            <option value="used">Used</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading tickets…</p>
        ) : filteredTickets.length === 0 ? (
          <p className="text-gray-500">No tickets found.</p>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Start</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">QR</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {paginatedTickets.map((ticket) => {
                    const event = ticket.event || {};
                    const status = ticket.status || "unknown";

                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-[var(--accent-color)] truncate">
                          {event.title_event || event.title || "Untitled Event"}
                        </td>

                        <td className="px-4 py-3">
                          {formatDateTime(event.start_datetime)}
                        </td>

                        <td className="px-4 py-3">
                          {formatDateTime(event.end_datetime)}
                        </td>

                        <td className="px-4 py-3 truncate">
                          {event.location || "TBA"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                              ${
                                status === "valid"
                                  ? "bg-green-100 text-green-700"
                                  : status === "used"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td
                          className="px-4 py-3"
                        >
                          <button
                            className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
                            onClick={() => setQrTicketId(ticket.id)}
                          >
                            View QR
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {qrTicketId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setQrTicketId(null)}
            >
              Close
            </button>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Your Ticket QR</h3>
            <div className="flex flex-col items-center gap-3" ref={qrRef}>
              <QRCodeCanvas value={tickets.find((t) => t.id === qrTicketId)?.ticket_code || ""} size={200} includeMargin />
              <p className="text-xs text-gray-500">Ticket code: {tickets.find((t) => t.id === qrTicketId)?.ticket_code}</p>
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
    </div>
  );
};

export default AttendeeTickets;
