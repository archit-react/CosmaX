// src/components/SocialLinks.tsx
import { Github, Linkedin } from "lucide-react";

export default function SocialLinks() {
  return (
    <div
      className="fixed top-4 right-4 z-30 flex items-center gap-2
                 rounded-xl border border-zinc-800/60 bg-[#0b1117]/70
                 backdrop-blur-sm px-2 py-1 shadow-[0_8px_30px_rgba(0,0,0,.25)]"
      aria-label="Social links"
    >
      <a
        href="https://github.com/archit-react"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-zinc-300 hover:text-white
                   hover:bg-zinc-800/60 transition-colors"
        aria-label="GitHub"
        title="GitHub"
      >
        <Github className="h-5 w-5" />
      </a>

      <a
        href="https://www.linkedin.com/in/archit-linked/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-zinc-300 hover:text-white
                   hover:bg-zinc-800/60 transition-colors"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </a>
    </div>
  );
}
