import { createContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginRequest, register as registerRequest } from "../services/authService";
import {
  clearStoredToken,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    const syncAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUser(currentUser);
        setStoredUser(currentUser);
      } catch (error) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    syncAuth();
  }, [token]);

  const saveAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setStoredToken(nextToken);
    setStoredUser(nextUser);
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    clearStoredToken();
    clearStoredUser();
  };

  const login = async (payload) => {
    const data = await loginRequest(payload);
    saveAuth(data.token, data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    saveAuth(data.token, data.user);
    return data;
  };

  const completeGoogleAuth = async (nextToken, nextUser) => {
    saveAuth(nextToken, nextUser);

    if (!nextUser) {
      const currentUser = await getMe();
      setUser(currentUser);
      setStoredUser(currentUser);
      return currentUser;
    }

    return nextUser;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      logout: clearAuth,
      completeGoogleAuth,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
