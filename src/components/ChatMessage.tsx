// src/components/ChatMessage.tsx
import { useTypewriter } from "../hooks/useTypewriter";

type ChatMessageProps = {
  role: "user" | "bot" | "system";
  content: string;
  timestamp?: string;
};

export default function ChatMessage({
  role,
  content,
  timestamp,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  //  call hook correctly (object) and use only the string
  const { displayText } = useTypewriter({ text: content, speed: 20 });
  const displayContent = role === "bot" ? displayText : content;

  const bubbleClass = isUser
    ? [
        "ml-auto",
        "bg-white/5",
        "border border-white/10",
        "text-amber-200",
        "backdrop-blur-md", 
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_16px_-6px_rgba(0,0,0,0.45)]",
      ].join(" ")
    : isSystem
    ? "mx-auto bg-purple-600 text-white text-center"
    : [
        "mr-auto",
        "bg-white/5",
        "border border-white/10",
        "text-cyan-100",
        "backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_16px_-6px_rgba(0,0,0,0.45)]",
      ].join(" ");

  return (
    <div
      className={`w-fit max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-xl ${bubbleClass}`}
    >
      <p className="whitespace-pre-wrap break-words font-['Audiowide'] tracking-wide text-sm sm:text-base leading-relaxed">
        {/* always render a string to avoid React crashing */}
        {displayContent ?? ""}
      </p>
      {timestamp && (
        <div
          className={`mt-1 text-[0.65rem] sm:text-xs font-['Audiowide'] tracking-widest ${
            isUser ? "text-yellow-200/70" : "text-cyan-200/70"
          }`}
        >
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
