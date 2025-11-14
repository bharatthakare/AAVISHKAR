
import { z } from 'genkit';

// --- Input and Output Schemas ---

export const AIDiseaseDetectionInputSchema = z.object({
  plantImage: z
    .string()
    .describe(
      "A photo of the plant, as a data URI (e.g., 'data:image/jpeg;base64,...')."
    ),
});
export type AIDiseaseDetectionInput = z.infer<
  typeof AIDiseaseDetectionInputSchema
>;

export const DiagnosisSchema = z.object({
  diseaseName: z.string().describe('The identified disease name.'),
  symptoms: z.array(z.string()).describe('A list of observed symptoms.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence level of the diagnosis (0 to 1).'),
  solution: z.string().describe('Suggested solution to address the disease.'),
  pesticideRecommendation: z
    .string()
    .describe('Recommended pesticide for the disease.'),
  preventiveMeasures: z
    .array(z.string())
    .describe('A list of preventive measures to avoid future infections.'),
});
export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export const AIDiseaseDetectionOutputSchema = z.union([
  z.object({
    status: z.literal('ok'),
    diagnosis: DiagnosisSchema,
  }),
  z.object({
    status: z.literal('error'),
    code: z.enum([
      'INVALID_IMAGE',
      'UNSUPPORTED_IMAGE_TYPE',
      'IMAGE_TOO_BLURRY',
      'IMAGE_LOW_CONTRAST',
      'NO_DETECTION',
      'MODEL_NOT_FOUND',
      'MODEL_ERROR',
      'INTERNAL_ERROR',
    ]),
    message: z.string(),
    diagnostics: z.any().optional(),
  }),
]);
export type AIDiseactionOutput = z.infer<
  typeof AIDiseaseDetectionOutputSchema
>;
