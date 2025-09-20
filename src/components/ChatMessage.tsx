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
        "bg-amber-400/20",
        "border border-amber-300/40",
        "text-amber-200",
        "shadow-[0_0_24px_-8px_rgba(251,191,36,0.45)]",
        "backdrop-blur-[1px]",
      ].join(" ")
    : isSystem
    ? "mx-auto bg-purple-600 text-white text-center"
    : [
        "mr-auto",
        "bg-cyan-400/15",
        "border border-cyan-400/40",
        "text-cyan-100",
        "shadow-[0_0_24px_-10px_rgba(34,211,238,0.45)]",
        "backdrop-blur-[1px]",
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
