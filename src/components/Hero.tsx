import { useEffect, useState } from "react";
import CosmaXLogo from "../components/CosmaXLogo";


type HeroProps = {
  /** The input/textarea id that should trigger compact mode (default: "chat-input") */
  watchInputId?: string;
  /** Optional: hide tagline if you want only the logo */
  showTagline?: boolean;
};

export default function Hero({
  watchInputId = "chat-input",
  showTagline = true,
}: HeroProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchInputId) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    if (!el) return;

    const update = () =>
      setCompact(document.activeElement === el || !!el.value?.trim());

    el.addEventListener("focus", update);
    el.addEventListener("blur", update);
    el.addEventListener("input", update);

    // initialize state on mount
    update();

    return () => {
      el.removeEventListener("focus", update);
      el.removeEventListener("blur", update);
      el.removeEventListener("input", update);
    };
  }, [watchInputId]);

  return (
    <section
      id="hero"
      className="relative w-screen -ml-[calc(50vw-50%)] pt-24 pb-24 md:pt-32 md:pb-28"
      aria-label="CosmaX hero"
    >
      {/* Logo block that moves center -> top-left */}
      <div
        className={[
          "fixed z-20 transition-all duration-700 ease-out will-change-transform pointer-events-none",
          compact
            ? "top-4 left-4 translate-x-0 translate-y-0 scale-75 opacity-90"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100",
        ].join(" ")}
      >
        {/* bg plate kept transparent so particles show through */}
        <CosmaXLogo className="h-24 w-auto [--bg:transparent]" />
      </div>

      {/* Centered content (only visible before typing) */}
      {!compact && showTagline && (
        <div className="section-x-inset-xl relative z-10 flex flex-col items-center gap-6 text-center pointer-events-none">
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 drop-shadow-[0_0_1.5rem_rgba(255,255,255,.25)]">
            Start a conversation
          </h1>
          <p className="text-zinc-300 text-lg">
            Ask anything you’d like to know
          </p>

          {/* Helpful links (optional; remove if you don’t want them) */}
          <div className="pointer-events-auto mt-2 flex items-center gap-3 text-sm text-cyan-200/80">
            <a className="underline" href="/docs">
              Docs
            </a>
            <span className="h-[1em] w-px bg-cyan-200/50" />
            <a className="underline" href="#why-cosmax">
              Why CosmaX?
            </a>
            <span className="h-[1em] w-px bg-cyan-200/50" />
            <a className="underline" href="https://discord.gg/your-link">
              Discord
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
