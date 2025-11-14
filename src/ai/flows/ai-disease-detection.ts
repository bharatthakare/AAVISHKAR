
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
      'A photo of the plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
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
  preventiveMeasures: z.string().describe('Preventive measures to avoid future infections.'),
});
export type AIDiseaseDetectionOutput = z.infer<typeof AIDiseaseDetectionOutputSchema>;

export async function aiDiseaseDetection(input: AIDiseaseDetectionInput): Promise<AIDiseaseDetectionOutput> {
  return aiDiseaseDetectionFlow(input);
}

const aiDiseaseDetectionPrompt = ai.definePrompt({
  name: 'aiDiseaseDetectionPrompt',
  input: {schema: AIDiseaseDetectionInputSchema},
  output: {schema: AIDiseaseDetectionOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an AI assistant specialized in plant disease detection and providing solutions for farmers.

  Analyze the provided plant image and identify any potential diseases based on the observed symptoms. Provide a detailed solution, recommend a suitable pesticide, and suggest preventive measures to help the farmer protect their crops.

  Please use the following as the primary source of information about the plant:

  Plant Image: {{media url=plantImage}}

  Respond in the following JSON format:
  {
    "diseaseName": "",
    "symptoms": "",
    "solution": "",
    "pesticideRecommendation": "",
    "preventiveMeasures": ""
  }`,
});

const aiDiseaseDetectionFlow = ai.defineFlow(
  {
    name: 'aiDiseaseDetectionFlow',
    inputSchema: AIDiseaseDetectionInputSchema,
    outputSchema: AIDiseaseDetectionOutputSchema,
  },
  async input => {
    const {output} = await aiDiseaseDetectionPrompt(input);
    return output!;
  }
);
