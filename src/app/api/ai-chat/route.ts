// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { listModels, isGoogleAIError } from "@/ai/lib/genai-utils";

/**
 * DIAGNOSTIC ROUTE
 * This route returns rich diagnostics when an error happens so we can identify the root cause.
 * Remove / simplify diagnostics after debugging.
 */

// load env
const API_KEY = process.env.GENAI_API_KEY;
const MODEL_ID = process.env.GENAI_MODEL || "gemini-1.5-pro";

// configure genkit + google plugin with API key (required)
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: API_KEY,
    }),
  ],
});

// input schema
const AIChatInputSchema = z.object({
  query: z.string().optional(),
  image: z.string().optional(),
});

function safeTrim(s: any, n = 1000) {
  if (s == null) return null;
  try {
    const str = typeof s === "string" ? s : JSON.stringify(s);
    return str.length > n ? str.slice(0, n) + "…(truncated)" : str;
  } catch {
    return String(s).slice(0, n);
  }
}

export async function POST(req: NextRequest) {
  // basic env checks
  if (!API_KEY) {
    return NextResponse.json(
      {
        status: "error",
        code: "NOT_CONFIGURED",
        message:
          "GENAI_API_KEY is missing on the server. Please set it in .env.local and restart.",
      },
      { status: 500 }
    );
  }

  if (!MODEL_ID) {
    return NextResponse.json(
      {
        status: "error",
        code: "NOT_CONFIGURED",
        message:
          "GENAI_MODEL is missing on the server. Please set GENAI_MODEL (e.g. gemini-1.5-pro).",
      },
      { status: 500 }
    );
  }

  // parse body
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    body = {};
  }

  const parsed = AIChatInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        code: "BAD_REQUEST",
        message: "Invalid request body.",
        diagnostics: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { query, image } = parsed.data;
  const userText = (query && String(query).trim()) || (image ? "Analyze the attached image." : "Hello");

  // Build prompt
  const prompt = [
    { text: `You are a helpful agriculture assistant. Question: ${userText}` },
    ...(image ? [{ media: { url: image } }] : []),
  ];

  // Attempt to call model with detailed diagnostics and retries
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    modelConfigured: MODEL_ID,
    promptSummary: safeTrim(prompt.map((p) => (p.text ? p.text : "[media]")).join(" | "), 1000),
    attempts: [],
  };

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const attemptDiag: any = { attempt, startedAt: new Date().toISOString() };
    diagnostics.attempts.push(attemptDiag);

    try {
      const resp = await ai.generate({
        model: MODEL_ID,
        prompt,
        // small timeout not supported directly by genkit; rely on fetch defaults
      });

      attemptDiag.success = true;
      attemptDiag.rawResponse = safeTrim(resp, 2000);
      const answer = resp?.text ?? "";

      if (!answer) {
        // model returned empty; capture and continue (no retry on empty by default)
        attemptDiag.success = false;
        attemptDiag.reason = "EMPTY_RESPONSE";
        diagnostics.final = { status: "error", code: "NO_OUTPUT", message: "Model returned empty response", diagnostics };
        // break out and return diagnostics
        return NextResponse.json(diagnostics.final, { status: 500 });
      }

      // success - return answer with diagnostics
      return NextResponse.json(
        {
          status: "ok",
          answer,
          raw: { bodySnippet: safeTrim(resp, 2000) },
          diagnostics,
        },
        { status: 200 }
      );
    } catch (err: any) {
      // capture as much as possible
      attemptDiag.success = false;
      attemptDiag.errorMessage = safeTrim(err?.message ?? err);
      attemptDiag.errorName = err?.name;
      attemptDiag.stack = safeTrim(err?.stack, 2000);

      // If the error object has a response (typical when using fetch), try to read it
      try {
        if (err?.response) {
          const res = err.response;
          // attempt to read text (may be a stream)
          const text = await (res.text ? res.text() : Promise.resolve(String(res)));
          attemptDiag.remoteStatus = res.status;
          attemptDiag.remoteStatusText = res.statusText;
          attemptDiag.remoteBodySnippet = safeTrim(text, 2000);
        }
      } catch (readErr: any) {
        attemptDiag.remoteReadError = String(readErr?.message ?? readErr);
      }

      // If attempt < max, wait a bit before retrying
      attemptDiag.endedAt = new Date().toISOString();
      if (attempt < maxAttempts) {
        // small backoff
        await new Promise((r) => setTimeout(r, attempt === 1 ? 200 : 500));
        continue;
      }

      // final failure after retries — gather listModels and return diagnostics
      try {
        const models = await listModels(API_KEY);
        diagnostics.availableModels = models?.slice?.(0, 50) ?? null;
      } catch (lmErr: any) {
        diagnostics.listModelsError = safeTrim(lmErr?.message ?? lmErr, 1000);
      }

      diagnostics.final = {
        status: "error",
        code: isGoogleAIError(err) && err.reason === "MODEL_NOT_FOUND" ? "MODEL_NOT_FOUND" : "INTERNAL_ERROR",
        message:
          isGoogleAIError(err) && err.reason === "MODEL_NOT_FOUND"
            ? `Configured model '${MODEL_ID}' is not available to this API key.`
            : "An unexpected error occurred while processing the request.",
        diagnostics,
      };

      // log full diagnostics server-side
      console.error("AI diagnostics (server):", JSON.stringify(diagnostics, null, 2));

      return NextResponse.json(diagnostics.final, { status: 500 });
    }
  }

  // fallback (shouldn't reach)
  return NextResponse.json(
    { status: "error", code: "INTERNAL_ERROR", message: "Reached unexpected code path." },
    { status: 500 }
  );
}
