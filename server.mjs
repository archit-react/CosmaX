import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// --- Rate limiting middleware (50 requests per 5 minutes per IP) ---
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    reply: "Too many requests, please try again later.",
    modelUsed: "unavailable",
    tokensUsed: 0,
    timestamp: new Date().toISOString(),
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/", limiter); // apply to /api/* routes

/**
 * IMPORTANT:
 * Put a model you’re MOST likely to have access to first.
 */
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-001",
];

async function callGemini({ apiKey, prompt, model }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const doFetch = () =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt.trim() }] }],
      }),
    });

  let upstream = await doFetch();
  let data;
  try {
    data = await upstream.json();
  } catch {
    data = {};
  }

  // Soft retry for 429 rate limits
  if (upstream.status === 429) {
    const retryAfter = Number(upstream.headers.get("retry-after")) || 0; // seconds
    const waitMs =
      retryAfter > 0 && retryAfter <= 60 ? retryAfter * 1000 : 1500;
    console.warn(`[${model}] 429: backing off for ${waitMs}ms`);
    await new Promise((r) => setTimeout(r, waitMs));
    upstream = await doFetch();
    try {
      data = await upstream.json();
    } catch {
      data = {};
    }
  }

  return { upstream, data };
}

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const clientKey = process.env.COSMAX_CLIENT_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        reply: "Server error: Missing GEMINI_API_KEY",
        modelUsed: "unknown",
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }


    if (clientKey && req.headers["x-cosmax-key"] !== clientKey) {
      return res.status(403).json({
        success: false,
        reply: "Forbidden: Invalid client key",
        modelUsed: "unknown",
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        reply: "Prompt is required",
        modelUsed: "unknown",
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }

    console.log("🚀 /api/chat hit (prompt length:", prompt.length, ")");
    console.log("Trying models:", MODEL_CANDIDATES);

    let lastStatus = 0;
    let lastMsg = "Gemini API error";

    for (const model of MODEL_CANDIDATES) {
      console.log(`→ Trying model: ${model}`);
      const { upstream, data } = await callGemini({ apiKey, prompt, model });

      if (upstream.ok) {
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
          "I couldn’t generate a reply.";
        const tokensUsed = Number(data?.usageMetadata?.totalTokenCount ?? 0);

        console.log(`✅ Success with model: ${model}`);
        return res.json({
          success: true,
          reply,
          modelUsed: model,
          tokensUsed,
          timestamp: new Date().toISOString(),
        });
      }

      // Record + log error without exposing prompt
      lastStatus = upstream.status;
      const msg =
        data?.error?.message || data?.error?.status || "Gemini API error";
      lastMsg = msg;
      console.warn(`❌ ${model} failed [${upstream.status}]: ${msg}`);

      if (upstream.status === 403 || upstream.status === 404) {
        continue;
      }

      return res.status(upstream.status).json({
        success: false,
        reply: msg,
        modelUsed: model,
        tokensUsed: 0,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(lastStatus || 404).json({
      success: false,
      reply: `${lastMsg} — tried: ${MODEL_CANDIDATES.join(", ")}`,
      modelUsed: "unavailable",
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("💥 Server error:", err);
    return res.status(500).json({
      success: false,
      reply: "Internal Server Error",
      modelUsed: "unknown",
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
