import api from "./api";

export const getProfile = async (userId) => {
  const response = await api.get(`/profile/${userId}`);
  return response.data;
};

export const upsertProfile = async (payload) => {
  const response = await api.post("/profile", payload);
  return response.data;
};
