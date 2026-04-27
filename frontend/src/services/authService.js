import api from "./api";

const unwrap = (response) => response.data?.data;

export const register = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return unwrap(response);
};

export const login = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return unwrap(response);
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return unwrap(response);
};
