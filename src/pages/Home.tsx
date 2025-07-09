import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";
import ChatMessage from "../components/ChatMessage";
import Header from "../components/Header";
import ScrollToBottom from "../components/ScrollToBottom";
import type { ChatMessage as ChatMessageType } from "../types/chat";
import { askGemini } from "../services/gemini"; // Imported Gemini API

const MAX_MESSAGE_LENGTH = 2000;
const THINKING_MESSAGES = [
  "Processing your request...",
  "Generating response...",
  "Analyzing your query...",
  "Working on it...",
];

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState(THINKING_MESSAGES[0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setThinkingMessage(
        THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setShowScroll(!atBottom);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!input.trim() || isLoading || input.length > MAX_MESSAGE_LENGTH)
        return;

      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const reply = await askGemini(input); // Using Gemini API
        const botMessage: ChatMessageType = {
          id: Date.now().toString(),
          role: "bot",
          content: reply || "I couldn't generate a response. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Gemini Error:", error);
        const errorMessage: ChatMessageType = {
          id: Date.now().toString(),
          role: "bot",
          content: "Sorry, I encountered an error. Please try again later.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white transition-colors duration-300">
      <Header />

      <main className="flex flex-col flex-1 overflow-hidden">
        <div
          ref={containerRef}
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        >
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <h2 className="text-xl font-medium mb-2">
                  Start a conversation
                </h2>
                <p className="text-sm">Ask anything you'd like to know</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))
            )}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500 dark:text-zinc-400" />
                </div>
                <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm">
                  {thinkingMessage}
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-px" />
          </div>
        </div>

        <ScrollToBottom show={showScroll} onClick={scrollToBottom} />

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 p-4"
        >
          <div className="mx-auto max-w-2xl flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                maxLength={MAX_MESSAGE_LENGTH}
                placeholder="Type your message..."
                aria-label="Chat input"
                className="w-full p-3 pr-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
              {input.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 dark:text-zinc-400">
                  {input.length}/{MAX_MESSAGE_LENGTH}
                </span>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={
                !input.trim() || isLoading || input.length > MAX_MESSAGE_LENGTH
              }
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizonal className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
}
