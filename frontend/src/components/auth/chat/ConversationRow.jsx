import { Avatar } from "@heroui/react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

export function ConversationRow({ user, isSelected, onClick, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent/30 ${
        isSelected ? "bg-accent/50 font-medium" : ""
      }`}
    >
      <AvatarWithOnlineIndicator isOnline={user.isOnline}>
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.fullname}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <Avatar
            name={user.fullname?.[0] || "?"}
            className="size-10 bg-accent/30 text-sm font-semibold uppercase text-accent-foreground"
          />
        )}
      </AvatarWithOnlineIndicator>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{user.fullname}</p>
        <p className="truncate text-xs text-muted">
          {subtitle || (user.isOnline ? "Online" : "Offline")}
        </p>
      </div>
    </button>
  );
}

export default ConversationRow;
