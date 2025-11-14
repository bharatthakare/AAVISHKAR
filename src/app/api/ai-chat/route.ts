// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { listModels, isGoogleAIError } from "@/ai/lib/genai-utils";

/* --- ENV --- */
const API_KEY = process.env.GENAI_API_KEY;
const MODEL_ID = process.env.GENAI_MODEL || "gemini-1.5-pro";

/* --- Genkit Initialization (FIXED: With API Key) --- */
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: API_KEY,
    }),
  ],
});

/* --- Input Schema --- */
const Schema = z.object({
  query: z.string().optional(),
  image: z.string().optional(),
});

/* --- Safety helper --- */
function safe(obj: any, n = 1500) {
  try {
    const s = typeof obj === "string" ? obj : JSON.stringify(obj);
    return s.length > n ? s.slice(0, n) + "…(truncated)" : s;
  } catch {
    return "unstringifiable";
  }
}

/* --- ROUTE --- */
export async function POST(req: NextRequest) {
  /* 1) Env validation */
  if (!API_KEY) {
    return NextResponse.json(
      {
        status: "error",
        code: "NOT_CONFIGURED",
        message: "GENAI_API_KEY missing. Add it in .env.local and restart.",
      },
      { status: 500 }
    );
  }

  /* 2) Parse body */
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    body = {};
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        code: "BAD_REQUEST",
        message: "Invalid JSON body",
        diagnostics: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { query, image } = parsed.data;
  const userText =
    (query && query.trim()) ||
    (image ? "Analyze the attached image." : "Hello");

  /* --- Build multimodal prompt --- */
  const prompt = [
    { text: `You are a farming assistant. Question: ${userText}` },
    ...(image ? [{ media: { url: image } }] : []),
  ];

  /* 3) Model call with error capture */
  const diagnostics: any = {
    model: MODEL_ID,
    prompt: safe(prompt),
    timestamp: new Date().toISOString(),
  };

  try {
    const out = await ai.generate({
      model: MODEL_ID,
      prompt,
    });

    diagnostics.raw = safe(out);

    const answer = out?.text;
    if (!answer) {
      return NextResponse.json(
        {
          status: "error",
          code: "NO_OUTPUT",
          message: "Model returned empty response.",
          diagnostics,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        answer,
        diagnostics,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("AI ERROR:", err);

    /* 4) Model not found */
    if (isGoogleAIError(err) && err.reason === "MODEL_NOT_FOUND") {
      const models = await listModels(API_KEY);
      return NextResponse.json(
        {
          status: "error",
          code: "MODEL_NOT_FOUND",
          message: `Model '${MODEL_ID}' is not available to this API key.`,
          availableModels: models,
          diagnostics,
        },
        { status: 500 }
      );
    }

    /* 5) Internal unknown error */
    diagnostics.error = {
      msg: err?.message || "unknown",
      stack: safe(err?.stack),
    };

    return NextResponse.json(
      {
        status: "error",
        code: "INTERNAL_ERROR",
        message: "Unexpected server error occurred.",
        diagnostics,
      },
      { status: 500 }
    );
  }
}
