import React from 'react';
import { Copy, RefreshCw, MoreVertical } from 'lucide-react';

function ReportsTable() {
  const events = [
    { name: 'Tech Conference 2024', organizer: 'Sarah Johnson', registrations: 263, checkedIn: 997, noShows: 822, date: 'Apr 15, 2024' },
    { name: 'Startup Expo 2024', organizer: 'Emily Carter', registrations: 2221, checkedIn: 225, noShows: 3251, date: 'Apr 19, 2024' },
    { name: 'Charity Gala', organizer: 'Emily Carter', registrations: 213, checkedIn: 232, noShows: 527, date: 'Apr 15, 2024' },
    { name: 'Music Festival 2024', organizer: 'Sophia Lee', registrations: 249, checkedIn: 268, noShows: 1473, date: 'Apr 19, 2024' },
    { name: 'Health & Wellness Summit', organizer: 'Sophia', registrations: 292, checkedIn: 263, noShows: 1042, date: 'Apr 15, 2024' },
    { name: 'Art & Food Fair', organizer: 'Laura Wilson', registrations: 553, checkedIn: 444, noShows: 1625, date: 'Apr 19, 2024' },
    { name: 'Networking Night', organizer: 'James Miller', registrations: 646, checkedIn: 222, noShows: 7211, date: 'Apr 15, 2024' },
    { name: 'Web Dev Workshop', organizer: 'Daniel Martinez', registrations: 560, checkedIn: 237, noShows: 1288, date: 'May 20, 2024' }
  ];

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[var(--text-muted)]">Event:</label>
          <select className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer">
            <option>All Events</option>
          </select>
          <select className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] cursor-pointer">
            <option>All Organizers</option>
          </select>
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search Event..."
              className="pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] w-full"
            />
          </div>
        </div>
      </div>

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
                    <button className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors" title="Active">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors" title="Copy">
                      <Copy size={14} className="text-[var(--text-muted)]" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors" title="Refresh">
                      <RefreshCw size={14} className="text-[var(--text-muted)]" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors" title="More">
                      <MoreVertical size={14} className="text-[var(--text-muted)]" />
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
