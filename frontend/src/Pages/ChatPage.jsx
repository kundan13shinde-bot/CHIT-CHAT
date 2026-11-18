import { useWallpaper } from "../context/wallpaper";
import { useChatStore } from "../store/useChatStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import { useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { ChatComposer } from "../components/chat/ChatComposer";

function ChatPage() {
  const { frameStyle } = useWallpaper();

  const getConversations = useChatStore((state) => state.getConversations);
  const getMessages = useChatStore((state) => state.getMessages);
  const getUsers = useChatStore((state) => state.getUsers);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  const { activeConversation, activeConversationId } = useSelectedConversation();

  useEffect(() => {
    getUsers();
    getConversations();
  }, [getConversations, getUsers]);

  useEffect(() => {
    if (!activeConversationId) return;

    getMessages(activeConversationId);
    subscribeToMessages(activeConversationId);

    // cleanup
    return () => unsubscribeFromMessages();
  }, [getMessages, activeConversationId, subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden p-0 sm:p-3 md:p-6 lg:p-8" style={frameStyle}>
      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 overflow-hidden rounded-none border-0 sm:rounded-2xl sm:border border-border bg-background text-foreground shadow-2xl">
        <ChatSidebar />

        <div
          className={`flex-1 flex-col overflow-hidden ${
            !activeConversationId ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatHeader />
          <MessageList />

          {activeConversation ? <ChatComposer /> : null}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;