import { useRef } from "react";
import { motion } from "framer-motion";

type ComposerProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export default function Composer({
  input,
  setInput,
  onSubmit,
  isLoading,
}: ComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-30 pointer-events-none">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mx-auto max-w-2xl flex items-center gap-4 pointer-events-auto"
      >
        {/* Input box */}
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
            className="w-full p-3 pr-12 rounded-lg
                       bg-[#0d1114]/80 text-zinc-100 outline-none
                       border border-cyan-400/55
                       focus:ring-2 focus:ring-cyan-400
                       placeholder:uppercase placeholder:tracking-wide placeholder:font-bold
                       disabled:opacity-50"
          />
        </div>

        {/* Old-school keyboard key style button */}
        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          initial={false}
          whileTap={{
            scale: 0.95, // shrink on press
            y: 2, // sink down slightly
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
                     rounded-md px-6 py-3 font-bold uppercase tracking-wide
                     bg-amber-400 text-zinc-900
                     shadow-[0_4px_0_0_rgba(255,255,255,0.9),0_6px_0_0_rgba(0,0,0,0.25)]
                     border border-amber-300
                     hover:brightness-105 active:brightness-100"
          aria-label="Proceed"
        >
          PROCEED
        </motion.button>
      </form>
    </div>
  );
}
