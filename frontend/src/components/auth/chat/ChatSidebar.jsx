import { useEffect, useMemo } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { useSelectedConversation } from "../../../hooks/useSelectedConversation";
import { ConversationRow } from "./ConversationRow";

const TABS = [
  { key: "chats", label: "Chats" },
  { key: "contacts", label: "Users" },
];

function ChatSidebar() {
  const users = useChatStore((s) => s.users);
  const conversations = useChatStore((s) => s.conversations);
  const searchQuery = useChatStore((s) => s.searchQuery);
  const setSearchQuery = useChatStore((s) => s.setSearchQuery);
  const sidebarTab = useChatStore((s) => s.sidebarTab);
  const setSidebarTab = useChatStore((s) => s.setSidebarTab);
  const getUsers = useChatStore((s) => s.getUsers);
  const getConversations = useChatStore((s) => s.getConversations);
  const isUserLoading = useChatStore((s) => s.isUserLoading);
  const isConversationLoading = useChatStore((s) => s.isConversationLoading);

  const { selectedConversation, mapUserToConversation, selectUserAsConversation } =
    useSelectedConversation();

  // Load both lists once when the sidebar mounts
  useEffect(() => {
    getConversations();
    getUsers();
  }, [getConversations, getUsers]);

  const isChatsTab = sidebarTab === "chats";
  const isLoading = isChatsTab ? isConversationLoading : isUserLoading;

  // Pick the list for the active tab, add online status, then apply search
  const list = useMemo(() => {
    const source = mapUserToConversation(isChatsTab ? conversations : users) || [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return source;
    return source.filter(
      (u) =>
        u.fullname?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
    );
  }, [isChatsTab, conversations, users, searchQuery, mapUserToConversation]);

  const handleSelect = (user) => {
    selectUserAsConversation(user);
    // Picking someone from "Users" starts a chat; show it under Chats
    if (!isChatsTab) setSidebarTab("chats");
  };

  const emptyText = searchQuery
    ? "No results found"
    : isChatsTab
      ? "No conversations yet. Start one from Users."
      : "No users available";

  return (
    <aside className="flex w-full flex-col border-r border-border md:w-80">
      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isChatsTab ? "Search chats..." : "Search users..."}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSidebarTab(tab.key)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sidebarTab === tab.key ? "bg-accent text-accent-foreground" : "text-muted hover:bg-accent/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="flex-1 space-y-1 overflow-y-auto px-2">
        {isLoading && <li className="p-4 text-center text-sm text-muted">Loading...</li>}

        {!isLoading && list.length === 0 && (
          <li className="p-4 text-center text-sm text-muted">{emptyText}</li>
        )}

        {!isLoading &&
          list.map((user) => (
            <li key={user._id}>
              <ConversationRow
                user={user}
                isSelected={selectedConversation?._id === user._id}
                onClick={() => handleSelect(user)}
                subtitle={
                  isChatsTab
                    ? user.lastMessage?.text || (user.isOnline ? "Online" : "Offline")
                    : user.email || (user.isOnline ? "Online" : "Offline")}
              />
            </li>
          ))}
      </ul>
    </aside>
  );
}

export default ChatSidebar;
