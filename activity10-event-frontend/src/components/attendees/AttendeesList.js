import React, { useMemo, useState } from "react";
import { Search, FileDown, User, Clock, Filter } from "lucide-react";

const AttendeesList = ({
  attendees = [],
  isLoading = false,
  isError = false,
  onExport,
}) => {
  const [query, setQuery] = useState("");
  const [hoverRow, setHoverRow] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const uniqueEvents = useMemo(() => {
    const map = new Map();
    attendees.forEach((a) => {
      const ev = a.event;
      if (ev && !map.has(ev.id)) {
        map.set(ev.id, ev.title_event || `Event #${ev.id}`);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [attendees]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return attendees.filter((a) => {
      const user = a.user || {};
      const ev = a.event || {};

      const matchesQuery = q
        ? `${user.firstname || ""} ${user.lastname || ""}`
            .toLowerCase()
            .includes(q) ||
          (user.email || "").toLowerCase().includes(q) ||
          (a.ticket_code || "").toLowerCase().includes(q)
        : true;

      const matchesEvent = selectedEventId
        ? String(ev.id) === String(selectedEventId)
        : true;

      const matchesStatus = status ? a.registration_status === status : true;

      const regDate = a.registered_at ? new Date(a.registered_at) : null;
      const matchesStart = startDate && regDate ? regDate >= new Date(startDate) : true;
      const matchesEnd = endDate && regDate ? regDate <= new Date(endDate) : true;

      return (
        matchesQuery &&
        matchesEvent &&
        matchesStatus &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [attendees, query, selectedEventId, status, startDate, endDate]);

  const handleExport = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Status",
      "Registered At",
      "Event",
    ];
    const csvContent = [
      headers.join(","),
      ...filtered.map((r) =>
        [
          r.user?.firstname || "",
          r.user?.lastname || "",
          r.user?.email || "",
          r.registration_status || "",
          r.registered_at || "",
          (r.event?.title_event || (r.event?.id ? `Event #${r.event.id}` : "")) || "",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const eventSuffix = selectedEventId
      ? `_event_${selectedEventId}`
      : "";
    link.setAttribute("download", `attendees${eventSuffix}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p style={{ color: "var(--text-muted)" }}>Loading attendees...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">Failed to load attendees.</p>
      </div>
    );
  }

  return (
    <>
      {/* Controls Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
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
            placeholder="Search name, email, or ticket code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl py-3 pl-12 pr-4 focus:ring-2 outline-none transition-all text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="rounded-2xl py-3 px-4 text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <option value="">All Events</option>
            {uniqueEvents.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl py-3 px-4 text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <option value="">All Status</option>
            {/* derive status options from data */}
            {Array.from(
              new Set(attendees.map((a) => a.registration_status).filter(Boolean))
            ).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-2xl py-3 px-3 text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
          <span style={{ color: "var(--text-muted)" }}>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-2xl py-3 px-3 text-sm"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold transition-all active:scale-95"
          style={{
            backgroundColor: "var(--accent-color)",
            color: "#fff",
          }}
        >
          <FileDown size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Table Container */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th
                  className="px-6 py-5 text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Attendee
                </th>
                <th
                  className="px-6 py-5 text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email
                </th>
                <th
                  className="px-6 py-5 text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-5 text-[11px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((a, idx) => (
                <tr
                  key={a.id}
                  className="group transition-colors"
                  onMouseEnter={() => setHoverRow(a.id)}
                  onMouseLeave={() => setHoverRow(null)}
                  style={{
                    backgroundColor:
                      idx % 2 === 0
                        ? "transparent"
                        : "var(--table-body)",
                  }}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--accent-color)",
                        }}
                      >
                        {a.user?.firstname?.[0]}
                        {a.user?.lastname?.[0]}
                      </div>
                      <div>
                        <p
                          className="font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {a.user?.firstname} {a.user?.lastname}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {a.user?.email}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    {(() => {
                      const isCancelled = a.registration_status === "cancelled";
                      const badgeStyle = {
                        backgroundColor: isCancelled
                          ? "#fee2e2"
                          : "#f5f0ff",
                        color: isCancelled ? "#b91c1c" : "#7c3aed",
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: 9999,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        textTransform: "capitalize",
                      };
                      const dotStyle = {
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        marginRight: 8,
                        backgroundColor: isCancelled ? "#b91c1c" : "#7c3aed",
                        display: "inline-block",
                      };
                      return (
                        <span style={badgeStyle}>
                          <span style={dotStyle} />
                          {a.registration_status}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-5">
                    <div
                      className="text-sm flex items-center"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Clock
                        size={14}
                        style={{
                          marginRight: 8,
                          color: "var(--text-muted)",
                        }}
                      />
                      {new Date(a.registered_at).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div
              className="inline-flex p-4 rounded-full mb-4"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-muted)",
              }}
            >
              <User size={32} />
            </div>
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              No attendees found
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Try adjusting your search query.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendeesList;
