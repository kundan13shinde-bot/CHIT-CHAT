import { useClerk } from "@clerk/react";
import { ArrowLeft, Image, LogOut, Moon, Palette, Sun, User } from "lucide-react";
import { useTheme } from "../../../context/theme";
import HeaderPopover, { iconButtonClass } from "../HeaderPopover";
import ThemePicker from "../ThemePicker";
import WallpaperPicker from "../WallpaperPicker";
import { useSelectedConversation } from "../../../hooks/useSelectedConversation";

const activeModeClass =
    "flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground";

/**
 * ChatHeader displays:
 * - Left: Active user's profile avatar, username, and live online status (with mobile back button).
 * - Right: Appearance & session controls (Wallpaper picker, Theme picker, Light/Dark toggle, Logout).
 */
export function ChatHeader() {
    const { mode, toggleTheme } = useTheme();
    const { signOut } = useClerk();

    const {
        selectedConversation,
        activeConversation,
        isOnline,
        clearSelectedConversation,
    } = useSelectedConversation();

    // Support either selectedConversation or activeConversation
    const user = selectedConversation || activeConversation;

    const switchTo = (target) => {
        if (mode !== target) toggleTheme();
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6 z-20">
            {/* Left side: Profile Icon, Username, and Online Status */}
            <div className="flex min-w-0 items-center gap-3">
                {/* Mobile back button: returns to sidebar when a chat is open */}
                {user && (
                    <button
                        type="button"
                        aria-label="Back to conversations"
                        onClick={clearSelectedConversation}
                        className="flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-accent/40 hover:text-foreground md:hidden"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}

                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Profile Avatar with online indicator badge */}
                        <div className="relative shrink-0">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.fullname}
                                    className="size-10 rounded-full object-cover ring-2 ring-border"
                                />
                            ) : (
                                <div className="flex size-10 items-center justify-center rounded-full bg-accent/30 font-semibold uppercase text-accent-foreground ring-2 ring-border">
                                    {user.fullname?.[0] || <User size={18} />}
                                </div>
                            )}
                            {/* Online/Offline indicator dot */}
                            <span
                                className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background ${isOnline ? "bg-emerald-500" : "bg-muted"
                                    }`}
                                title={isOnline ? "Online" : "Offline"}
                            />
                        </div>

                        {/* Username and Status text */}
                        <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-foreground">
                                {user.fullname}
                            </h2>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span
                                    className={`size-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-muted"
                                        }`}
                                />
                                <span className={isOnline ? "font-medium text-emerald-500" : "text-muted"}>
                                    {isOnline ? "Online" : "Offline"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Fallback when no user is currently selected */
                    <div className="flex items-center gap-2.5">
                        <img src="/logo.png" alt="Logo" className="size-6 rounded-md" />
                        <div className="leading-tight">
                            <p className="text-sm font-semibold tracking-wide">CHIT-CHAT</p>
                            <p className="text-[11px] text-muted">Select a chat to begin</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right side: Wallpaper, Theme, Dark/Light mode, Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                <HeaderPopover icon={Image} label="Choose wallpaper" title="Wallpaper">
                    <WallpaperPicker />
                </HeaderPopover>

                <HeaderPopover icon={Palette} label="Choose theme" title="Theme">
                    <ThemePicker />
                </HeaderPopover>

                <button
                    type="button"
                    aria-label="Light mode"
                    title="Light mode"
                    onClick={() => switchTo("light")}
                    className={mode === "light" ? activeModeClass : iconButtonClass}
                >
                    <Sun size={14} />
                </button>

                <button
                    type="button"
                    aria-label="Dark mode"
                    title="Dark mode"
                    onClick={() => switchTo("dark")}
                    className={mode === "dark" ? activeModeClass : iconButtonClass}
                >
                    <Moon size={14} />
                </button>

                <button
                    type="button"
                    aria-label="Log out"
                    title="Log out"
                    onClick={() => signOut({ redirectUrl: "/auth" })}
                    className={`${iconButtonClass} hover:text-danger`}
                >
                    <LogOut size={14} />
                </button>
            </div>
        </header>
    );
}

export default ChatHeader;
