"use server"

import { StructuredOutputSchema, StructuredOutputResponse, StructuredOutput } from '@/types/structured-output-types';
import { StructuredOutputService } from "@/lib/services/structured-output-service";
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt';

export async function processTextNotes(text: string): Promise<StructuredOutputResponse> {
  try {
    const prompt = getStructuredOutputPrompt(new Date().toISOString().split('T')[0]);
    const result = await StructuredOutputService.structureText(
      text,
      StructuredOutputSchema,
      prompt
    ) as StructuredOutputResponse;

    if (result.success && result.data) {
      const data = result.data as StructuredOutput;
      data.hasTextNote = true;
      data.rawTextNote = text;
    }

    return result;
  } catch (error) {
    console.error('Error processing text notes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process text notes'
    };
  }
} 