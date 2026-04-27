import api from "./api";

const unwrap = (response) => response.data?.data;

export const addComment = async (payload) => {
  const response = await api.post("/comments", payload);
  return unwrap(response);
};
