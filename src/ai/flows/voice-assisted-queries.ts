'use server';

/**
 * @fileOverview Implements the voice-assisted queries flow for the KisanAI app.
 *
 * - voiceAssistedQueries - A function that handles voice-based questions and returns spoken answers.
 * - VoiceAssistedQueriesInput - The input type for the voiceAssistedQueries function.
 * - VoiceAssistedQueriesOutput - The return type for the voiceAssistedQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VoiceAssistedQueriesInputSchema = z.object({
  query: z.string().describe('The voice query converted to text.'),
});
export type VoiceAssistedQueriesInput = z.infer<typeof VoiceAssistedQueriesInputSchema>;

const VoiceAssistedQueriesOutputSchema = z.object({
  answer: z.string().describe('The answer to the voice query.'),
  audio: z.string().describe('The audio data of the spoken answer in WAV format.'),
});
export type VoiceAssistedQueriesOutput = z.infer<typeof VoiceAssistedQueriesOutputSchema>;

export async function voiceAssistedQueries(input: VoiceAssistedQueriesInput): Promise<VoiceAssistedQueriesOutput> {
  return voiceAssistedQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAssistedQueriesPrompt',
  input: {schema: VoiceAssistedQueriesInputSchema},
  prompt: `You are a helpful AI assistant for farmers. Answer the following question: {{{query}}}`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const voiceAssistedQueriesFlow = ai.defineFlow(
  {
    name: 'voiceAssistedQueriesFlow',
    inputSchema: VoiceAssistedQueriesInputSchema,
    outputSchema: VoiceAssistedQueriesOutputSchema,
  },
  async input => {
    const modelId = process.env.GENAI_MODEL || 'gemini-pro';
    const {text} = await prompt(input, { model: modelId });

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      answer: text!,
      audio: audio,
    };
  }
);
