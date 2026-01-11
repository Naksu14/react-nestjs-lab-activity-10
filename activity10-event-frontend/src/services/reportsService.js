import { api } from "./eventsService";

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchAllEvents = async () => {
  const { data } = await api.get("/events", { headers: getAuthHeader() });
  return Array.isArray(data) ? data : [];
};

export const fetchAllRegistrations = async () => {
  const { data } = await api.get("/event-registrations", { headers: getAuthHeader() });
  return Array.isArray(data) ? data : [];
};

export const fetchAllCheckins = async () => {
  const { data } = await api.get("/event-checkins", { headers: getAuthHeader() });
  return Array.isArray(data) ? data : [];
};

// Helper to aggregate per-event stats
export const buildAttendanceReport = ({ events = [], registrations = [], checkins = [], filters = {} }) => {
  const { startDate, endDate, organizerId, status } = filters;

  const inRange = (date) => {
    if (!date) return true;
    const d = new Date(date).getTime();
    const s = startDate ? new Date(startDate).getTime() : null;
    const e = endDate ? new Date(endDate).getTime() : null;
    if (s && d < s) return false;
    if (e && d > e) return false;
    return true;
  };

  const statusMatches = (evStatus) => {
    if (!status || status === "all") return true;
    return String(evStatus).toLowerCase() === String(status).toLowerCase();
  };

  const organizerMatches = (org) => {
    if (!organizerId || organizerId === "all") return true;
    const id = org?.id ?? org;
    return Number(id) === Number(organizerId);
  };

  // Filter events
  const filteredEvents = events.filter((ev) => inRange(ev.start_datetime) && statusMatches(ev.status) && organizerMatches(ev.organizer));

  // Index registrations per event
  const regsByEvent = new Map();
  for (const r of registrations) {
    const evId = r.event?.id ?? r.event_id;
    if (!evId) continue;
    if (!inRange(r.created_at || r.updated_at || r.event?.start_datetime)) continue;
    const arr = regsByEvent.get(evId) || [];
    arr.push(r);
    regsByEvent.set(evId, arr);
  }

  // Index checkins per event
  const checksByEvent = new Map();
  for (const c of checkins) {
    const evId = c.event?.id ?? c.event_id;
    if (!evId) continue;
    if (!inRange(c.scan_time)) continue;
    const arr = checksByEvent.get(evId) || [];
    arr.push(c);
    checksByEvent.set(evId, arr);
  }

  const rows = filteredEvents.map((ev) => {
    const evId = ev.id;
    const regs = (regsByEvent.get(evId) || []).filter((r) => String(r.registration_status).toLowerCase() === "registered");
    const checks = (checksByEvent.get(evId) || []).filter((c) => String(c.scan_status).toLowerCase() === "success");
    const registrationsCount = regs.length;
    const checkedInCount = checks.length;
    const noShowsCount = Math.max(registrationsCount - checkedInCount, 0);
    return {
      id: ev.id,
      name: ev.title_event,
      organizer: `${ev.organizer?.firstname ?? ""} ${ev.organizer?.lastname ?? ""}`.trim() || ev.organizer?.email || "Unknown",
      registrations: registrationsCount,
      checkedIn: checkedInCount,
      noShows: noShowsCount,
      date: ev.start_datetime,
      status: ev.status,
    };
  });

  const summary = {
    eventsCreated: filteredEvents.length,
    registeredAttendees: registrations.filter((r) => filteredEvents.some((ev) => (r.event?.id ?? r.event_id) === ev.id) && String(r.registration_status).toLowerCase() === "registered").length,
    totalCheckins: checkins.filter((c) => filteredEvents.some((ev) => (c.event?.id ?? c.event_id) === ev.id) && String(c.scan_status).toLowerCase() === "success").length,
    noShows: rows.reduce((acc, row) => acc + row.noShows, 0),
  };

  return { rows, summary };
};
