
// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { listModels, isGoogleAIError } from "@/ai/lib/genai-utils";

/**
 * Diagnostic route:
 * - Configures Genkit with the API key
 * - Captures detailed diagnostics on failure (without printing secrets)
 * - ALWAYS returns a JSON body (success or error)
 */

const API_KEY = process.env.GENAI_API_KEY ?? null;
const MODEL_ID = process.env.GENAI_MODEL ?? "gemini-1.5-pro";

// Initialize genkit+google plugin (use API_KEY even if null)
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: API_KEY ?? undefined,
    }),
  ],
});

const Schema = z.object({
  query: z.string().optional(),
  image: z.string().optional(),
});

function safeTrim(value: any, n = 1000) {
  try {
    const s = typeof value === "string" ? value : JSON.stringify(value);
    return s.length > n ? s.slice(0, n) + "…(truncated)" : s;
  } catch {
    return String(value).slice(0, n);
  }
}

export async function POST(req: NextRequest) {
  const start = Date.now();

  // Basic env presence summary (do NOT return secret)
  const envSummary = {
    hasApiKey: Boolean(API_KEY),
    modelConfigured: MODEL_ID,
  };

  // Parse request safely
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        code: "BAD_REQUEST",
        message: "Invalid request payload.",
        diagnostics: { envSummary, zod: parsed.error.flatten() },
      },
      { status: 400 }
    );
  }
  const { query, image } = parsed.data;
  const qText = (query && query.trim()) || (image ? "Analyze attached image." : "Hello");

  const prompt = [
    { text: `You are a helpful agriculture assistant. Question: ${qText}` },
    ...(image ? [{ media: { url: image } }] : []),
  ];

  const diagnostics: any = {
    startedAt: new Date(start).toISOString(),
    envSummary,
    promptPreview: safeTrim(prompt.map((p: any) => (p.text ? p.text : "[media]")).join(" | ")),
    attempts: [],
  };

  // Try calling model with retries and detailed capture
  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const att: any = { attempt, ts: new Date().toISOString() };
    diagnostics.attempts.push(att);

    try {
      const resp = await ai.generate({
        model: MODEL_ID,
        prompt,
      });

      att.success = true;
      att.respPreview = safeTrim(resp, 2000);
      const answer = resp?.text ?? "";

      if (!answer) {
        att.success = false;
        att.reason = "EMPTY_RESPONSE";
        // return structured error
        return NextResponse.json(
          {
            status: "error",
            code: "NO_OUTPUT",
            message: "Model returned no output.",
            diagnostics,
          },
          { status: 500 }
        );
      }

      // success — return answer + diagnostics
      return NextResponse.json(
        {
          status: "ok",
          answer,
          diagnostics,
        },
        { status: 200 }
      );
    } catch (err: any) {
      att.success = false;
      att.error = {
        name: err?.name,
        message: safeTrim(err?.message),
      };
      // Try to read nested response info if available (fetch-style)
      try {
        if (err?.response) {
          const r = err.response;
          // attempt to read text (may throw)
          const txt = await (typeof r.text === "function" ? r.text() : Promise.resolve(String(r)));
          att.remote = {
            status: r.status,
            statusText: r.statusText,
            bodySnippet: safeTrim(txt, 2000),
          };
        }
      } catch (e) {
        att.remoteReadError = safeTrim(e?.message ?? e);
      }

      // If last attempt, collect models and return diagnostics
      if (attempt === maxAttempts) {
        try {
          const models = await listModels(API_KEY ?? undefined);
          diagnostics.availableModels = Array.isArray(models) ? models.slice(0, 50) : models;
        } catch (lmErr: any) {
          diagnostics.listModelsError = safeTrim(lmErr?.message ?? lmErr);
        }

        const finalCode =
          isGoogleAIError(err) && err.reason === "MODEL_NOT_FOUND" ? "MODEL_NOT_FOUND" : "INTERNAL_ERROR";

        diagnostics.endedAt = new Date().toISOString();
        diagnostics.elapsedMs = Date.now() - start;

        // log full diagnostics server-side
        console.error("AI diagnostics (server):", JSON.stringify(diagnostics, null, 2));

        return NextResponse.json(
          {
            status: "error",
            code: finalCode,
            message:
              finalCode === "MODEL_NOT_FOUND"
                ? `Configured model '${MODEL_ID}' is not available to this API key.`
                : "An unexpected error occurred while processing the request.",
            diagnostics,
            availableModels: diagnostics.availableModels ?? undefined,
          },
          { status: 500 }
        );
      }

      // else: small backoff and retry
      await new Promise((r) => setTimeout(r, attempt === 1 ? 200 : 500));
    }
  }

  // fallback — should not reach
  return NextResponse.json(
    {
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Unexpected code path.",
      diagnostics,
    },
    { status: 500 }
  );
}
