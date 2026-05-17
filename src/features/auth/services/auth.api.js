import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-resume-analysis-be.vercel.app",
  withCredentials: true,
});

export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/auth/logout");

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
