
import {NextRequest, NextResponse} from 'next/server';
import {genkit, z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {isGoogleAIError, listModels} from '@/ai/lib/genai-utils';

// Initialize Genkit and the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// Define the expected input schema from the client
const AIChatInputSchema = z.object({
  query: z.string().describe('The question asked by the farmer.'),
  image: z
    .string()
    .optional()
    .describe(
      "An optional image to provide context, as a data URI (e.g., 'data:image/jpeg;base64,...')."
    ),
});

/**
 * API route handler for the AI Chatbot.
 * All interactions with the Gemini API happen exclusively on the server.
 */
export async function POST(req: NextRequest) {
  // 1. Validate environment variables
  if (!process.env.GENAI_API_KEY && !process.env.GENAI_BEARER) {
    console.error(
      'FATAL: GENAI_API_KEY or GENAI_BEARER environment variable is not set.'
    );
    return NextResponse.json(
      {
        status: 'error',
        code: 'NOT_CONFIGURED',
        message:
          'The AI assistant is not configured. (Admin: Please set the GENAI_API_KEY or GENAI_BEARER environment variable)',
      },
      {status: 500}
    );
  }

  // 2. Parse and validate the incoming request body
  const body = await req.json();
  const parseResult = AIChatInputSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'BAD_REQUEST',
        message: 'Invalid request body.',
        diagnostics: parseResult.error.flatten(),
      },
      {status: 400}
    );
  }
  const {query, image} = parseResult.data;
  const modelId = process.env.GENAI_MODEL || 'gemini-pro';

  try {
    // 3. Generate content using the Gemini model
    const llmResponse = await ai.generate({
      model: modelId,
      prompt: [
        {
          text: `You are a helpful AI assistant for farmers. Answer the following question to the best of your ability, using the provided image if available. Question: ${query}`,
        },
        ...(image ? [{media: {url: image}}] : []),
      ],
    });

    const answer = llmResponse.text;
    if (!answer) {
      throw new Error('Model returned an empty response.');
    }

    // 4. Return the successful response
    return NextResponse.json({status: 'ok', answer});
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    // 5. Handle errors, including model not found
    if (isGoogleAIError(err) && err.reason === 'MODEL_NOT_FOUND') {
      const availableModels = await listModels();
      return NextResponse.json(
        {
          status: 'error',
          code: 'MODEL_NOT_FOUND',
          message: `The configured model '${modelId}' is not available to this API key.`,
          availableModels,
        },
        {status: 500}
      );
    }
    // Generic internal error for all other cases
    return NextResponse.json(
      {
        status: 'error',
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while processing the request.',
        diagnostics: {
          message: err.message || 'Unknown error',
        },
      },
      {status: 500}
    );
  }
}
