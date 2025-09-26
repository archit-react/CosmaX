// src/hooks/useTypewriter.ts
import { useState, useEffect } from "react";

interface UseTypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
}

export const useTypewriter = ({
  text,
  speed = 50,
  delay = 0,
}: UseTypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      return;
    }

    const startTyping = () => {
      let currentIndex = 0;

      const typeNextCharacter = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          // Use setTimeout with a function reference, not string
          setTimeout(typeNextCharacter, speed);
        } else {
          setIsComplete(true);
        }
      };

      // Start typing after delay
      setTimeout(typeNextCharacter, delay);
    };

    startTyping();
  }, [text, speed, delay]);

  return { displayText, isComplete };
};
