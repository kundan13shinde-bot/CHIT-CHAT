import { heroTheme } from "../../data/herotheme";
import { useTheme } from "../../context/theme";

/** Grid of colour-theme swatches. */
export default function ThemePicker() {
  const { themeId, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-5 gap-2">
      {heroTheme.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.label}
          aria-label={t.label}
          onClick={() => setTheme(t.id)}
          style={{ background: t.swatch }}
          className={`size-9 rounded-full border border-border transition hover:scale-110 ${
            themeId === t.id ? "ring-2 ring-accent ring-offset-2 ring-offset-overlay" : ""
          }`}
        />
      ))}
    </div>
  );
}
