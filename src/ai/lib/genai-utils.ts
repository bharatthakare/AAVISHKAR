
// You may need to install `node-fetch` for this module to work in Node.js environments older than v18.
// `npm install node-fetch`
// Since Next.js uses a recent Node.js version, global fetch should be available.

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface Model {
  name: string;
  supportedGenerationMethods: string[];
}

export interface GenaiListModelsOptions {
  apiKey?: string;
  bearer?: string;
}

/**
 * Lists available generative models from the Google AI API.
 * @param {GenaiListModelsOptions} [opts] - Authentication options.
 * @returns {Promise<Model[]>} A promise that resolves to an array of available models.
 */
export async function listModels(opts?: GenaiListModelsOptions): Promise<Model[]> {
  const apiKey = opts?.apiKey || process.env.GENAI_API_KEY;
  const bearer = opts?.bearer || process.env.GENAI_BEARER;

  if (!apiKey && !bearer) {
    throw new Error('Either GENAI_API_KEY or GENAI_BEARER environment variable must be set.');
  }

  const url = `${API_BASE_URL}/models?key=${apiKey}`;
  const headers = bearer ? { Authorization: `Bearer ${bearer}` } : {};
  const finalUrl = bearer ? `${API_BASE_URL}/models` : url;

  const response = await fetch(finalUrl, { headers });

  if (!response.ok) {
    throw new Error(`Failed to list models: [${response.status}] ${await response.text()}`);
  }

  const data: { models: Model[] } = await response.json() as { models: Model[] };
  return data.models;
}


export interface GenaiValidationResult {
    ok: boolean;
    reason?: 'NOT_FOUND' | 'UNSUPPORTED_METHOD';
}

/**
 * Checks if a given model ID is valid and supports the 'generateContent' method.
 * @param modelId The model ID to validate (e.g., 'gemini-1.5-pro').
 * @param {GenaiListModelsOptions} [opts] - Authentication options.
 * @returns {Promise<GenaiValidationResult>} A promise that resolves to a validation result.
 */
export async function isModelValid(modelId: string, opts?: GenaiListModelsOptions): Promise<GenaiValidationResult> {
    try {
        const models = await listModels(opts);
        const model = models.find(m => m.name.endsWith(`/${modelId}`));

        if (!model) {
            return { ok: false, reason: 'NOT_FOUND' };
        }
        if (!model.supportedGenerationMethods.includes('generateContent')) {
            return { ok: false, reason: 'UNSUPPORTED_METHOD' };
        }
        return { ok: true };
    } catch (error) {
        console.error("Error during model validation:", error);
        // Fail open in case of network error, let the actual call handle it.
        return { ok: true };
    }
}
