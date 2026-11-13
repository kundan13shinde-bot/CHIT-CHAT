import { withTransform } from "../../../lib/imagekit";
import { MessageVideo } from "./MessageVideoBg";
import { useAuthStore } from "../../../store/useAuthStore";

// Compress + size images for the bubble (q-auto works for images; f-auto picks WebP/AVIF).
const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";

export function MessageBubble({ message }) {
    const authUser = useAuthStore((state) => state.authUser);
    const isOwnMessage = message.role === "me" || message.senderId === authUser?._id;
    const rawImage = message.image || message.imageUrl;
    const rawVideo = message.video || message.videoUrl;
    const hasImage = Boolean(rawImage);
    const hasVideo = Boolean(rawVideo);

    const timeDisplay =
        message.time ||
        (message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
            : "");

    return (
        <div className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[min(90%,28rem)] rounded-2xl px-3 py-2 text-[15px] leading-snug sm:max-w-[min(75%,28rem)] sm:px-3.5 ${isOwnMessage
                        ? "rounded-br-md bg-accent text-accent-foreground"
                        : "rounded-bl-md border border-border bg-surface"
                    }`}
            >
                {hasImage ? (
                    <img
                        src={withTransform(rawImage, IMAGE_TRANSFORM)}
                        alt=""
                        className="mb-1.5 max-h-40 max-w-full rounded-lg object-cover sm:max-h-52 sm:rounded-xl"
                    />
                ) : null}
                {hasVideo ? <MessageVideo src={rawVideo} /> : null}
                {message.text ? (
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                ) : null}
                {timeDisplay ? (
                    <p
                        className={`mt-1 text-[11px] tabular-nums ${isOwnMessage ? "text-right text-accent-foreground/75" : "text-left text-muted"
                            }`}
                    >
                        {timeDisplay}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

export default MessageBubble;
