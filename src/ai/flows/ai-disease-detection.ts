'use server';

/**
 * @fileOverview This file implements the AI Disease Detection flow, which allows farmers to upload a plant image,
 * analyze its symptoms, identify potential diseases, suggest solutions, recommend pesticides, and provide preventive measures.
 *
 * @interface AIDiseaseDetectionInput - Represents the input schema for the AI Disease Detection flow.
 * @interface AIDiseaseDetectionOutput - Represents the output schema for the AI Disease Detection flow.
 * @function aiDiseaseDetection - The main function to trigger the disease detection flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDiseaseDetectionInputSchema = z.object({
  plantImage: z
    .string()
    .describe(
      "A photo of the plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIDiseaseDetectionInput = z.infer<typeof AIDiseaseDetectionInputSchema>;

const AIDiseaseDetectionOutputSchema = z.object({
  diseaseName: z.string().describe('The identified disease name.'),
  symptoms: z.string().describe('Observed symptoms of the plant.'),
  solution: z.string().describe('Suggested solution to address the disease.'),
  pesticideRecommendation: z
    .string()
    .describe('Recommended pesticide for the disease.'),
  preventiveMeasures: z
    .string()
    .describe('Preventive measures to avoid future infections.'),
  error: z.string().optional().describe('An error message if the analysis failed.'),
});
export type AIDiseaseDetectionOutput = z.infer<typeof AIDiseaseDetectionOutputSchema>;

export async function aiDiseaseDetection(input: AIDiseaseDetectionInput): Promise<AIDiseaseDetectionOutput> {
  return aiDiseaseDetectionFlow(input);
}

const promptTemplate = `You are an AI assistant specialized in plant disease detection and providing solutions for farmers.
  
Analyze the provided plant image and identify any potential diseases based on the observed symptoms. Provide a detailed solution, recommend a suitable pesticide, and suggest preventive measures to help the farmer protect their crops.
  
Respond in the following JSON format:
{
  "diseaseName": "",
  "symptoms": "",
  "solution": "",
  "pesticideRecommendation": "",
  "preventiveMeasures": ""
}`;


const aiDiseaseDetectionFlow = ai.defineFlow(
  {
    name: 'aiDiseaseDetectionFlow',
    inputSchema: AIDiseaseDetectionInputSchema,
    outputSchema: AIDiseaseDetectionOutputSchema,
  },
  async input => {
    const models = [
        process.env.GENAI_MODEL || 'gemini-1.5-flash-latest',
        process.env.GENAI_FALLBACK_MODEL || 'gemini-pro-vision',
    ];

    for (const modelName of models) {
        try {
            const llm = ai.getModel(modelName);
            const response = await ai.generate({
                model: llm,
                prompt: {
                    text: promptTemplate,
                    media: [{
                        url: input.plantImage,
                    }]
                },
                config: {
                    response: {
                        format: 'json',
                        schema: AIDiseaseDetectionOutputSchema,
                    }
                },
            });

            const output = response.output();
            if (output) {
                return output;
            }
        } catch (e: any) {
            console.error(`AI Disease Detection with model '${modelName}' failed:`, e);
            // If it's the last model in the list, return an error.
            if (models.indexOf(modelName) === models.length - 1) {
                return {
                    diseaseName: 'Analysis Failed',
                    symptoms: 'Could not determine symptoms.',
                    solution: 'Unable to provide a solution at this time.',
                    pesticideRecommendation: 'N/A',
                    preventiveMeasures: 'Please try again later or with a different image.',
                    error: `The AI model could not process the request. ${e.message}`,
                };
            }
            // Otherwise, loop will continue to the next model.
        }
    }

    // This part should not be reached if there is at least one model,
    // but it's a safeguard.
    return {
        diseaseName: 'Analysis Failed',
        symptoms: 'No valid AI model was found or configured.',
        solution: 'Unable to provide a solution.',
        pesticideRecommendation: 'N/A',
        preventiveMeasures: 'Please check the application configuration.',
        error: `No AI models were available to process the request.`,
    };
  }
);
