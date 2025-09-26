// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * CONFIG
 * - COSMAX_CLIENT_KEY: if set, requests must include header `x-cosmax-key` with the same value.
 * - RATE_LIMIT_COUNT / RATE_LIMIT_WINDOW_MS: simple in-memory per-IP limiter.
 */
const REQUIRED_SHARED_KEY = process.env.COSMAX_CLIENT_KEY || "9zF!n8P@k2LmQ4xUv6YhRt$eW1a"; 
const RATE_LIMIT_COUNT = Number(process.env.RATE_LIMIT_COUNT ?? 30); // 
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000); // 

// Try these in order. If one 403/404s, we fall through to the next.
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-001",
] as const;

// ---- Types to avoid `any` ----
type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent };
type GeminiUsage = { usageMetadata?: { totalTokenCount?: number } };
type GeminiError = { error?: { message?: string; status?: string } };
type GeminiResponse = GeminiUsage &
  GeminiError & {
    candidates?: GeminiCandidate[];
  };

// ---- Tiny in-memory rate limiter (per-IP) ----
// NOTE: In serverless this resets when the function instance is cold-started or rotated.
// Good enough as a speed bump; use a shared store for stronger guarantees.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(key: string): {
  ok: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: RATE_LIMIT_COUNT - 1, reset: resetAt };
  }
  if (b.count >= RATE_LIMIT_COUNT) {
    return { ok: false, remaining: 0, reset: b.resetAt };
  }
  b.count += 1;
  return { ok: true, remaining: RATE_LIMIT_COUNT - b.count, reset: b.resetAt };
}

// ---- Helper to get client IP without `any` ----
function getClientIp(req: VercelRequest): string {
  const fwd = (req.headers["x-forwarded-for"] as string | undefined)
    ?.split(",")[0]
    ?.trim();
  if (fwd) return fwd;

  // Narrow socket type safely without `any`
  const socketLike = req.socket as unknown as { remoteAddress?: string | null };
  return socketLike?.remoteAddress ?? "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev / simple deployments
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-cosmax-key");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      reply: "Method Not Allowed",
      modelUsed: "unknown",
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    });
  }

  // ---- Lightweight shared-secret check (optional) ----
  if (REQUIRED_SHARED_KEY) {
    const provided = (
      req.headers["x-cosmax-key"] as string | undefined
    )?.trim();
    if (!provided || provided !== REQUIRED_SHARED_KEY) {
      // Minimal logging: do not log prompt or header values.
      console.warn("[auth] missing/invalid x-cosmax-key");
      return res.status(401).json({
        success: false,
        reply: "Unauthorized",
        modelUsed: "unknown",
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ---- Per-IP rate limit ----
  const ip = getClientIp(req);
  const rl = rateLimit(ip);
  res.setHeader("X-RateLimit-Limit", String(RATE_LIMIT_COUNT));
  res.setHeader("X-RateLimit-Remaining", String(rl.remaining));
  res.setHeader("X-RateLimit-Reset", String(rl.reset));
  if (!rl.ok) {
    return res.status(429).json({
      success: false,
      reply: `Rate limit exceeded. Try again after ${Math.max(
        0,
        rl.reset - Date.now()
      )}ms.`,
      modelUsed: "unknown",
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[config] Missing GEMINI_API_KEY");
      return res.status(500).json({
        success: false,
        reply: "Server configuration error - API key missing",
        modelUsed: "unknown",
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const { prompt } = (req.body ?? {}) as { prompt?: string };
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        reply: "Prompt is required",
        modelUsed: "unknown",
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }
    const cleanPrompt = prompt.trim();

    async function callGemini(model: (typeof MODEL_CANDIDATES)[number]) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const doFetch = () =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 🔒 Do NOT log this payload.
          body: JSON.stringify({
            contents: [{ parts: [{ text: cleanPrompt }] }],
          }),
        });

      let upstream = await doFetch();
      let data: GeminiResponse | undefined;
      try {
        data = (await upstream.json()) as GeminiResponse;
      } catch {
        data = undefined;
      }

      // One soft retry on 429
      if (upstream.status === 429) {
        const retryAfter = Number(upstream.headers.get("retry-after")) || 0; // seconds
        const waitMs =
          retryAfter > 0 && retryAfter <= 60 ? retryAfter * 1000 : 1500;
        await new Promise((r) => setTimeout(r, waitMs));
        upstream = await doFetch();
        try {
          data = (await upstream.json()) as GeminiResponse;
        } catch {
          data = undefined;
        }
      }

      return { upstream, data };
    }

    let lastStatus = 0;
    let lastMsg = "Gemini API error";

    for (const model of MODEL_CANDIDATES) {
      const started = Date.now();
      const { upstream, data } = await callGemini(model);

      if (upstream.ok) {
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
          "I couldn’t generate a reply.";
        const tokensUsed = Number(data?.usageMetadata?.totalTokenCount ?? 0);

        // Minimal success log, no prompt:
        console.info(
          `[chat] model=${model} status=${upstream.status} ms=${
            Date.now() - started
          }`
        );

        return res.status(200).json({
          success: true,
          reply,
          modelUsed: model,
          tokensUsed,
          timestamp: new Date().toISOString(),
        });
      }

      lastStatus = upstream.status;
      lastMsg =
        data?.error?.message || data?.error?.status || "Gemini API error";

      // Minimal error log (no prompt):
      console.warn(
        `[chat] model=${model} failed status=${upstream.status} msg="${lastMsg}"`
      );

      if (upstream.status === 403 || upstream.status === 404) {
        // try next candidate
        continue;
      }

      // For other statuses (e.g., 500), stop here
      return res.status(upstream.status).json({
        success: false,
        reply: lastMsg,
        modelUsed: model,
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // All candidates failed with 403/404 (access or retired)
    return res.status(lastStatus || 404).json({
      success: false,
      reply: `${lastMsg} — tried: ${MODEL_CANDIDATES.join(", ")}`,
      modelUsed: "unavailable",
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("💥 API handler error:", err);
    return res.status(500).json({
      success: false,
      reply: "Internal Server Error",
      modelUsed: "unknown",
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    });
  }
}
