import React from 'react';
import { Users, Download } from 'lucide-react';

function ReportsTable({ rows = [], onViewAttendees = () => {}, onExport = () => {} }) {
  const events = rows;

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <colgroup>
            <col style={{ width: '3%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-main)' }}>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded border-[var(--border-color)]" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Registrations
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Checked-in
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                No-shows
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded border-[var(--border-color)]" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{event.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
                      {event.organizer.charAt(0)}
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">{event.organizer}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{event.registrations}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{event.checkedIn}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{event.noShows}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{event.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewAttendees(event.id)}
                      className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors"
                      title="View Attendees"
                    >
                      <Users size={16} className="text-[var(--text-muted)]" />
                    </button>
                    <button
                      onClick={() => onExport(event.id)}
                      className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors"
                      title="Export to Excel"
                    >
                      <Download size={16} className="text-[var(--text-muted)]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsTable;
