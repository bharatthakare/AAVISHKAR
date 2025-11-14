// src/ai/ai-chatbot-assistance.ts
'use server';

/**
 * @fileOverview AI Chatbot assistance flow for farmers.
 *
 * - aiChatbotAssistance - A function that handles the chatbot assistance process.
 * - AIChatbotAssistanceInput - The input type for the aiChatbotAssistance function.
 * - AIChatbotAssistanceOutput - The return type for the aiChatbotAssistance function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
});

const AIChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The question asked by the farmer.'),
  image: z.string().optional().describe("An optional image to provide context, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AIChatbotAssistanceInput = z.infer<typeof AIChatbotAssistanceInputSchema>;

const AIChatbotAssistanceOutputSchema = z.object({
  answer: z.string().describe('The answer from the AI chatbot.'),
});
export type AIChatbotAssistanceOutput = z.infer<typeof AIChatbotAssistanceOutputSchema>;

export async function aiChatbotAssistance(input: AIChatbotAssistanceInput): Promise<AIChatbotAssistanceOutput> {
  return aiChatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotAssistancePrompt',
  input: {schema: AIChatbotAssistanceInputSchema},
  output: {schema: AIChatbotAssistanceOutputSchema},
  prompt: `You are a helpful AI assistant for farmers. Answer the following question to the best of your ability, using the provided image if available.

Question: {{{query}}}

{{#if image}}
Image: {{media url=image}}
{{/if}}`,
});

const aiChatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'aiChatbotAssistanceFlow',
    inputSchema: AIChatbotAssistanceInputSchema,
    outputSchema: AIChatbotAssistanceOutputSchema,
  },
  async input => {
    const modelId = process.env.GENAI_MODEL || 'gemini-1.5-flash';
    
    try {
        const {output} = await prompt(input, { model: modelId });
        return output!;
    } catch (error: any) {
        console.error('AI Chatbot Assistance Error:', error);
        return {
            answer: "I'm sorry, but the AI assistant is temporarily unavailable. Please try again later. (Admin: Check model configuration and availability).",
        };
    }
  }
);
