import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Axios adds the saved login token to every request.
const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error) {
  return error.response?.data?.message || "Could not reach the server. Please try again.";
}

export default api;
