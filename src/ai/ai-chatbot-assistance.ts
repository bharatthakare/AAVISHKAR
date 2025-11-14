
'use server';
/**
 * @fileOverview DEPRECATED AI Chatbot assistance flow.
 *
 * This flow is no longer in use. All logic has been moved to the
 * server-exclusive API route at `/src/app/api/ai-chat/route.ts`.
 *
 * This file is kept for historical purposes but can be safely deleted.
 */

import {genkit, z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';


const ai = genkit({
  plugins: [
    googleAI({
      // The API key is automatically read from the GENAI_API_KEY environment variable
    }),
  ],
});


export const AIChatbotAssistanceInputSchema = z.object({
  query: z.string(),
  image: z.string().optional(),
});
export type AIChatbotAssistanceInput = z.infer<
  typeof AIChatbotAssistanceInputSchema
>;

export const AIChatbotAssistanceOutputSchema = z.union([
  z.object({
    status: z.literal('ok'),
    answer: z.string(),
  }),
  z.object({
    status: z.literal('error'),
    code: z.string(),
    message: z.string(),
    diagnostics: z.any().optional(),
    availableModels: z.array(z.string()).optional(),
  }),
]);

export type AIChatbotAssistanceOutput = z.infer<
  typeof AIChatbotAssistanceOutputSchema
>;

export async function aiChatbotAssistance(
  input: AIChatbotAssistanceInput
): Promise<AIChatbotAssistanceOutput> {
  // This function is deprecated.
  // The client should now call the `/api/ai-chat` endpoint.
  return {
    status: 'error',
    code: 'DEPRECATED_FLOW',
    message:
      'This Genkit flow is deprecated. Please use the /api/ai-chat API route instead.',
  };
}
