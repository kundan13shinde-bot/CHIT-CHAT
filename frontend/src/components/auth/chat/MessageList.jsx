import { useScrollToBottom } from "../../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../../hooks/useSelectedConversation";

export function MessageList() {
    const {
        activeConversation,
        selectedConversation,
        messages,
        isMessageLoading,
    } = useSelectedConversation();

    const user = activeConversation || selectedConversation;
    const bottomRef = useScrollToBottom(messages);

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden">
            {user ? (
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
                    {isMessageLoading ? (
                        <div className="flex flex-1 items-center justify-center text-xs text-muted">
                            Loading messages...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center text-center text-xs text-muted">
                            <p className="font-medium text-foreground">No messages yet</p>
                            <p className="mt-1">Say hello to {user.fullname}! 👋</p>
                        </div>
                    ) : (
                        <>
                            <p className="my-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted">
                                Conversation started
                            </p>
                            {messages.map((message) => (
                                <MessageBubble key={message._id || message.id} message={message} />
                            ))}
                            <div ref={bottomRef} />
                        </>
                    )}
                </div>
            ) : (
                <NoConversationPlaceholder />
            )}
        </div>
    );
}

export default MessageList;

