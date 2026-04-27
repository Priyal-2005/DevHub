const TOKEN_KEY = "devhub_token";
const USER_KEY = "devhub_user";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  const value = localStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
};

export const setStoredUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};
