
/**
 * A server-only helper to list available models for debugging.
 * This should only be imported and used within server-side files (e.g., API routes).
 */
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Lists all generative models available to the configured API key.
 * This function is temporary for diagnostic purposes.
 * @param apiKey The Google AI API key.
 */
export async function listModels(apiKey: string): Promise<string[] | null> {
  // This uses a direct fetch call to avoid initializing a new Genkit instance,
  // which can be problematic in some serverless environments.
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Failed to list models from Google AI. Status: ${
          response.status
        }, Body: ${await response.text()}`
      );
      return null;
    }
    const data = await response.json();
    return (data?.models ?? [])
      .map((m: any) => m.name)
      .filter((name: string) => name.includes('generateContent'));
  } catch (error: any) {
    console.error('Error fetching model list:', error.message);
    return null;
  }
}

/**
 * Type guard to check if an error is a Google AI error with a specific structure.
 */
export function isGoogleAIError(
  error: any
): error is { reason: string; [key: string]: any } {
  return error && typeof error === 'object' && 'reason' in error;
}
