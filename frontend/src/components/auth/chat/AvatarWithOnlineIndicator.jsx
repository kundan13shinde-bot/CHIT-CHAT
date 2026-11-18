export function AvatarWithOnlineIndicator({ isOnline, children, dotClassName = "" }) {
  return (
    <div className="relative inline-flex shrink-0">
      {children}
      {isOnline ? (
        <span
          className={`pointer-events-none absolute bottom-0 right-0 z-10 flex size-3 items-center justify-center rounded-full border-2 border-background bg-emerald-500 shadow-sm ${dotClassName}`}
          aria-hidden
        >
          <span className="absolute inset-0 size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        </span>
      ) : (
        <span
          className={`pointer-events-none absolute bottom-0 right-0 z-10 size-2.5 rounded-full border-2 border-background bg-muted/60 ${dotClassName}`}
          aria-hidden
        />
      )}
      <span className="sr-only">{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
}

export default AvatarWithOnlineIndicator;

