import api from "./api";

const unwrap = (response) => response.data?.data;

export const getFeed = async (params = {}) => {
  const response = await api.get("/feed", { params });
  return unwrap(response);
};
