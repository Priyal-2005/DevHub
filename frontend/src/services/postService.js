import api from "./api";

export const createPost = async (payload) => {
  const response = await api.post("/posts", payload);
  return response.data;
};

export const getPosts = async (params = {}) => {
  const response = await api.get("/posts", { params });
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await api.post("/like", { postId });
  return response.data;
};
