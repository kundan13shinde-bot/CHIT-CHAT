import { useAuth, useClerk } from "@clerk/react";
import { Image, LogOut, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "../../context/theme";
import HeaderPopover, { iconButtonClass } from "./HeaderPopover";
import ThemePicker from "./ThemePicker";
import WallpaperPicker from "./WallpaperPicker";

const activeModeClass =
  "flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground";

/** Top bar of the window: app name on the left, appearance controls on the right. */
export default function AuthHeader() {
  const { mode, toggleTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  // Sun / moon: the one matching the current mode is highlighted; the other switches to it.
  const switchTo = (target) => {
    if (mode !== target) toggleTheme();
  };

  return (
    <header className="flex items-center justify-between border-b border-separator px-5 py-3">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="" className="size-5 rounded-md" />
        <div className="leading-tight">
          <p className="text-sm font-semibold">iMessage</p>
          <p className="text-[10px] text-muted">Private session</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HeaderPopover icon={Image} label="Choose wallpaper" title="Wallpaper">
          <WallpaperPicker />
        </HeaderPopover>
        <HeaderPopover icon={Palette} label="Choose theme" title="Theme">
          <ThemePicker />
        </HeaderPopover>
        <button
          type="button"
          aria-label="Light mode"
          onClick={() => switchTo("light")}
          className={mode === "light" ? activeModeClass : iconButtonClass}
        >
          <Sun size={14} />
        </button>
        <button
          type="button"
          aria-label="Dark mode"
          onClick={() => switchTo("dark")}
          className={mode === "dark" ? activeModeClass : iconButtonClass}
        >
          <Moon size={14} />
        </button>

        {/* Only shown while a user is logged in. */}
        {isSignedIn && (
          <button
            type="button"
            aria-label="Log out"
            title="Log out"
            onClick={() => signOut({ redirectUrl: "/auth" })}
            className={`${iconButtonClass} hover:text-danger`}
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
