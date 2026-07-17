import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getStoredAccess, setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const access = getStoredAccess();
    if (!access) {
      setUser(null);
      setLoading(false);
      return;
    }
    setAuthToken(access);
    try {
      const { data } = await api.get("/users/me/");
      setUser(data);
    } catch {
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/token/", { email, password });
    localStorage.setItem("refresh", data.refresh);
    setAuthToken(data.access);
    const me = await api.get("/users/me/");
    setUser(me.data);
    return me.data;
  }, []);

  const register = useCallback(async (payload) => {
    await api.post("/users/register/", payload);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem("refresh");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      refreshUser: loadMe,
    }),
    [user, loading, login, register, logout, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
