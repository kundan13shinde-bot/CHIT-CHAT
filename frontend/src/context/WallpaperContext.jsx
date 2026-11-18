import { useEffect, useState } from "react";
import { getWallpaperById, wallpaperFrameStyle, DEFAULT_WALLPAPER_ID } from "../data/wallpaper";
import { WallpaperContext } from "./wallpaper";

const STORAGE_KEY = "chat-wallpaper-id";

function readStoredWallpaperId() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const found = getWallpaperById(stored);
      if (found?.id) return found.id;
    }
  } catch {
    // ignore
  }
  const defaultWp = getWallpaperById(DEFAULT_WALLPAPER_ID);
  return defaultWp?.id || "none";
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
  const setWallpaperId = (id) => {
    const found = getWallpaperById(id);
    setWallpaperIdState(found?.id || DEFAULT_WALLPAPER_ID);
  };
  const frameStyle = wallpaperFrameStyle(wallpaper);

  return (
    <WallpaperContext.Provider value={{ wallpaperId, setWallpaperId, wallpaper, frameStyle }}>
      {children}
    </WallpaperContext.Provider>
  );
}
