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
            <col style={{ width: '30%' }} /> {/* Event Name */}
            <col style={{ width: '25%' }} /> {/* Organizer */}
            <col style={{ width: '10%' }} /> {/* Registrations */}
            <col style={{ width: '10%' }} /> {/* Checked-in */}
            <col style={{ width: '18%' }} /> {/* Date & Time */}
            <col style={{ width: '7%' }} /> {/* Actions */}
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-main)' }}>
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
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='text-left'>
            {events.map((event, index) => (
              <tr
                key={index}
                className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors"
              >
                <td className="px-4 py-3 ">
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{event.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 ">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
                      {event.organizer.charAt(0)}
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">{event.organizer}</span>
                  </div>
                </td>
                <td className="px-4 py-3 "><span className="text-sm text-[var(--text-primary)]">{event.registrations}</span></td>
                <td className="px-4 py-3 "><span className="text-sm text-[var(--text-primary)]">{event.checkedIn}</span></td>
                <td className="px-4 py-3 ">
                  <span className="text-sm text-[var(--text-primary)] block">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] block">
                    {new Date(event.date).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewAttendees(event.id)}
                      className="p-1.5 hover:bg-[var(--bg-main)] rounded transition-colors"
                      title="View Attendees"
                    >
                      <Users size={16} className="text-[var(--text-muted)]" />
                    </button>
                    <button
                      onClick={() => onExport(event.id)}
                      disabled={event.checkedIn === 0}
                      className={`p-1.5 rounded transition-colors ${
                        event.checkedIn === 0 
                          ? 'opacity-30 cursor-not-allowed' 
                          : 'hover:bg-[var(--bg-main)]'
                      }`}
                      title={event.checkedIn === 0 ? "No checked-in attendees to export" : "Export to Excel"}
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
