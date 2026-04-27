import api from "./api";

export const addComment = async (payload) => {
  const response = await api.post("/comment", payload);
  return response.data;
};
