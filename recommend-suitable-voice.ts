'use server';

/**
 * @fileOverview AI-powered voice recommendation flow.
 *
 * This file defines a Genkit flow that suggests a suitable voice for a given text input.
 * It exports:
 *   - recommendSuitableVoice: The function to trigger the voice recommendation flow.
 *   - RecommendSuitableVoiceInput: The input type for the function.
 *   - RecommendSuitableVoiceOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSuitableVoiceInputSchema = z.object({
  text: z.string().describe('The text input for which a voice is to be recommended.'),
});
export type RecommendSuitableVoiceInput = z.infer<typeof RecommendSuitableVoiceInputSchema>;

const RecommendSuitableVoiceOutputSchema = z.object({
  voiceRecommendation: z.string().describe('The recommended voice for the given text.'),
  reason: z.string().describe('Explanation of why the voice was recommended.'),
});
export type RecommendSuitableVoiceOutput = z.infer<typeof RecommendSuitableVoiceOutputSchema>;

export async function recommendSuitableVoice(input: RecommendSuitableVoiceInput): Promise<RecommendSuitableVoiceOutput> {
  return recommendSuitableVoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSuitableVoicePrompt',
  input: {schema: RecommendSuitableVoiceInputSchema},
  output: {schema: RecommendSuitableVoiceOutputSchema},
  prompt: `You are an AI voice recommender. Given the following text, recommend a suitable voice from the available voices (Algenib, Achernar). Explain why you recommended the voice.

Text: {{{text}}}

Respond with the voice recommendation and the reason for your recommendation.
`,
});

const recommendSuitableVoiceFlow = ai.defineFlow(
  {
    name: 'recommendSuitableVoiceFlow',
    inputSchema: RecommendSuitableVoiceInputSchema,
    outputSchema: RecommendSuitableVoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
