import { Button, TextArea } from "@heroui/react";
import { ImageIcon, LoaderIcon, SendHorizontalIcon } from "lucide-react";
import { useRef } from "react";
import useKeyboardSound from "../../../hooks/useKeyboardSound";
import { useChatStore } from "../../../store/useChatStore";
import { useSelectedConversation } from "../../../hooks/useSelectedConversation";

export function ChatComposer() {
    const composerText = useChatStore((state) => state.composerText);
    const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
    const sendMediaMessage = useChatStore((state) => state.sendMediaMessage);
    const isSendingMedia = useChatStore((state) => state.isSendingMedia);
    const isSendingMessage = useChatStore((state) => state.isSendingMessage);
    const sendTextMessage = useChatStore((state) => state.sendTextMessage);
    const setComposerText = useChatStore((state) => state.setComposerText);

    const { activeConversationId, selectedConversation } = useSelectedConversation();
    const currentChatId = activeConversationId || selectedConversation?._id;

    const { playRandomKeyStrokeSound } = useKeyboardSound();
    const mediaInputRef = useRef(null);

    const isSending = isSendingMedia || isSendingMessage;

    const playSoundIfEnabled = () => {
        if (isSoundEnabled) playRandomKeyStrokeSound();
    };

    const handleSend = async () => {
        if (!composerText.trim() || isSending) return;
        const didSendMessage = await sendTextMessage(currentChatId);
        if (didSendMessage) playSoundIfEnabled();
    };

    const handleComposerTextChange = (event) => {
        setComposerText(event.target.value);
        playSoundIfEnabled();
    };

    const handleMediaPick = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file || isSending) return;

        const didSendMessage = await sendMediaMessage({
            conversationId: currentChatId,
            file,
        });

        if (didSendMessage) playSoundIfEnabled();
    };

    return (
        <footer className="shrink-0 border-t border-border px-2 pb-3 pt-2 sm:px-4">
            {isSendingMedia ? (
                <div className="mx-auto mb-2 flex max-w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-muted">
                    <LoaderIcon
                        className="size-3.5 shrink-0 animate-spin text-accent"
                        strokeWidth={2}
                        aria-hidden
                    />
                    <span className="truncate">Uploading media...</span>
                </div>
            ) : null}

            <div className="mx-auto flex w-full max-w-full items-end gap-2">
                <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="sr-only"
                    disabled={isSending}
                    tabIndex={-1}
                    aria-hidden
                    onChange={handleMediaPick}
                />

                <Button
                    variant="ghost"
                    isIconOnly
                    isDisabled={isSending}
                    className="size-9 shrink-0 touch-manipulation self-end text-muted hover:text-accent"
                    onPress={() => mediaInputRef.current?.click()}
                    aria-label="Attach photo or video"
                >
                    <ImageIcon className="size-5" strokeWidth={2} />
                </Button>

                <TextArea
                    fullWidth
                    variant="secondary"
                    placeholder="Type a message..."
                    rows={1}
                    value={composerText}
                    onChange={handleComposerTextChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSend();
                        }
                    }}
                    className="flex-1 rounded-2xl"
                />

                <Button
                    variant="primary"
                    isIconOnly
                    isDisabled={!composerText.trim() || isSending}
                    onPress={handleSend}
                    className="size-9 shrink-0 rounded-full bg-accent text-accent-foreground"
                    aria-label="Send message"
                >
                    <SendHorizontalIcon className="size-4" />
                </Button>
            </div>
        </footer>
    );
}

export default ChatComposer;

