"use server"

import { StructuredOutputSchema, StructuredOutputResponse, StructuredOutput } from '@/types/structured-output-types';
import { WhisperService } from "@/lib/services/whisper-service";
import { StructuredOutputService } from "@/lib/services/structured-output-service";
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt';

export async function processVoiceMemo(audioData: FormData): Promise<StructuredOutputResponse> {
  try {
    const audioFile = audioData.get('file') as File;
    if (!audioFile) {
      return {
        success: false,
        error: "No audio file provided"
      };
    }

    const { success, text, error } = await WhisperService.transcribeAudio(audioFile);
    
    if (!success || !text) {
      return {
        success: false,
        error: error || "Transcription failed"
      };
    }

    const prompt = getStructuredOutputPrompt(new Date().toISOString().split('T')[0]);
    const result = await StructuredOutputService.structureText(
      text,
      StructuredOutputSchema,
      prompt
    ) as StructuredOutputResponse;

    if (result.success && result.data) {
      const data = result.data as StructuredOutput;
      data.hasVoiceMemo = true;
      data.rawVoiceMemo = text;
    }

    return result;

  } catch (error) {
    console.error('Error processing voice memo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process voice memo'
    };
  }
} 