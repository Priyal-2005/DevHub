import api from "./api";

export const getFeed = async (params = {}) => {
  const response = await api.get("/feed", { params });
  return response.data;
};
