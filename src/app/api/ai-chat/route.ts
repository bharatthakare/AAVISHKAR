
import { NextRequest, NextResponse } from "next/server";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { listModels, isGoogleAIError } from "@/ai/lib/genai-utils";

// --- FIXED: Proper GoogleAI plugin configuration ---
const apiKey = process.env.GENAI_API_KEY;
const modelId = process.env.GENAI_MODEL || "gemini-1.5-pro";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey, // IMPORTANT — This was missing!
    }),
  ],
});

// Input validation
const AIChatInputSchema = z.object({
  query: z.string(),
  image: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // 1 — Env check
  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        code: "NOT_CONFIGURED",
        message:
          "GENAI_API_KEY is missing. Please set it in your .env.local file.",
      },
      { status: 500 }
    );
  }

  // 2 — Validate request
  const body = await req.json();
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

  try {
    // 3 — Call Gemini (this was previously failing silently)
    const response = await ai.generate({
      model: modelId,
      prompt: [
        {
          text: `You are a helpful agriculture assistant. Question: ${query}`,
        },
        ...(image
          ? [
              {
                media: {
                  url: image, // Supported for data:image/... base64
                },
              },
            ]
          : []),
      ],
    });

    const answer = response.text;

    if (!answer) {
      throw new Error("Empty response from model.");
    }

    // 4 — Success
    return NextResponse.json({ status: "ok", answer });
  } catch (err: any) {
    console.error("AI ERROR:", err);

    // MODEL MISSING
    if (isGoogleAIError(err) && err.reason === "MODEL_NOT_FOUND") {
      const availableModels = await listModels();
      return NextResponse.json(
        {
          status: "error",
          code: "MODEL_NOT_FOUND",
          message: `Model '${modelId}' is not available for this API key.`,
          availableModels,
        },
        { status: 500 }
      );
    }

    // GENERIC ERROR (your previous error)
    return NextResponse.json(
      {
        status: "error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while processing the request.",
        diagnostics: { message: err?.message || "Unknown runtime error" },
      },
      { status: 500 }
    );
  }
}
