import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});

export const createEvent = async (eventData) => {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();

  // Append all scalar fields
  Object.entries(eventData).forEach(([key, value]) => {
    if (key === "image") return; // handled separately
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // Append image file as "eventImage" for the backend
  if (eventData.image) {
    formData.append("eventImage", eventData.image);
  }

  const { data } = await api.post("/events", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getAllEventsByOrganizer = async () => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get("/events/organizer", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const getAnnouncementsByEvent = async (eventId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/event-announcements/event/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const createAnnouncement = async (announcementData) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/event-announcements", announcementData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};


export const updateEvent = async (eventId, eventData) => {
  const token = localStorage.getItem("authToken");
  const formData = new FormData();
  // Append all scalar fields
  Object.entries(eventData).forEach(([key, value]) => {
    if (key === "image") return; // handled separately
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // Append image file as "eventImage" for the backend
  if (eventData.image) {
    formData.append("eventImage", eventData.image);
  }
  const { data } = await api.patch(`/events/${eventId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteEvent = async (eventId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.delete(`/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
