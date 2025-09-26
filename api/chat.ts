// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Try these in order. If one 403/404s, we fall through to the next.
const MODEL_CANDIDATES = [
  "gemini-2.5-flash", 
  "gemini-2.5-pro", 
  "gemini-2.5-flash-lite", 
  "gemini-2.0-flash-001", 
];

// Minimal types for Gemini responses (enough to avoid `any`)
type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent };
type GeminiUsage = { usageMetadata?: { totalTokenCount?: number } };
type GeminiError = { error?: { message?: string; status?: string } };
type GeminiResponse = GeminiUsage &
  GeminiError & {
    candidates?: GeminiCandidate[];
  };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev / simple deployments
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
    // ✅ From here on, use the validated/trimmed value (fixes “possibly undefined”)
    const cleanPrompt = prompt.trim();

    async function callGemini(model: string) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const doFetch = () =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: cleanPrompt }] }],
          }),
        });

      let upstream = await doFetch();

      // Try to parse JSON safely without `any`
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
      const { upstream, data } = await callGemini(model);

      if (upstream.ok) {
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
          "I couldn’t generate a reply.";
        const tokensUsed = Number(data?.usageMetadata?.totalTokenCount ?? 0);

        return res.status(200).json({
          success: true,
          reply,
          modelUsed: model,
          tokensUsed,
          timestamp: new Date().toISOString(),
        });
      }

      // record error for this candidate
      lastStatus = upstream.status;
      lastMsg =
        data?.error?.message || data?.error?.status || "Gemini API error";

      // If this is a pure access/not-found issue, try next candidate
      if (upstream.status === 403 || upstream.status === 404) {
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
