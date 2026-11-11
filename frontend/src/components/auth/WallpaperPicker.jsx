import { wallpapers } from "../../data/wallpaper";
import { useWallpaper } from "../../context/wallpaper";

/** Grid of wallpaper thumbnails ("None" shows a plain tile). */
export default function WallpaperPicker() {
  const { wallpaperId, setWallpaperId } = useWallpaper();

  return (
    <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto p-1">
      {wallpapers.map((w) => (
        <button
          key={w.id}
          type="button"
          title={w.label}
          aria-label={w.label}
          onClick={() => setWallpaperId(w.id)}
          style={w.src ? { backgroundImage: `url("${w.src}")` } : undefined}
          className={`flex h-14 items-center justify-center rounded-lg border border-border bg-default bg-cover bg-center text-[10px] text-muted transition hover:scale-105 ${
            wallpaperId === w.id ? "ring-2 ring-accent ring-offset-2 ring-offset-overlay" : ""
          }`}
        >
          {!w.src && "None"}
        </button>
      ))}
    </div>
  );
}
