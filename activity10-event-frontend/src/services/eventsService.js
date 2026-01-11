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
