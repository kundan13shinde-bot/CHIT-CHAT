import AuthHeader from "./AuthHeader";
import { useWallpaper } from "../../context/wallpaper";

export default function PageLoader() {
  const { frameStyle } = useWallpaper();

  return (
    <main
      style={frameStyle}
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent/40 via-background to-accent/20 p-4 sm:p-8"
    >
      <div className="flex min-h-96 w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
        <AuthHeader />

        <div className="flex flex-1 items-center justify-center">
          <div
            role="status"
            aria-label="Loading"
            className="relative flex size-12 items-center justify-center"
          >
            <span className="size-3.5 rounded-full bg-blue-500" aria-hidden="true" />
            <svg
              className="absolute inset-0 size-full animate-spin text-blue-500"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="40 126"
              />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
