import { useRef } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";

type ComposerProps = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  maxLength: number;
};

export default function Composer({
  input,
  setInput,
  onSubmit,
  isLoading,
  maxLength,
}: ComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="fixed left-0 right-0 bottom-0 z-10 bg-[#0d1114]/70 backdrop-blur-sm border-t border-zinc-800 p-4"
    >
      <div className="mx-auto max-w-2xl flex gap-2 items-center">
        {/* Input */}
        <div className="relative flex-1">
          <input
            id="chat-input" // <-- important for focus/hero logic
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            maxLength={maxLength}
            placeholder="Type your message"
            aria-label="Chat input"
            className="w-full p-3 pr-12 rounded-lg
                       bg-[#0d1114]/80 text-zinc-100 outline-none
                       border border-cyan-400/55
                       focus:ring-2 focus:ring-cyan-400
                       disabled:opacity-50"
          />
          {input.length > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
              {input.length}/{maxLength}
            </span>
          )}
        </div>

        {/* JSR-like yellow button */}
        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading || input.length > maxLength}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2
                     rounded-lg px-4 py-3
                     bg-amber-400 text-zinc-900 font-medium
                     shadow-[0_8px_30px_-10px_rgba(255,200,0,.55)]
                     ring-1 ring-amber-300/60
                     hover:bg-amber-300 hover:ring-amber-200
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </div>
    </form>
  );
}
