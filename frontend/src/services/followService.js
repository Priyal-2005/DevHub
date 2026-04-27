import api from "./api";

const unwrap = (response) => response.data?.data;

export const toggleFollow = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return unwrap(response);
};

export const getFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return unwrap(response);
};

export const getFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return unwrap(response);
};
