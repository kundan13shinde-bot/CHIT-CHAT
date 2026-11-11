import { useEffect, useState } from "react";
import { getWallpaperById, wallpaperFrameStyle, DEFAULT_WALLPAPER_ID } from "../data/wallpaper";
import { WallpaperContext } from "./wallpaper";

const STORAGE_KEY = "chat-wallpaper-id";

function readStoredWallpaperId() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return getWallpaperById(stored).id;
  } catch {
    // ignore
  }
  return DEFAULT_WALLPAPER_ID;
}

export function WallpaperProvider({ children }) {
  const [wallpaperId, setWallpaperIdState] = useState(readStoredWallpaperId);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, wallpaperId);
    } catch {
      // ignore
    }
  }, [wallpaperId]);

  const wallpaper = getWallpaperById(wallpaperId);
  const setWallpaperId = (id) => setWallpaperIdState(getWallpaperById(id).id);
  const frameStyle = wallpaperFrameStyle(wallpaper);

  return (
    <WallpaperContext.Provider value={{ wallpaperId, setWallpaperId, wallpaper, frameStyle }}>
      {children}
    </WallpaperContext.Provider>
  );
}
