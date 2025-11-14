
import { NextRequest, NextResponse } from "next/server";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { listModels, isGoogleAIError } from "@/ai/lib/genai-utils";

/* --- ENVIRONMENT --- */
const API_KEY = process.env.GENAI_API_KEY;
const MODEL_ID = process.env.GENAI_MODEL || "gemini-1.5-pro";

/* --- GENKIT INITIALIZATION (IMPORTANT) --- */
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: API_KEY,
    }),
  ],
});

/* --- REQUEST BODY SCHEMA --- */
const Schema = z.object({
  query: z.string().optional(),
  image: z.string().optional(),
});

/* Utility to avoid crashing on long strings */
function safe(obj: any, limit = 1500) {
  try {
    const s = typeof obj === "string" ? obj : JSON.stringify(obj);
    return s.length > limit ? s.slice(0, limit) + "…(truncated)" : s;
  } catch {
    return "unserializable";
  }
}

export async function POST(req: NextRequest) {
  /* 1) ENV CHECK */
  if (!API_KEY) {
    return NextResponse.json(
      {
        status: "error",
        code: "NOT_CONFIGURED",
        message: "Missing GENAI_API_KEY in server environment.",
      },
      { status: 500 }
    );
  }

  /* 2) PARSE REQUEST BODY */
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
        diagnostics: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { query, image } = parsed.data;
  const qText =
    (query?.trim()) ||
    (image ? "Analyze the attached crop image." : "Hello!");

  const prompt = [
    { text: `You are a helpful agriculture assistant.\nQuestion: ${qText}` },
    ...(image ? [{ media: { url: image } }] : []),
  ];

  const diagnostics: any = {
    modelUsed: MODEL_ID,
    promptPreview: safe(prompt),
    timestamp: new Date().toISOString(),
  };

  /* 3) GENERATE AI RESPONSE */
  try {
    const result = await ai.generate({
      model: MODEL_ID,
      prompt,
    });

    diagnostics.rawOutput = safe(result);

    const answer = result?.text;
    if (!answer) {
      return NextResponse.json(
        {
          status: "error",
          code: "EMPTY_RESPONSE",
          message: "The model returned an empty response.",
          diagnostics,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        answer,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GENAI ERROR:", err);

    /* MODEL NOT FOUND */
    if (isGoogleAIError(err) && err.reason === "MODEL_NOT_FOUND") {
      const models = await listModels(API_KEY);
      return NextResponse.json(
        {
          status: "error",
          code: "MODEL_NOT_FOUND",
          message: `The model '${MODEL_ID}' is not available to this API key.`,
          availableModels: models,
          diagnostics,
        },
        { status: 500 }
      );
    }

    /* OTHER ERRORS */
    diagnostics.error = {
      message: err?.message,
      stack: safe(err?.stack),
    };

    return NextResponse.json(
      {
        status: "error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while processing the request.",
        diagnostics,
      },
      { status: 500 }
    );
  }
}
