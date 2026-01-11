import React, { useMemo, useState } from 'react';
import AdminTopNav from '../../../components/adminSide/AdminTopNav';
import AdminSidebar from '../../../components/adminSide/AdminSidebar';
import ReportsHeader from '../../../components/adminSide/ReportsHeader';
import ReportsFilters from '../../../components/adminSide/ReportsFilters';
import ReportsStats from '../../../components/adminSide/ReportsStats';
import ReportsTable from '../../../components/adminSide/ReportsTable';
import EventAttendeesModal from '../../../components/adminSide/EventAttendeesModal';
import { useQuery } from '@tanstack/react-query';
import { fetchAllEvents, fetchAllRegistrations, fetchAllCheckins, buildAttendanceReport } from '../../../services/reportsService';

function EventReportsPage() {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [organizer, setOrganizer] = useState('all');
  const [status, setStatus] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  // Fetch raw datasets
  const { data: events = [] } = useQuery({ queryKey: ['reports-events'], queryFn: fetchAllEvents });
  const { data: registrations = [] } = useQuery({ queryKey: ['reports-registrations'], queryFn: fetchAllRegistrations });
  const { data: checkins = [] } = useQuery({ queryKey: ['reports-checkins'], queryFn: fetchAllCheckins });

  // Build report with current filters
  const { rows, summary } = useMemo(() => buildAttendanceReport({
    events,
    registrations,
    checkins,
    filters: { startDate: dateRange.startDate, endDate: dateRange.endDate, organizerId: organizer, status: status || 'all' },
  }), [events, registrations, checkins, dateRange, organizer, status]);

  // Derive status options dynamically from events
  const statusOptions = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => {
      const s = (ev?.status ?? '').toString().toLowerCase();
      if (s) set.add(s);
    });
    return Array.from(set);
  }, [events]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleOrganizerChange = (org) => {
    setOrganizer(org);
  };

  const handleStatusChange = (stat) => {
    setStatus(stat);
  };

  // Organizer event counts (respect date range + status filters)
  const organizerCounts = useMemo(() => {
    const counts = new Map();
    const inRange = (date) => {
      if (!date) return true;
      const d = new Date(date).getTime();
      const s = dateRange.startDate ? new Date(dateRange.startDate).getTime() : null;
      const e = dateRange.endDate ? new Date(dateRange.endDate).getTime() : null;
      if (s && d < s) return false;
      if (e && d > e) return false;
      return true;
    };
    const statusMatches = (evStatus) => {
      if (!status || status === 'all') return true;
      return String(evStatus).toLowerCase() === String(status).toLowerCase();
    };
    const filtered = events.filter((ev) => inRange(ev.start_datetime) && statusMatches(ev.status));
    for (const ev of filtered) {
      const orgId = ev.organizer?.id ?? ev.organizer_id ?? 'unknown';
      counts.set(orgId, (counts.get(orgId) || 0) + 1);
    }
    return counts;
  }, [events, dateRange, status]);

  const totalEventsCount = useMemo(() => {
    const inRange = (date) => {
      if (!date) return true;
      const d = new Date(date).getTime();
      const s = dateRange.startDate ? new Date(dateRange.startDate).getTime() : null;
      const e = dateRange.endDate ? new Date(dateRange.endDate).getTime() : null;
      if (s && d < s) return false;
      if (e && d > e) return false;
      return true;
    };
    const statusMatches = (evStatus) => {
      if (!status || status === 'all') return true;
      return String(evStatus).toLowerCase() === String(status).toLowerCase();
    };
    return events.filter((ev) => inRange(ev.start_datetime) && statusMatches(ev.status)).length;
  }, [events, dateRange, status]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <AdminTopNav />
          
          {/* Page Content */}
          {showAttendeesModal && selectedEventId ? (
            <EventAttendeesModal
              eventName={events.find((e) => e.id === selectedEventId)?.title_event || 'Event'}
              eventDate={
                events.find((e) => e.id === selectedEventId)
                  ? new Date(events.find((e) => e.id === selectedEventId).start_datetime).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : ''
              }
              eventStartTime={
                events.find((e) => e.id === selectedEventId)
                  ? new Date(events.find((e) => e.id === selectedEventId).start_datetime).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })
                  : ''
              }
              registrations={registrations.filter((r) => (r.event?.id ?? r.event_id) === selectedEventId)}
              onClose={() => {
                setShowAttendeesModal(false);
                setSelectedEventId(null);
              }}
            />
          ) : (
            <div className="p-8">
              {/* Header with Export Buttons */}
              <ReportsHeader />
              
              {/* Filters */}
              <ReportsFilters 
                onDateRangeChange={handleDateRangeChange}
                onOrganizerChange={handleOrganizerChange}
                onStatusChange={handleStatusChange}
                statusOptions={statusOptions}
                organizerCounts={organizerCounts}
                totalEventsCount={totalEventsCount}
              />
              
              {/* Stats Cards */}
              <ReportsStats summary={summary} />
              
              {/* Events Table */}
              <div className="mt-8">
                <ReportsTable 
                  rows={rows}
                  onViewAttendees={(eventId) => {
                    setSelectedEventId(eventId);
                    setShowAttendeesModal(true);
                  }}
                  onExport={(eventId) => {
                    const event = events.find((e) => e.id === eventId);
                    const eventRegs = registrations.filter((r) => (r.event?.id ?? r.event_id) === eventId);
                    
                    if (!event) return;

                    // Prepare CSV data
                    const headers = ['Name', 'Email', 'Status', 'Registered At'];
                    const data = eventRegs.map((reg) => [
                      `${reg.user?.firstname || ''} ${reg.user?.lastname || ''}`.trim() || reg.user?.email || 'Unknown',
                      reg.user?.email || 'N/A',
                      reg.registration_status || 'Pending',
                      new Date(reg.created_at).toLocaleString(),
                    ]);

                    // Create CSV content
                    const csvContent = [
                      ['Event:', event.title_event],
                      ['Date:', new Date(event.start_datetime).toLocaleString()],
                      ['Total Attendees:', data.length],
                      [],
                      headers,
                      ...data,
                    ]
                      .map((row) => row.map((cell) => `"${cell}"`).join(','))
                      .join('\n');

                    // Download CSV
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${event.title_event}_attendance.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventReportsPage;