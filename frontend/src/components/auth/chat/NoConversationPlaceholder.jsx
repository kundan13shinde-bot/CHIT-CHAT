import { MessageCircleIcon } from "lucide-react";

export function NoConversationPlaceholder() {
  return (
    <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center sm:gap-5 sm:px-8 sm:py-16">
      <div
        className="flex size-20 items-center justify-center rounded-3xl bg-accent/20"
        aria-hidden
      >
        <MessageCircleIcon className="size-10 text-accent" strokeWidth={1.5} />
      </div>
      <div className="max-w-xs space-y-2">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">
          Select a chat to start
        </h2>
        <p className="text-xs leading-relaxed text-muted sm:text-sm">
          Pick a conversation from the list on the left to read messages and reply.
        </p>
      </div>
    </div>
  );
}

export default NoConversationPlaceholder;

