import api from "./api";

const unwrap = (response) => response.data?.data;

export const getProfile = async (userId) => {
  const response = await api.get(`/profile/${userId}`);
  return unwrap(response);
};

export const upsertProfile = async (payload) => {
  const response = await api.post("/profile", payload);
  return unwrap(response);
};
