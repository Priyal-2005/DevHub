import api from "./api";

const unwrap = (response) => response.data?.data;

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return unwrap(response);
};
