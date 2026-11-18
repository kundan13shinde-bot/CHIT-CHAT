import { SignInButton } from "@clerk/react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import { useWallpaper } from "../context/wallpaper";

/** Left half: intro text and the rocket illustration. */
function IntroPanel() {
  return (
    <section className="flex flex-1 flex-col gap-2.5 border-b border-separator p-4 sm:p-6 md:border-b-0 md:border-r">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Secure gateway</p>
      <h1 className="font-mono text-base font-bold uppercase tracking-wider sm:text-lg">Open CHIT-CHAT</h1>
      <p className="max-w-sm font-mono text-[11px] text-muted">
        Chats, photos, and reactions stay in sync —{" "}
        <span className="hidden md:inline">sign in on the right to continue.</span>
        <span className="md:hidden">sign in below to continue.</span>
      </p>

      {/* Hidden on phone/mobile screens so the box stays compact and wallpaper is visible */}
      <div className="hidden md:flex mt-2 flex-1 items-center justify-center sm:mt-3">
        <img
          src="/auth.png"
          alt="Rocket"
          className="max-h-36 rounded-2xl object-contain sm:max-h-48 md:max-h-56"
        />
      </div>
    </section>
  );
}

/** Right half: the sign-in card. Clerk opens its own sign-in modal on click. */
function SignInCard() {
  return (
    <section className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-xs flex-col items-center gap-3.5 rounded-2xl border border-border bg-surface/75 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <img src="/logo.png" alt="CHIT-CHAT" className="size-10 rounded-xl sm:size-12" />

        <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
          <Sparkles size={12} /> Secure entry
        </p>

        <SignInButton mode="modal">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2 text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-110"
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
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent/30 via-background/40 to-accent/15 p-4 sm:p-8 md:p-12 lg:p-16"
    >
      <div className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background/70 shadow-2xl backdrop-blur-xl sm:max-w-md sm:rounded-3xl md:max-w-2xl lg:max-w-3xl">
        <AuthHeader />

        <div className="flex flex-1 flex-col md:flex-row">
          <IntroPanel />
          <SignInCard />
        </div>

        <footer className="flex justify-between px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-muted sm:px-5">
          <span>Private session</span>
          <span>Encrypted in transit</span>
        </footer>
      </div>
    </main>
  );
}

export default AuthPage;
