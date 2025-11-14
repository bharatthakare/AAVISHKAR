// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Server-side helper to list models, used for debugging.
async function listAvailableModels(apiKey: string): Promise<string[] | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return (data?.models ?? [])
      .map((m: any) => m.name.replace('models/', ''))
      .filter((name: string) => name.includes('gemini'));
  } catch (error) {
    return null;
  }
}

// Type guard for Google AI errors from Genkit
function isGoogleAIError(
  error: any
): error is { reason: string; [key: string]: any } {
  return error && typeof error === 'object' && 'reason' in error;
}

// Input validation schema
const AIChatInputSchema = z.object({
  query: z.string().optional(),
  image: z.string().optional(), // Expects a base64 data URI
});

/**
 * Server-only API route to interact with the Gemini API.
 */
export async function POST(req: NextRequest) {
  // 1. Get and validate server-side environment variables
  const apiKey = process.env.GENAI_API_KEY;
  const modelId = process.env.GENAI_MODEL || 'gemini-1.5-pro';

  if (!apiKey) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'NOT_CONFIGURED',
        message: 'The GENAI_API_KEY environment variable is not set on the server.',
      },
      { status: 500 }
    );
  }

  // 2. Initialize Genkit with the server-side API key
  const ai = genkit({
    plugins: [
      googleAI({
        apiKey: apiKey,
      }),
    ],
  });

  // 3. Parse and validate the incoming request body
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'BAD_REQUEST',
        message: 'Invalid JSON body.',
      },
      { status: 400 }
    );
  }

  const parsed = AIChatInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'BAD_REQUEST',
        message: 'Invalid request body.',
        diagnostics: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { query, image } = parsed.data;
  const userText = query?.trim() || (image ? 'Analyze this image.' : 'Hello.');

  // 4. Construct the multimodal prompt for Gemini
  const prompt = [
    { text: `You are a helpful agriculture assistant named KisanAI. Question: ${userText}` },
    ...(image ? [{ media: { url: image } }] : []),
  ];

  // 5. Call the model with robust error handling
  try {
    const response = await ai.generate({
      model: modelId,
      prompt,
    });

    const answer = response.text;

    if (!answer) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'EMPTY_RESPONSE',
          message: 'The model returned an empty response.',
        },
        { status: 500 }
      );
    }

    // Success!
    return NextResponse.json({ status: 'ok', answer });

  } catch (err: any) {
    console.error('[AI_CHAT_ERROR]', err); // Log the full error on the server

    // Handle specific model-not-found errors
    if (isGoogleAIError(err) && err.reason === 'MODEL_NOT_FOUND') {
      const availableModels = await listAvailableModels(apiKey);
      return NextResponse.json(
        {
          status: 'error',
          code: 'MODEL_NOT_FOUND',
          message: `The configured model '${modelId}' is not available for this API key.`,
          availableModels: availableModels,
        },
        { status: 500 }
      );
    }

    // Handle all other errors
    return NextResponse.json(
      {
        status: 'error',
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while processing the request.',
        diagnostics: {
          errorName: err.name,
          errorMessage: err.message,
        },
      },
      { status: 500 }
    );
  }
}
