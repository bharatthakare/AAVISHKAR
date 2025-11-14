
'use server';
/**
 * @fileOverview AI Chatbot assistance flow for farmers.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { isModelValid, listModels } from './lib/genai-utils';

// --- Zod Schemas for Input, Output, and Errors ---

const AIChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The question asked by the farmer.'),
  image: z.string().optional().describe("An optional image to provide context, as a data URI (e.g., 'data:image/jpeg;base64,...')."),
});
export type AIChatbotAssistanceInput = z.infer<typeof AIChatbotAssistanceInputSchema>;


const AIChatbotAssistanceOutputSchema = z.union([
  z.object({
    status: z.literal('ok'),
    answer: z.string().describe('The answer from the AI chatbot.'),
  }),
  z.object({
    status: z.literal('error'),
    code: z.enum([
      'NOT_CONFIGURED',
      'MODEL_NOT_FOUND',
      'MODEL_ERROR',
      'INTERNAL_ERROR',
    ]),
    message: z.string(),
    diagnostics: z.any().optional(),
    availableModels: z.array(z.string()).optional(),
  }),
]);
export type AIChatbotAssistanceOutput = z.infer<typeof AIChatbotAssistanceOutputSchema>;


// --- Main Flow Definition ---

let hasLoggedNotConfigured = false;

export async function aiChatbotAssistance(
  input: AIChatbotAssistanceInput
): Promise<AIChatbotAssistanceOutput> {
  const modelId = process.env.NEXT_PUBLIC_GENAI_MODEL || 'gemini-pro';

  // 1. Check if GENAI_API_KEY is configured
  if (!process.env.GENAI_API_KEY) {
    if (!hasLoggedNotConfigured) {
      console.error('FATAL: GENAI_API_KEY environment variable is not set.');
      hasLoggedNotConfigured = true;
    }
    return {
      status: 'error',
      code: 'NOT_CONFIGURED',
      message:
        'The AI assistant is not configured. (Admin: Please set the GENAI_API_KEY environment variable)',
    };
  }

  // 2. Validate the configured model as a pre-flight check
  const validation = await isModelValid(modelId);
  if (!validation.ok) {
    const allModels = await listModels();
    const availableIds = allModels.map(m => m.name.replace('models/', ''));
    
    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        error: "MODEL_NOT_FOUND",
        requested: modelId,
        available: availableIds.slice(0, 30) // Log a reasonable number
    }));

    return {
        status: 'error',
        code: 'MODEL_NOT_FOUND',
        message: `The configured model '${modelId}' is not available to this API key.`,
        availableModels: availableIds,
    };
  }

  // 3. Define and execute the prompt
  const ai = genkit({
    plugins: [
      googleAI({
        // The API key is automatically read from the GENAI_API_KEY environment variable
      }),
    ],
  });

  const assistancePrompt = ai.definePrompt({
      name: 'aiChatbotAssistancePrompt',
      input: { schema: AIChatbotAssistanceInputSchema },
      prompt: `You are a helpful AI assistant for farmers. Answer the following question to the best of your ability, using the provided image if available.

      Question: {{{query}}}

      {{#if image}}
      Image: {{media url=image}}
      {{/if}}`,
  });

  try {
    const { output } = await assistancePrompt(input, { model: modelId });
    
    const answer = output;
    if (!answer) {
        throw new Error("Model returned an empty response.");
    }
    return { status: 'ok', answer };

  } catch (err: any) {
    const errorDetails = {
        message: err.message || 'An unexpected error occurred.',
        status: err.status || err.cause?.status,
        body: err.cause?.body,
    };

    // This handles cases where the model is valid but the API call fails with a 404 for other reasons.
    if (errorDetails.status === 404 || errorDetails.status === 'NOT_FOUND' || err.name?.includes('NOT_FOUND') || errorDetails.message?.includes('not found')) {
        const allModels = await listModels();
        const availableIds = allModels.map(m => m.name.replace('models/', ''));
        return {
            status: 'error',
            code: 'MODEL_NOT_FOUND',
            message: `Model '${modelId}' not found during execution.`,
            diagnostics: errorDetails,
            availableModels: availableIds,
        };
    }

    if (errorDetails.status && errorDetails.status >= 500) {
        return {
            status: 'error',
            code: 'MODEL_ERROR',
            message: 'The AI model service is currently experiencing issues.',
            diagnostics: errorDetails,
        };
    }

    // Default internal error for anything else.
    return {
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while processing the request.',
      diagnostics: errorDetails,
    };
  }
}
