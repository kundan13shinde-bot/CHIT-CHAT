// Images live in frontend/public/wallpapers and are served from /wallpapers/...
// File names contain spaces/emoji, so URLs are encoded with encodeURI.
const url = (file) => encodeURI(`/wallpapers/${file}`);

export const wallpapers = [
    { id: "none", label: "None", src: null },
    { id: "wallpaper-1", label: "Wallpaper 1", src: url("666603182315344666.jpg") },
    { id: "wallpaper-2", label: "Wallpaper 2", src: url("684476843403760914.jpg") },
    { id: "wallpaper-3", label: "Wallpaper 3", src: url("840062136734754087.jpg") },
    { id: "wallpaper-4", label: "Wallpaper 4", src: url("918452917726990101.jpg") },
    { id: "ghost-of-tsushima", label: "Ghost of Tsushima", src: url("Ghost Of Tsushima __ 4K DESKTOP WALLPAPER.jpg") },
    { id: "anime-for-life", label: "Anime For Life", src: url("My Anime For Life.jpg") },
    { id: "last-sun-breathing", label: "Last Sun Breathing", src: url("The Last Sun Breathing☀️  wallpaper for pc 🖥️.jpg") },
    { id: "miyamoto-musashi", label: "Miyamoto Musashi", src: url("_Miyamoto Musashi.jpg") },
];

export const DEFAULT_WALLPAPER_ID = "ghost-of-tsushima";

// Guaranteed to return a valid wallpaper object, never undefined
export const getWallpaperById = (id) => {
    if (!id) return wallpapers[0];

    const match =
        wallpapers.find((w) => w.id === id) ??
        wallpapers.find((w) => w.src && w.src.includes(encodeURI(id))) ??
        wallpapers.find((w) => w.id === DEFAULT_WALLPAPER_ID) ??
        wallpapers[0];

    return match || wallpapers[0];
};

// Use as a CSS value: style={{ backgroundImage: wallpaperCss(id) }}
export const wallpaperCss = (id) => {
    const w = getWallpaperById(id);
    return w?.src ? `url("${w.src}")` : "none";
};

// Ready-to-spread inline style for the chat area.
export const wallpaperFrameStyle = (wallpaper) => {
    if (!wallpaper || !wallpaper.src) {
        return {};
    }

    return {
        backgroundImage: `url("${wallpaper.src}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    };
};
