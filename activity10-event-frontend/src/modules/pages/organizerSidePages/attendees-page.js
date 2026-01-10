import React, { useMemo, useState } from "react";
import Sidebar from "../../../components/organizer/sideBar";
import NavBar from "../../../components/organizer/navBar";
import {
  Search,
  FileDown,
  User,
  Mail,
  Ticket,
  Clock,
  Filter,
} from "lucide-react";

const Attendees = () => {
  const [attendees, setAttendees] = useState([
    {
      id: 1,
      firstname: "Alice",
      lastname: "Walker",
      email: "alice@example.com",
      ticket_code: "b1a7-4f6a",
      registration_status: "registered",
      registered_at: "2026-01-02T10:15:00Z",
    },
    {
      id: 2,
      firstname: "Bob",
      lastname: "Smith",
      email: "bob@example.com",
      ticket_code: "c9d2-88aa",
      registration_status: "checked-in",
      registered_at: "2026-01-04T14:30:00Z",
    },
  ]);

  const [query, setQuery] = useState("");

  const [hoverRow, setHoverRow] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter((a) => {
      return (
        `${a.firstname} ${a.lastname}`.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.ticket_code || "").toLowerCase().includes(q)
      );
    });
  }, [attendees, query]);

  // Modernized CSV logic with proper cleanup
  const handleExport = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Ticket Code",
      "Status",
      "Registered At",
    ];
    const csvContent = [
      headers.join(","),
      ...filtered.map((r) =>
        [
          r.firstname,
          r.lastname,
          r.email,
          r.ticket_code,
          r.registration_status,
          r.registered_at,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `attendees_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <div className="ml-[17rem] flex-1 flex flex-col">
        <NavBar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                Attendee List
              </h1>
              <p
                className="mt-2 font-medium flex items-center"
                style={{ color: "var(--text-muted)" }}
              >
                Total Registrants:{" "}
                <span
                  className="ml-2 font-bold"
                  style={{ color: "var(--accent-color)" }}
                >
                  {attendees.length}
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold transition-all active:scale-95"
                style={{
                  backgroundColor: "var(--accent-color)",
                  color: "#fff",
                  borderColor: "var(--accent-color)",
                }}
              >
                <FileDown size={18} className="text-white" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

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
            <button
              className="p-3 rounded-2xl transition-colors"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              <Filter size={20} style={{ color: "var(--text-muted)" }} />
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
                      Ticket Details
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
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      className="group transition-colors"
                      onMouseEnter={() => setHoverRow(a.id)}
                      onMouseLeave={() => setHoverRow(null)}
                      style={{
                        backgroundColor:
                          hoverRow === a.id
                            ? "var(--row-hover)"
                            : "transparent",
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
                            {a.firstname[0]}
                            {a.lastname[0]}
                          </div>
                          <div>
                            <p
                              className="font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {a.firstname} {a.lastname}
                            </p>
                            <p
                              className="text-xs flex items-center mt-0.5"
                              style={{ color: "var(--text-muted)" }}
                            >
                              <Mail
                                size={12}
                                style={{
                                  marginRight: 6,
                                  color: "var(--text-muted)",
                                }}
                              />{" "}
                              {a.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div
                          className="flex items-center text-sm font-mono w-fit px-2 py-1 rounded-lg"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            color: "var(--text-muted)",
                          }}
                        >
                          <Ticket
                            size={14}
                            style={{
                              marginRight: 8,
                              color: "var(--accent-color)",
                            }}
                          />
                          {a.ticket_code}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {(() => {
                          const checked =
                            a.registration_status === "checked-in";
                          const badgeStyle = {
                            backgroundColor: checked
                              ? "var(--status-checked-bg)"
                              : "var(--status-registered-bg)",
                            color: checked
                              ? "var(--status-checked-text)"
                              : "var(--status-registered-text)",
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            borderRadius: 9999,
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            textTransform: "uppercase",
                          };
                          const dotStyle = {
                            width: 6,
                            height: 6,
                            borderRadius: 6,
                            marginRight: 8,
                            backgroundColor: checked
                              ? "var(--status-checked-dot)"
                              : "var(--status-registered-dot)",
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
        </main>
      </div>
    </div>
  );
};

export default Attendees;
