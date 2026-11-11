import { SignInButton } from "@clerk/react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import { useWallpaper } from "../context/wallpaper";

/** Left half: intro text and the rocket illustration. */
function IntroPanel() {
  return (
    <section className="flex flex-1 flex-col gap-3 border-b border-separator p-8 md:border-b-0 md:border-r">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Secure gateway</p>
      <h1 className="font-mono text-lg font-bold uppercase tracking-wider">Open iMessage</h1>
      <p className="max-w-md font-mono text-[11px] text-muted">
        Chats, photos, and reactions stay in sync — sign in on the right to continue.
      </p>

      <div className="mt-4 flex flex-1 items-center justify-center">
        <img src="/auth.png" alt="Rocket" className="max-h-72 rounded-2xl object-contain" />
      </div>
    </section>
  );
}

/** Right half: the sign-in card. Clerk opens its own sign-in modal on click. */
function SignInCard() {
  return (
    <section className="flex flex-1 items-center justify-center p-8">
      <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl border border-border bg-surface/80 p-8 shadow-xl">
        <img src="/logo.png" alt="iMessage" className="size-12 rounded-xl" />

        <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
          <Sparkles size={12} /> Secure entry
        </p>

        <SignInButton mode="modal">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-110"
          >
            Continue <ArrowRight size={14} />
          </button>
        </SignInButton>

        <p className="flex items-center gap-1.5 text-[10px] text-muted">
          <ShieldCheck size={12} /> Protected session · TLS encryption
        </p>
      </div>
    </section>
  );
}

function AuthPage() {
  const { frameStyle } = useWallpaper();

  return (
    <main
      style={frameStyle}
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent/40 via-background to-accent/20 p-4 sm:p-8"
    >
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
        <AuthHeader />

        <div className="flex flex-1 flex-col md:flex-row">
          <IntroPanel />
          <SignInCard />
        </div>

        <footer className="flex justify-between px-5 py-2 font-mono text-[9px] uppercase tracking-widest text-muted">
          <span>Private session</span>
          <span>Encrypted in transit</span>
        </footer>
      </div>
    </main>
  );
}

export default AuthPage;
