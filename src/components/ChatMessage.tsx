// src/components/ChatMessage.tsx
import { useTypewriter } from "../hooks/useTypewriter";
import { useEffect, useState } from "react";

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
  const [displayContent, setDisplayContent] = useState("");

  // Always call the hook, but control its effect with a condition
  const typedContent = useTypewriter(content, 20);

  useEffect(() => {
    if (role === "bot") {
      setDisplayContent(typedContent);
    } else {
      setDisplayContent(content);
    }
  }, [content, typedContent, role]);

  return (
    <div
      className={`w-fit max-w-[80%] px-4 py-2 rounded-xl text-sm ${
        isUser
          ? "ml-auto bg-green-600 text-white"
          : isSystem
          ? "mx-auto bg-purple-600 text-white text-center"
          : "mr-auto bg-zinc-800 text-gray-200"
      }`}
    >
      <p className="whitespace-pre-wrap">{displayContent}</p>
      {timestamp && (
        <div className="text-xs opacity-70 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
