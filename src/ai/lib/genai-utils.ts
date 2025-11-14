
/**
 * A server-only helper to list available models for debugging.
 * This should only be imported and used within server-side files (e.g., API routes).
 */
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Lists all generative models available to the configured API key.
 */
export async function listModels(): Promise<string[]> {
  try {
    const allModels = await googleAI().listModels();
    return allModels
      .map(m => m.name)
      .filter(name => name.includes('generateContent'));
  } catch (error) {
    console.error('Failed to list models:', error);
    return [];
  }
}

/**
 * Type guard to check if an error is a Google AI error with a specific structure.
 */
export function isGoogleAIError(
  error: any
): error is {reason: string; [key: string]: any} {
  return error && typeof error === 'object' && 'reason' in error;
}
