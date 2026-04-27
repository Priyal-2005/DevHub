import api from "./api";

export const toggleFollow = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const getFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};
