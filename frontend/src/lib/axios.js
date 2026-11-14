import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:3000/api"
    : `${import.meta.env.VITE_RENDER_BACKEND_API_URL}/api`,

  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== "undefined" && window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Failed to attach Clerk token to request:", error);
  }
  return config;
});
