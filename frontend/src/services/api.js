import axios from "axios";
import { getStoredToken } from "../utils/storage";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
