import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios.js";

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:3000" : "/";

async function authHeaders(getToken) {
  if (typeof getToken !== "function") return {};
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSyncingUser: false,
  onlineUsers: [],
  socket: null,

  // Verifies the signed-in Clerk session against MongoDB; syncs the profile if it doesn't exist yet.
  checkAuth: async (getToken) => {
    set({ isCheckingAuth: true });
    try {
      const headers = await authHeaders(getToken);
      const res = await axiosInstance.get("/auth/check", { headers });
      set({ authUser: res.data });
      get().connectSocket();
      return res.data;
    } catch (error) {
      if (error?.response?.status === 404) {
        return await get().syncUser(getToken);
      }
      set({ authUser: null });
      get().disconnectSocket();
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  syncUser: async (getToken) => {
    set({ isSyncingUser: true });
    try {
      const headers = await authHeaders(getToken);
      const res = await axiosInstance.post("/users/sync", {}, { headers });
      set({ authUser: res.data });
      get().connectSocket();
      return res.data;
    } catch (error) {
      console.error("Failed to sync Clerk user:", error);
      set({ authUser: null });
      return null;
    } finally {
      set({ isSyncingUser: false });
    }
  },

  clearAuth: () => {
    get().disconnectSocket();
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser?._id || socket) return;

    const newSocket = io(SOCKET_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));
