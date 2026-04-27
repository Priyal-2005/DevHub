import axios from "axios";
import { getStoredToken } from "../utils/storage";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export const setApiAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

setApiAuthToken(getStoredToken());

export default api;
