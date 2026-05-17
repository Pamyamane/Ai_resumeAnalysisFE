import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-resume-analysis-be.vercel.app/api",
  withCredentials: true,
});

// Send token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post("/auth/register", { username, email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // ← save token
    }
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // ← save token
    }
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/auth/logout");
    localStorage.removeItem("token"); // ← clear token
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getuser = async () => {
  try {
    const response = await api.get("/auth/get-me");
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};