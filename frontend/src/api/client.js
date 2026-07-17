import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("access", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
}

export function getStoredAccess() {
  return localStorage.getItem("access");
}

export function getStoredRefresh() {
  return localStorage.getItem("refresh");
}

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("access");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh,
          });
          localStorage.setItem("access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          // fall through
        }
      }
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return Promise.reject(error);
  },
);
