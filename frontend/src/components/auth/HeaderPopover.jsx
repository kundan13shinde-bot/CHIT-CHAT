import { useEffect, useRef, useState } from "react";

export const iconButtonClass =
  "flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-default hover:text-foreground";

/** Round header icon button that opens a small floating panel below it. */
export default function HeaderPopover({ icon: Icon, label, title, children }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={iconButtonClass}
      >
        <Icon size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-64 rounded-2xl border border-border bg-overlay p-3 shadow-2xl">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">{title}</p>
          {children}
        </div>
      )}
    </div>
  );
}
