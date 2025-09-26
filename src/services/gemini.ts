// src/services/gemini.ts

export type GeminiReply = {
  success: boolean;
  reply: string;
  modelUsed: string;
  tokensUsed: number;
  timestamp: string;
};

// Label only; server decides actual model.
export const DEFAULT_MODEL = "gemini-2.5-flash";

interface BackendResponse {
  success?: boolean;
  reply?: string;
  modelUsed?: string;
  tokensUsed?: number;
  timestamp?: string;
  error?: string;
}

/**
 * Ask the backend (proxying Gemini) for a reply.
 * - Never sends API keys from the browser
 * - Lets the backend choose the actual model (no model is sent)
 * - Times out gently to avoid stuck spinners
 */
export async function askGemini(
  prompt: string,
  opts?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<GeminiReply> {
  const timeoutMs = opts?.timeoutMs ?? 25_000;

  // Simple guard to avoid empty requests
  const cleanPrompt = String(prompt ?? "").trim();
  if (!cleanPrompt) {
    return {
      success: false,
      reply: "Please enter a prompt.",
      modelUsed: DEFAULT_MODEL,
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // AbortController for request timeout / cancellation
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  if (opts?.signal) {
    opts.signal.addEventListener("abort", () => ac.abort(), { once: true });
  }

  try {
    // 🔐 Build headers (conditionally include the shared secret)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const shared = import.meta.env.VITE_COSMAX_CLIENT_KEY as string | undefined;
    if (shared) headers["x-cosmax-key"] = shared;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt: cleanPrompt }),
      signal: ac.signal,
    });

    const data = await safeJson<BackendResponse>(res);

    if (!res.ok || !data?.success) {
      const msg =
        data?.reply ||
        data?.error ||
        `Request failed with status ${res.status}`;
      throw new Error(msg);
    }

    return {
      success: true,
      reply: cleanup(String(data.reply ?? "")),
      modelUsed: String(data.modelUsed ?? DEFAULT_MODEL),
      tokensUsed: Number(data.tokensUsed ?? 0),
      timestamp: String(data.timestamp ?? new Date().toISOString()),
    };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.name === "AbortError"
          ? "Request timed out. Please try again."
          : e.message
        : String(e);

    return {
      success: false,
      reply: `Failed to fetch Gemini response: ${message}`,
      modelUsed: DEFAULT_MODEL,
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Safely parse JSON; returns undefined on failure (no `any`) */
async function safeJson<T>(res: Response): Promise<T | undefined> {
  try {
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}

/** Light cleanup for readability in bubbles */
function cleanup(text: string): string {
  if (!text) return "Gemini returned an empty response.";

  const fenced = text.match(/^```[\s\S]*?\n([\s\S]*?)```$/);
  const body = fenced ? fenced[1] : text;

  return body
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}
