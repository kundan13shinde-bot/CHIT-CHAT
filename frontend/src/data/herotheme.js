// Each `id` matches a [data-theme="..."] block in styles/hero-theme.css.
// "default" has no block of its own: it falls back to the :root (light) values.
export const heroTheme = [
    {
        id: "default",
        label: "Default",
        mode: "light",
        swatch: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    },
    { id: "light", label: "Light", mode: "light", swatch: "linear-gradient(135deg, #ffffff 50%, #3b82f6 50%)" },
    { id: "dark", label: "Dark", mode: "dark", swatch: "linear-gradient(135deg, #18181b 50%, #3b82f6 50%)" },
    { id: "ocean", label: "Ocean", mode: "light", swatch: "linear-gradient(135deg, #eaf6fb 50%, #1e90c8 50%)" },
    { id: "ocean-dark", label: "Ocean Dark", mode: "dark", swatch: "linear-gradient(135deg, #0f2230 50%, #3cc0d8 50%)" },
    { id: "forest", label: "Forest", mode: "light", swatch: "linear-gradient(135deg, #eef8ee 50%, #2e9e5b 50%)" },
    { id: "forest-dark", label: "Forest Dark", mode: "dark", swatch: "linear-gradient(135deg, #10241a 50%, #4ade80 50%)" },
    { id: "sunset", label: "Sunset", mode: "light", swatch: "linear-gradient(135deg, #fdf3e8 50%, #f59a3d 50%)" },
    { id: "sunset-dark", label: "Sunset Dark", mode: "dark", swatch: "linear-gradient(135deg, #261a14 50%, #fb923c 50%)" },
    { id: "rose", label: "Rose", mode: "light", swatch: "linear-gradient(135deg, #fdf0f2 50%, #e11d48 50%)" },
    { id: "rose-dark", label: "Rose Dark", mode: "dark", swatch: "linear-gradient(135deg, #2a1519 50%, #fb7185 50%)" },
    { id: "violet", label: "Violet", mode: "light", swatch: "linear-gradient(135deg, #f5f0fd 50%, #7c3aed 50%)" },
    { id: "violet-dark", label: "Violet Dark", mode: "dark", swatch: "linear-gradient(135deg, #1b1233 50%, #a78bfa 50%)" },
    { id: "midnight", label: "Midnight", mode: "dark", swatch: "linear-gradient(135deg, #0b1230 50%, #22d3ee 50%)" },
    { id: "slate", label: "Slate", mode: "light", swatch: "linear-gradient(135deg, #eceef2 50%, #3f4a5e 50%)" },
];
