import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  // Core chat data
  users: [],
  conversations: [],
  messages: [],

  // Selected chat target (user object)
  selectedConversation: null,
  selectedUser: null,
  activeConversationId: null,

  // Loading indicators
  isConversationLoading: false,
  isUserLoading: false,
  isMessageLoading: false,
  isSendingMessage: false,
  isSendingMedia: false,

  // UI & sidebar state
  searchQuery: "",
  sidebarTab: "chats", // "chats" | "contacts"
  composerText: "",
  isSoundEnabled: true,

  // UI state setters
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSidebarTab: (sidebarTab) => set({ sidebarTab }),
  setComposerText: (composerText) => set({ composerText }),
  setIsSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  // Fetch all registered users for new chats
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to load users";
      toast.error(errorMsg);
      return [];
    } finally {
      set({ isUserLoading: false });
    }
  },

  // Fetch users with existing conversations, ordered by latest message
  getConversations: async () => {
    set({ isConversationLoading: true });
    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({ conversations: res.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to load conversations";
      toast.error(errorMsg);
      return [];
    } finally {
      set({ isConversationLoading: false });
    }
  },

  // Fetch message history with a specific user
  getMessages: async (userId) => {
    const targetId = userId || get().selectedConversation?._id;
    if (!targetId) return [];

    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${targetId}`);
      set({ messages: res.data || [] });
      return res.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to load messages";
      toast.error(errorMsg);
      return [];
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // Set the active conversation/user and load their message history
  setSelectedConversation: (user) => {
    const current = get().selectedConversation;
    if (current?._id === user?._id && user !== null) return;

    set({
      selectedConversation: user,
      selectedUser: user,
      activeConversationId: user?._id || null,
      messages: [],
    });

    if (user?._id) {
      get().getMessages(user._id);
    }
  },

  // Alias for setSelectedConversation
  setSelectedUser: (user) => {
    get().setSelectedConversation(user);
  },

  // Send a text message and/or media file to the selected user
  sendMessage: async (messageData) => {
    const { selectedConversation, messages, conversations } = get();
    if (!selectedConversation?._id) return;

    set({ isSendingMessage: true });
    try {
      let payload = messageData;
      let headers = {};

      if (messageData instanceof FormData) {
        payload = messageData;
        headers["Content-Type"] = "multipart/form-data";
      } else if (typeof messageData === "string") {
        payload = { text: messageData };
      } else if (messageData && typeof messageData === "object") {
        const file = messageData.file || messageData.media;
        if (file) {
          const formData = new FormData();
          if (messageData.text) formData.append("text", messageData.text);
          formData.append("media", file);
          payload = formData;
          headers["Content-Type"] = "multipart/form-data";
        } else {
          payload = { text: messageData.text || "" };
        }
      }

      const res = await axiosInstance.post(
        `/messages/${selectedConversation._id}`,
        payload,
        { headers }
      );

      const newMessage = res.data;
      set({
        messages: [...messages, newMessage],
        composerText: "",
      });

      // Move or prepend this conversation to the top of the conversations list
      const existing = conversations.find((c) => c._id === selectedConversation._id);
      const conversationUser = existing || selectedConversation;
      const filtered = conversations.filter((c) => c._id !== selectedConversation._id);
      set({ conversations: [conversationUser, ...filtered] });

      return newMessage;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
      throw error;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  // Sends the current composer text to the specified conversation
  sendTextMessage: async (conversationId) => {
    const targetId = conversationId || get().activeConversationId || get().selectedConversation?._id;
    const text = get().composerText.trim();
    if (!targetId || !text) return null;

    try {
      return await get().sendMessage(text);
    } catch {
      return null;
    }
  },

  // Sends an image or video file attachment to the specified conversation
  sendMediaMessage: async ({ conversationId, file }) => {
    const targetId = conversationId || get().activeConversationId || get().selectedConversation?._id;
    if (!targetId || !file) return null;

    set({ isSendingMedia: true });
    try {
      return await get().sendMessage({ file });
    } catch {
      return null;
    } finally {
      set({ isSendingMedia: false });
    }
  },

  // Real-time socket subscription for incoming messages
  subscribeToMessages: (chatId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedConversation, activeConversationId, messages, isSoundEnabled, conversations, users } = get();
      const authUser = useAuthStore.getState().authUser;
      const targetId = chatId || activeConversationId || selectedConversation?._id;

      const isCurrentChat =
        targetId &&
        (newMessage.senderId === targetId || newMessage.receiverId === targetId);

      if (isCurrentChat) {
        const alreadyExists = messages.some((m) => m._id === newMessage._id);
        if (!alreadyExists) {
          set({ messages: [...messages, newMessage] });
        }
      }

      // Play notification sound for incoming message
      if (isSoundEnabled && newMessage.senderId !== authUser?._id) {
        try {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play().catch(() => {});
        } catch {
          // Ignore audio errors if audio file missing or autoplay restricted
        }
      }

      // Reorder conversations list to show newest on top
      const partnerId =
        newMessage.senderId === authUser?._id ? newMessage.receiverId : newMessage.senderId;
      const existing = conversations.find((c) => c._id === partnerId);
      if (existing) {
        const remaining = conversations.filter((c) => c._id !== partnerId);
        set({ conversations: [existing, ...remaining] });
      } else {
        const userObj = users.find((u) => u._id === partnerId);
        if (userObj) {
          set({ conversations: [userObj, ...conversations] });
        }
      }
    });
  },

  // Clean up socket listener
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
}));
