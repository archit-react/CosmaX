import { useEffect, useState } from "react";

export function useTypewriter(originalText: string, speed = 20) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const padding = "##"; // Dummy invisible characters
    const paddedText = padding + originalText;
    let index = 0;

    setDisplayed(""); // Reset on new input

    const interval = setInterval(() => {
      const nextChar = paddedText.charAt(index);
      if (index >= padding.length) {
        setDisplayed((prev) => prev + nextChar); // Start showing after padding
      }
      index++;
      if (index >= paddedText.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [originalText, speed]);

  return displayed;
}
