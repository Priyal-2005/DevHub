import api from "./api";

const unwrap = (response) => response.data?.data;

export const createPost = async (payload) => {
  const response = await api.post("/posts", payload);
  return unwrap(response);
};

export const getPosts = async (params = {}) => {
  const response = await api.get("/posts", { params });
  return unwrap(response);
};

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return unwrap(response);
};

export const toggleLike = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return unwrap(response);
};
