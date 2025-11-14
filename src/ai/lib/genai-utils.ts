// You must install `node-fetch` for this module to work in a Node.js environment older than v18.
// `npm install node-fetch`
// Since Next.js uses a recent Node.js version, global fetch should be available.
import fetch from 'node-fetch';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface Model {
  name: string;
  supportedGenerationMethods: string[];
}

/**
 * Lists available generative models from the Google AI API.
 * @returns {Promise<Model[]>} A promise that resolves to an array of available models.
 */
export async function listModels(): Promise<Model[]> {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    throw new Error('GENAI_API_KEY environment variable is not set.');
  }

  const url = `${API_BASE_URL}/models?key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to list models: [${response.status}] ${await response.text()}`);
  }

  const data: { models: Model[] } = await response.json() as { models: Model[] };
  return data.models;
}

/**
 * Calls the generateContent endpoint with automatic fallback logic.
 * @param modelId The primary model ID to use (e.g., 'models/gemini-1.5-pro-latest').
 * @param payload The request payload for the generateContent API.
 * @returns {Promise<any>} A promise that resolves to the API response.
 */
export async function generateContentWithFallback(modelId: string, payload: any): Promise<any> {
  const modelName = modelId.startsWith('models/') ? modelId : `models/${modelId}`;

  try {
    return await generateContent(modelName, payload);
  } catch (error: any) {
    if (error.status === 404) {
      console.error(`Model '${modelName}' not found. Attempting to find a fallback.`);
      const availableModels = await listModels();
      const availableModelIds = availableModels.map(m => m.name);
      console.error('Available models:', JSON.stringify(availableModels, null, 2));

      const fallbackModelId = process.env.GENAI_FALLBACK_MODEL;
      if (fallbackModelId) {
        const fallbackModelName = `models/${fallbackModelId}`;
        if (availableModelIds.includes(fallbackModelName)) {
          console.log(`Found fallback model '${fallbackModelName}'. Retrying...`);
          return await generateContent(fallbackModelName, payload);
        }
      }

      throw new Error(
        `Primary model '${modelName}' not found and no valid fallback was available. Available models: ${availableModelIds.join(', ')}`
      );
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * A direct wrapper for the generateContent API call.
 * @param modelName The full model name (e.g., 'models/gemini-pro').
 * @param payload The request payload.
 * @returns {Promise<any>} The API response.
 */
async function generateContent(modelName: string, payload: any): Promise<any> {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) {
    throw new Error('GENAI_API_KEY environment variable is not set.');
  }

  const url = `${API_BASE_URL}/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const error: any = new Error(`Failed to fetch from ${url}: [${response.status} ${response.statusText}] ${errorBody}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
