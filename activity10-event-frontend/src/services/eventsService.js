import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

export const getPublishedAndCompletedEvents = async () => {
  const { data } = await api.get("/events");

  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((event) => {
    const status = (event?.status || "").toLowerCase();
    return status === "published" || status === "completed";
  });
};

// Admin/all-users: fetch all events without status filtering
export const getAllEvents = async () => {
  const { data } = await api.get("/events");
  return Array.isArray(data) ? data : [];
};

export const findticketByCode = async (ticketCode) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/event-tickets/ticket-code/${ticketCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getEventCheckinsByTicketid = async (ticket_id) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/event-checkins/ticket-id/${ticket_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const createEventCheckin = async (checkinData) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/event-checkins", checkinData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateTicket = async (ticketId, updateData) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.patch(`/event-tickets/${ticketId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getEventCheckinsByScannedby = async (scanned_by) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/event-checkins/scanned-by/${scanned_by}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getAllCheckinsByEventId = async (event_id) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/event-checkins/event/${event_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const deleteAnnouncement = async (announcementId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.delete(`/event-announcements/${announcementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

