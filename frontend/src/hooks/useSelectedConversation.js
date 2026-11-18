import { useCallback } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useMediaQuery } from "./useMediaquery.js";

/**
 * Transforms a raw User object (from `/users` or Clerk) into a standardized
 * Conversation object containing status flags like `isOnline`, avatar fallback, and metadata.
 */
export function formatUserAsConversation(user, onlineUsers = [], conversations = []) {
  if (!user) return null;

  const userId = String(user._id || user.id || "");
  const isOnline = Boolean(
    userId && onlineUsers.some((onlineId) => String(onlineId) === userId)
  );

  const existingConv = conversations.find((c) => {
    const cId = String(c._id || c.id || "");
    const cUserId = String(c.user?._id || c.user?.id || "");
    return cId === userId || cUserId === userId;
  });

  return {
    ...user,
    _id: user._id || user.id,
    fullname: user.fullname || user.name || "User",
    email: user.email || "",
    profilePic: user.profilePic || "",
    isOnline,
    lastMessage: existingConv?.lastMessage || null,
    lastMessageAt: existingConv?.lastMessageAt || user.updatedAt || null,
  };
}

/**
 * Custom hook to manage and access the currently selected chat conversation.
 *
 * Supports both object destructuring and array tuple destructuring:
 *
 * 1. Object destructuring:
 *    const { selectedConversation, isOnline, messages, sendMessage, mapUserToConversation } = useSelectedConversation();
 *
 * 2. Array destructuring (like useState):
 *    const [selectedConversation, setSelectedConversation] = useSelectedConversation();
 */
export function useSelectedConversation() {
  const selectedConversation = useChatStore((state) => state.selectedConversation);
  const setSelectedConversation = useChatStore((state) => state.setSelectedConversation);
  const conversations = useChatStore((state) => state.conversations);
  const messages = useChatStore((state) => state.messages);
  const isMessageLoading = useChatStore((state) => state.isMessageLoading);
  const isSendingMessage = useChatStore((state) => state.isSendingMessage);
  const isTyping = useChatStore((state) => state.isTyping);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const getMessages = useChatStore((state) => state.getMessages);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  // Check if the currently active/selected user is connected via socket
  const activeTarget = selectedConversation || null;
  const activeTargetId = String(activeTarget?._id || activeTarget?.id || "");
  const isOnline = Boolean(
    activeTargetId && onlineUsers.some((id) => String(id) === activeTargetId)
  );

  const clearSelectedConversation = useCallback(() => {
    setSelectedConversation(null);
  }, [setSelectedConversation]);

  /**
   * Maps a raw user object (or array of users) into a standardized conversation object with `isOnline` status.
   */
  const mapUserToConversation = useCallback(
    (userOrUsers) => {
      if (!userOrUsers) return null;

      if (Array.isArray(userOrUsers)) {
        return userOrUsers.map((u) => formatUserAsConversation(u, onlineUsers, conversations));
      }

      return formatUserAsConversation(userOrUsers, onlineUsers, conversations);
    },
    [onlineUsers, conversations]
  );

  /**
   * Maps a user to a conversation and immediately sets them as active.
   */
  const selectUserAsConversation = useCallback(
    (user) => {
      const conv = mapUserToConversation(user);
      setSelectedConversation(conv);
      return conv;
    },
    [mapUserToConversation, setSelectedConversation]
  );

  const result = {
    selectedConversation,
    selectedUser: selectedConversation,
    activeConversation: selectedConversation,
    activeConversationId: selectedConversation?._id || null,
    conversationId: selectedConversation?._id || null,
    hasSelectedConversation: Boolean(selectedConversation),
    isLargeScreen,
    isOnline,
    isTyping,
    messages,
    isMessageLoading,
    isSendingMessage,
    sendMessage,
    getMessages,
    setSelectedConversation,
    setSelectedUser: setSelectedConversation,
    clearSelectedConversation,

    // User-to-conversation mapping utilities
    mapUserToConversation,
    mapUserToConverstation: mapUserToConversation, // Alias for typo-resilience
    selectUserAsConversation,
  };

  // Allows array destructuring: const [selectedConversation, setSelectedConversation] = useSelectedConversation();
  result[Symbol.iterator] = function* () {
    yield selectedConversation;
    yield setSelectedConversation;
  };

  return result;
}

export default useSelectedConversation;
