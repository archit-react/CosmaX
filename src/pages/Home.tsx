// src/pages/Home.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ChatMessage from "../components/ChatMessage";
import ScrollToBottom from "../components/ScrollToBottom";
import ParticlesBackground from "../components/ParticlesBackground";
import CosmaXLogo from "../components/CosmaXLogo";
import type { ChatMessage as ChatMessageType } from "../types/chat";
import { askGemini } from "../services/gemini";
import SocialLinks from "../components/SocialLinks";
import Composer from "../components/Composer";

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
  const [compactHero, setCompactHero] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Rotate "thinking..." text
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setThinkingMessage(
        THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // show/hide "scroll to bottom" button
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

  // auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // compact hero when input is active or chat has history
  useEffect(() => {
    const el = document.getElementById("chat-input") as HTMLInputElement | null;
    if (!el) return;

    const update = () => {
      const focused = document.activeElement === el;
      const hasTyped = !!el.value.trim();
      const hasHistory = messages.length > 0;
      setCompactHero(focused || hasTyped || hasHistory);
    };

    el.addEventListener("focus", update);
    el.addEventListener("blur", update);
    el.addEventListener("input", update);
    update();

    return () => {
      el.removeEventListener("focus", update);
      el.removeEventListener("blur", update);
      el.removeEventListener("input", update);
    };
  }, [messages.length]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

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
        const reply = await askGemini(input);
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

  return (
    <div
      id="particles-container"
      className="relative flex flex-col min-h-screen text-zinc-100"
    >
      <ParticlesBackground />
      <SocialLinks />

      {/* Logo center → top-left */}
      <motion.div
        className="fixed z-20 pointer-events-none"
        initial={{
          top: "33%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          scale: 1,
          opacity: 1,
        }}
        animate={
          compactHero
            ? {
                top: "1rem",
                left: "0rem",
                x: -45,
                y: 0,
                scale: 0.65,
                opacity: 0.9,
              }
            : {
                top: "33%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                scale: 1,
                opacity: 1,
              }
        }
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <CosmaXLogo className="h-20 sm:h-24 w-auto [--bg:transparent]" />
      </motion.div>

      {/* Chat area */}
      <main className="relative z-10 flex flex-col flex-1 overflow-hidden">
        <div
          ref={containerRef}
          aria-live="polite"
          className="flex-1 overflow-y-auto px-3 sm:px-4 pt-20 sm:pt-24
                     pb-[calc(var(--composer-h,6.25rem)+env(safe-area-inset-bottom))]
                     overscroll-contain scroll-smooth touch-pan-y
                     scrollbar-thin scrollbar-thumb-zinc-700/60 scrollbar-track-transparent relative z-10"
        >
          <div className="mx-auto max-w-2xl space-y-4">
            {!compactHero && (
              <div
                className="fixed left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{ top: "calc(33% + 6.5rem)" }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-zinc-300">
                  On your call.
                </div>
              </div>
            )}

            {messages.length > 0 &&
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0d1114] flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                </div>
                <div className="bg-[#0d1114]/90 px-3 py-2 rounded-xl text-sm">
                  {thinkingMessage}
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-px" />
          </div>
        </div>

        <ScrollToBottom show={showScroll} onClick={scrollToBottom} />

        <Composer
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
