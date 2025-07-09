// Handles the Gemini API request and returns a cleaned response
export async function askGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Fail fast if API key is missing
  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Set VITE_GEMINI_API_KEY in .env"
    );
  }

  try {
    // Call Gemini API with user's prompt
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt.trim() }] }],
        }),
      }
    );

    // Throw if API returns error status
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Gemini API error: ${errorData.error?.message || res.statusText}`
      );
    }

    // Extract the generated reply
    const data = await res.json();
    const rawReply: string = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawReply) return "Gemini returned an empty response.";

    // Cleanup: fix word merges, spacing, and formatting
    const cleaned: string = rawReply
      .replace(/([a-z])([A-Z])/g, "$1 $2") // "Idon't" → "I don't"
      .replace(/([a-zA-Z])(\d)/g, "$1 $2") // "FIFA3" → "FIFA 3"
      .replace(
        /(^|\s)([a-z])([a-z]{2,})/g,
        (match: string, space: string, firstLetter: string, rest: string) => {
          const commonWords = ["ay", "i", "ello", "eah"];
          return commonWords.includes(rest.toLowerCase())
            ? `${space}${firstLetter.toUpperCase()}${rest}`
            : match;
        }
      )
      .replace(/\s+/g, " ") // Collapse extra whitespace
      .trim();

    return cleaned;
  } catch (error) {
    console.error("askGemini() failed:", error);
    return `Failed to fetch Gemini response: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}
