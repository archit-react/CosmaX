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

  // Always call the hook
  const typedContent = useTypewriter(content, 20);
  const displayContent = role === "bot" ? typedContent : content;

  // Bubble styles
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
        "text-cyan-100", // keep cyan text for bot role
        "backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_16px_-6px_rgba(0,0,0,0.45)]",
      ].join(" ");

  return (
    <div
      className={`w-fit max-w-[80%] px-4 py-2 rounded-xl text-sm ${bubbleClass}`}
    >
      <p className="whitespace-pre-wrap">{displayContent}</p>
      {timestamp && (
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-yellow-200/70" : "text-cyan-200/70"
          }`}
        >
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
