"use server"

import { StructuredOutputSchema, StructuredOutputResponse, StructuredOutput } from '@/types/structured-output-types';
import { StructuredOutputService } from '@/lib/services/structured-output-service';
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt';

export async function extractBusinessCard(text: string): Promise<StructuredOutputResponse> {
  try {
    console.log('Tesseract Raw Output:', text);
    const prompt = getStructuredOutputPrompt(new Date().toISOString().split('T')[0]);
    const result = await StructuredOutputService.structureText(
      text,
      StructuredOutputSchema,
      prompt
    ) as StructuredOutputResponse;

    if (result.success && result.data) {
      const data = result.data as StructuredOutput;
      data.hasBusinessCard = true;
      data.rawBusinessCard = text;
    }

    return result;
  } catch (error) {
    console.error('Error extracting business card:', error);
    return {
      success: false,
      error: 'Failed to extract business card data'
    };
  }
} 