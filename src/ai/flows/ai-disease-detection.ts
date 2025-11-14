
'use server';

/**
 * @fileOverview This file implements the AI Disease Detection flow.
 * It validates and preprocesses an image, sends it to a GenAI model,
 * and returns a structured diagnosis or a detailed error.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {
  validateImage,
  preprocessImage,
  analyzeImageQuality,
} from '../lib/imageUtils';
import { generateContentWithDiagnostics, type GenaiDiagnostics } from '../lib/genai-utils';
import { 
    AIDiseaseDetectionInputSchema, 
    AIDiseaseDetectionOutputSchema, 
    type AIDiseaseDetectionInput, 
    type AIDiseaseDetectionOutput,
    DiagnosisSchema
} from '@/ai/schemas/disease-detection';

const ai = genkit({
  plugins: [googleAI()],
});


// --- Helper Functions ---

function dataUriToBuffer(dataUri: string): Buffer {
  return Buffer.from(dataUri.split(',')[1], 'base64');
}

function createErrorOutput(
  code: Exclude<AIDiseaseDetectionOutput, { status: 'ok' }>['code'],
  message: string,
  diagnostics?: GenaiDiagnostics
): AIDiseaseDetectionOutput {
    if (code === "MODEL_ERROR" || code === "MODEL_NOT_FOUND") {
        console.error(`AI Error (${code}): ${message}`, JSON.stringify(diagnostics, null, 2));
    }
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
        return createErrorOutput(
          validation.reason === 'UNSUPPORTED_MIME'
            ? 'UNSUPPORTED_IMAGE_TYPE'
            : 'INVALID_IMAGE',
          'The uploaded file is not a valid or supported image (PNG, JPEG, WEBP).'
        );
      }

      // 2. Preprocess Image
      const { buffer: processedBuffer } = await preprocessImage(imageBuffer);

      // 3. Call GenAI Model with Diagnostics
      const modelId = process.env.NEXT_PUBLIC_GENAI_MODEL || 'gemini-pro';
      const payload = {
        contents: [
          {
            parts: [
              { text: promptTemplate },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: processedBuffer.toString('base64'),
                },
              },
            ],
          },
        ],
        generationConfig: {
            responseMimeType: "application/json",
        }
      };

      const { response, diagnostics } = await generateContentWithDiagnostics(
        modelId,
        payload
      );

      // 4. Handle Model Errors
      if (diagnostics) {
        let errorCode: AIDiseaseDetectionOutput['code'] = 'MODEL_ERROR';
        if (diagnostics.status === 404) {
          errorCode = 'MODEL_NOT_FOUND';
        } else if (diagnostics.status >= 500) {
          errorCode = 'MODEL_ERROR';
        }
        
        return createErrorOutput(
          errorCode,
          `The AI model failed to process the request. (Status: ${diagnostics.status})`,
          diagnostics
        );
      }

      const rawJson = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) {
        return createErrorOutput(
          'NO_DETECTION',
          'The AI model returned an empty response.'
        );
      }
      
      const diagnosisResult = DiagnosisSchema.safeParse(JSON.parse(rawJson));
      if (!diagnosisResult.success) {
           return createErrorOutput('NO_DETECTION', 'AI model returned an invalid diagnosis format.');
      }
      
      const diagnosis = diagnosisResult.data;

      // 5. Fallback Heuristics for Low-Confidence or Healthy Diagnosis
      if (
        diagnosis.confidence < 0.6 ||
        diagnosis.diseaseName.toLowerCase().includes('healthy')
      ) {
        const quality = await analyzeImageQuality(processedBuffer);
        if (quality.isBlurry) {
          return createErrorOutput(
            'IMAGE_TOO_BLURRY',
            'Plant appears healthy, but the image is blurry. Please upload a clear, focused photo for a more accurate diagnosis.'
          );
        }
        if (quality.isLowContrast) {
          return createErrorOutput(
            'IMAGE_LOW_CONTRAST',
            'Plant appears healthy, but the image has low contrast. Please use even lighting for a more accurate diagnosis.'
          );
        }
      }

      return { status: 'ok', diagnosis };
    } catch (error: any) {
      console.error('An unexpected error occurred in the disease detection flow:', error);
      return createErrorOutput(
        'INTERNAL_ERROR',
        'An unexpected internal error occurred.'
      );
    }
  }
);
