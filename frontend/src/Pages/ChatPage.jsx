import AuthHeader from "../components/auth/AuthHeader";
import { useWallpaper } from "../context/wallpaper";

function ChatPage() {
  const { frameStyle } = useWallpaper();

  return (
    <main
      style={frameStyle}
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent/40 via-background to-accent/20 p-4 sm:p-8"
    >
      <div className="flex min-h-96 w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
        {/* Header includes the logout button because the user is signed in here. */}
        <AuthHeader />
        <div className="flex flex-1 items-center justify-center text-muted">Chat Page</div>
      </div>
    </main>
  );
}

export default ChatPage;
