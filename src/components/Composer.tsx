// src/components/Composer.tsx
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

type ComposerProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  autoFocusOnMount?: boolean;
};

export default function Composer({
  input,
  setInput,
  onSubmit,
  isLoading,
  autoFocusOnMount = false,
}: ComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    if (autoFocusOnMount) {
      el.focus();
    } else {
      const t = setTimeout(() => el.blur(), 0);
      return () => clearTimeout(t);
    }
  }, [autoFocusOnMount]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-30 pointer-events-none px-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mx-auto max-w-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pointer-events-auto"
      >
        <div className="relative flex-1">
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            placeholder="Type your message"
            aria-label="Chat input"
            className="w-full p-3 rounded-lg
                       bg-white/5 backdrop-blur-md text-zinc-100 outline-none
                       border border-white/10
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                       font-['Audiowide'] placeholder:font-['Audiowide']
                       focus:ring-2 focus:ring-white/20 focus:border-white/20
                       placeholder:uppercase placeholder:tracking-wide placeholder:font-bold
                       disabled:opacity-50
                       text-base sm:text-sm"
          />
        </div>

        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          initial={false}
          whileTap={{
            scale: 0.95,
            y: 2,
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.45), inset 0 -2px 2px rgba(255,255,255,0.85)",
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 30,
            mass: 0.5,
          }}
          className="inline-flex items-center justify-center select-none
                     rounded-2xl px-6 py-3 font-bold uppercase tracking-wide
                     bg-amber-400 backdrop-blur-md text-zinc-900
                     shadow-[0_4px_0_0_rgba(255,255,255,0.9),0_6px_0_0_rgba(0,0,0,0.25)]
                     border border-amber-300
                     font-['Audiowide']
                     hover:brightness-105 active:brightness-100
                     text-sm sm:text-base"
          aria-label="Proceed"
        >
          PROCEED
        </motion.button>
      </form>
    </div>
  );
}
