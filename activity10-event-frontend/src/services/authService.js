import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// LOGIN
export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);

  const accessToken = data?.accessToken;

  if (!accessToken) {
    throw new Error("No access token returned from server");
  }

  // Store token for guards and future API calls
  localStorage.setItem("authToken", accessToken);

  // Decode JWT to extract role from payload
  let role = null;
  try {
    const payloadBase64 = accessToken.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    role = payload.role || null;
  } catch (err) {
    console.error("Failed to decode JWT payload", err);
  }

  return { accessToken, role };
};

// GET CURRENT USER FUNCTION
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");

  if (!token || token.split(".").length !== 3) {
    return null;
  }
  try {
    const { data } = await api.get(`/event-users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

// REGISTER NEW USER
export const createNewUser = async (userInfo) => {
  const { data } = await api.post("/event-users", userInfo);
  return data;
};

