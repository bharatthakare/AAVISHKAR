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


export interface GenaiDiagnostics {
    status: number;
    statusText: string;
    bodySnippet: string;
    modelId: string;
    attempt: number;
    availableModels?: string[];
}

interface GenerateContentResult {
    response?: any;
    diagnostics?: GenaiDiagnostics;
}

/**
 * Calls the generateContent endpoint with retries and detailed diagnostics.
 * @param modelId The primary model ID to use (e.g., 'gemini-1.5-pro-latest').
 * @param payload The request payload for the generateContent API.
 * @param retries The number of times to retry on failure.
 * @returns {Promise<GenerateContentResult>} A promise that resolves to the API response or diagnostics.
 */
export async function generateContentWithDiagnostics(
    modelId: string,
    payload: any,
    retries = 1
): Promise<GenerateContentResult> {
    const modelName = modelId.startsWith('models/') ? modelId : `models/${modelId}`;
    let lastError: any = null;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const result = await generateContent(modelName, payload);
            // Check for empty or useless response
            if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
                 lastError = new Error('Model returned an empty or invalid response.');
                 lastError.status = 200; // It's not a transport error
                 continue; // Retry
            }
            return { response: result };
        } catch (error: any) {
            lastError = error;
            console.error(`Attempt ${attempt} failed for model ${modelName}: [${error.status}] ${error.message}`);
            
            if (attempt <= retries) {
                await new Promise(res => setTimeout(res, 250 * attempt)); // Exponential backoff
            }
        }
    }

    // All retries failed, construct detailed diagnostics
    const diagnostics: GenaiDiagnostics = {
        status: lastError.status || 500,
        statusText: lastError.statusText || 'Internal Server Error',
        bodySnippet: lastError.message.substring(0, 500),
        modelId: modelName,
        attempt: retries + 1,
    };

    // If 404, fetch and include available models
    if (diagnostics.status === 404) {
        try {
            const availableModels = await listModels();
            diagnostics.availableModels = availableModels.map(m => m.name.replace('models/', ''));
        } catch (listError: any) {
            console.error('Failed to retrieve model list for diagnostics:', listError.message);
        }
    }

    return { diagnostics };
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
    error.statusText = response.statusText;
    throw error;
  }

  return response.json();
}
