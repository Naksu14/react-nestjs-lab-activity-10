import React, { useState } from 'react';
import { ArrowLeft, FileDown, Loader } from 'lucide-react';

function EventAttendeesModal({ eventName, eventDate, eventStartTime, checkins = [], registrations = [], onClose }) {
  const [isExporting, setIsExporting] = useState(false);
  // Prepare attendee data from check-ins
  const attendees = checkins.map((checkin) => {
    // Get user from ticket.registration.user (as per backend relations)
    const user = checkin.ticket?.registration?.user;
    
    const name = user 
      ? `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || 'Unknown'
      : 'Unknown';
    const email = user?.email || 'N/A';
    
    return {
      name,
      email,
      status: checkin.scan_status || 'pending',
      checkedInAt: checkin.scan_time 
        ? new Date(checkin.scan_time).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
        : 'N/A',
    };
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const headers = ['Name', 'Email', 'Status', 'Checked In At'];
      const csvContent = [
        ['Event:', eventName],
        ['Date:', eventDate],
        ['Start Time:', eventStartTime],
        ['Total Attendees:', attendees.length],
        [],
        headers.join(','),
        ...attendees.map((attendee) =>
          [
            attendee.name,
            attendee.email,
            attendee.status,
            attendee.checkedInAt,
          ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${eventName}_attendees_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--bg-main)]">
      {/* Header with Back Button */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Event Attendees</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{eventName}</p>
        </div>
        {attendees.length > 0 && (
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--accent-color)",
              color: "#fff",
            }}
          >
            {isExporting ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown size={18} />
                <span>Export</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto p-8">
        {/* Event Info and Count */}
        <div className="mb-6 border-b border-[var(--border-color)] pb-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Event Date</p>
              <p className="text-lg font-medium text-[var(--text-primary)] mt-1">{eventDate}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Start Time</p>
              <p className="text-lg font-medium text-[var(--text-primary)] mt-1">{eventStartTime}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Total Attendees Checked In</p>
              <p className="text-lg font-medium text-[var(--text-primary)] mt-1">{attendees.length}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <colgroup>
                <col style={{ width: '30%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '25%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-main)' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Checked In At
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendees.length > 0 ? (
                  attendees.map((attendee, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-left">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{attendee.name}</p>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <p className="text-sm text-[var(--text-muted)]">{attendee.email}</p>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attendee.status.toLowerCase() === 'success'
                              ? 'bg-green-100 text-green-800'
                              : attendee.status.toLowerCase() === 'invalid'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <p className="text-sm text-[var(--text-muted)]">{attendee.checkedInAt}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <p className="text-[var(--text-muted)]">No attendees checked in for this event.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventAttendeesModal;
