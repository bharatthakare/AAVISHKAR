
'use server';

/**
 * @fileOverview This file implements the AI Disease Detection flow.
 * It validates and preprocesses an image, sends it to a GenAI model,
 * and returns a structured diagnosis or re-throws a detailed error for the API route to handle.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  validateImage,
  preprocessImage,
  analyzeImageQuality,
} from '../lib/imageUtils';
import {
    AIDiseaseDetectionInputSchema,
    AIDiseaseDetectionOutputSchema,
    type AIDiseaseDetectionInput,
    type AIDiseaseDetectionOutput,
    DiagnosisSchema
} from '@/ai/schemas/disease-detection';

const ai = genkit({
  plugins: [
    googleAI({
      // The API key is automatically read from the GENAI_API_KEY environment variable
    }),
  ],
});


// --- Helper Functions ---

function dataUriToBuffer(dataUri: string): Buffer {
  return Buffer.from(dataUri.split(',')[1], 'base64');
}

/**
 * Creates a structured error output. This is used for controlled, non-fatal
 * errors like blurry images, where we still want to give the user feedback.
 * For true exceptions, the flow will throw, and the API route will catch it.
 */
function createKnownErrorOutput(
  code: Extract<AIDiseaseDetectionOutput, { status: 'error' }>['code'],
  message: string,
  diagnostics?: any
): AIDiseaseDetectionOutput {
    return { status: 'error', code, message, diagnostics };
}


// --- Main Flow ---

export async function aiDiseaseDetection(
  input: AIDiseaseDetectionInput
): Promise<AIDiseaseDetectionOutput> {
  return aiDiseaseDetectionFlow(input);
}

const promptTemplate = `You are an expert AI botanist. Analyze the following image of a plant leaf. Identify any diseases, list its symptoms, and provide a comprehensive treatment plan.
Respond in a valid JSON format based on the following schema. If no disease is detected, state that the plant appears healthy.

Output JSON Schema:
{
  "diseaseName": "string",
  "symptoms": ["string"],
  "confidence": "number (0.0 to 1.0)",
  "solution": "string",
  "pesticideRecommendation": "string",
  "preventiveMeasures": ["string"]
}`;


const aiDiseaseDetectionFlow = ai.defineFlow(
  {
    name: 'aiDiseaseDetectionFlow',
    inputSchema: AIDiseaseDetectionInputSchema,
    outputSchema: AIDiseaseDetectionOutputSchema,
  },
  async ({ plantImage }) => {
    try {
      const imageBuffer = dataUriToBuffer(plantImage);

      // 1. Validate Image
      const validation = await validateImage(imageBuffer);
      if (!validation.ok) {
        return createKnownErrorOutput(
          validation.reason === 'UNSUPPORTED_MIME'
            ? 'UNSUPPORTED_IMAGE_TYPE'
            : 'INVALID_IMAGE',
          'The uploaded file is not a valid or supported image (PNG, JPEG, WEBP).'
        );
      }

      // 2. Preprocess Image
      const { buffer: processedBuffer } = await preprocessImage(imageBuffer);
      const processedDataUri = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
      
      const modelId = process.env.NEXT_PUBLIC_GENAI_MODEL || 'gemini-pro';

      // 3. Define and execute the prompt
      const detectionPrompt = ai.definePrompt({
          name: 'aiDiseaseDetectionPrompt',
          prompt: promptTemplate,
          input: {
              schema: z.object({
                  plantImage: z.string()
              })
          },
          output: {
              format: 'json',
              schema: DiagnosisSchema,
          },
      });

      const { output } = await detectionPrompt(
        { plantImage: processedDataUri },
        { model: modelId }
      );
      
      const diagnosis = output;

      if (!diagnosis) {
         // This is an unexpected state, throw an error for the API route to handle
         throw new Error('AI model returned an empty or invalid diagnosis.');
      }

      // 4. Fallback Heuristics for Low-Confidence or Healthy Diagnosis
      if (
        diagnosis.confidence < 0.6 ||
        diagnosis.diseaseName.toLowerCase().includes('healthy')
      ) {
        const quality = await analyzeImageQuality(processedBuffer);
        if (quality.isBlurry) {
          return createKnownErrorOutput(
            'IMAGE_TOO_BLURRY',
            'Plant appears healthy, but the image is blurry. Please upload a clear, focused photo for a more accurate diagnosis.'
          );
        }
        if (quality.isLowContrast) {
          return createKnownErrorOutput(
            'IMAGE_LOW_CONTRAST',
            'Plant appears healthy, but the image has low contrast. Please use even lighting for a more accurate diagnosis.'
          );
        }
      }

      return { status: 'ok', diagnosis };
    } catch (error: any) {
        // Re-throw the error. The calling context (API route) is responsible
        // for catching it and formatting the final JSON response for the client.
        console.error('Error in aiDiseaseDetectionFlow:', error);
        throw error;
    }
  }
);
