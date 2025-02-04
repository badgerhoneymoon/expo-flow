"use server"

import { 
  StructuredOutputSchema, 
  StructuredOutputResponse, 
  StructuredOutput
} from '@/types/structured-output-types'
import { WhisperService } from "@/lib/services/whisper-service"
import { StructuredOutputService } from "@/lib/services/structured-output-service"
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt'

export async function processVoiceMemo(audioData: FormData, language?: string): Promise<StructuredOutputResponse> {
  try {
    const audioFile = audioData.get('file') as File
    if (!audioFile) {
      return {
        success: false,
        error: "No audio file provided"
      }
    }

    // Transcribe audio to text
    const { success: transcriptionSuccess, text, error: transcriptionError } = 
      await WhisperService.transcribeAudio(audioFile, language)
    
    if (!transcriptionSuccess || !text) {
      return {
        success: false,
        error: transcriptionError || "Transcription failed"
      }
    }

    const prompt = getStructuredOutputPrompt(
      new Date().toISOString().split('T')[0]
    )
    
    const result = await StructuredOutputService.structureText<StructuredOutput>(
      text,
      StructuredOutputSchema,
      prompt
    )

    if (result.success && result.data) {
      // Add voice memo specific flags and required fields
      const enrichedData: StructuredOutput = {
        // OpenAI parsed data
        ...result.data,
        // Add defaults for required fields
        nextSteps: result.data.nextSteps || "N/A",
        notes: result.data.notes || "N/A",
        // Source tracking
        hasBusinessCard: false,
        hasTextNote: false,
        hasVoiceMemo: true,
        // Raw data
        rawBusinessCard: undefined,
        rawTextNote: undefined,
        rawVoiceMemo: text,
        // Ensure referrals array exists
        referrals: result.data.referrals || []
      }

      return {
        success: true,
        data: enrichedData
      }
    }

    return {
      success: false,
      error: "Failed to structure data"
    }

  } catch (error) {
    console.error('Error processing voice memo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process voice memo'
    }
  }
}

export async function transcribeVoiceMemo(audioData: FormData, language?: string) {
  try {
    const audioFile = audioData.get('file') as File
    if (!audioFile) {
      return {
        success: false,
        error: "No audio file provided"
      }
    }
    
    const result = await WhisperService.transcribeAudio(audioFile, language)
    return result
  } catch (error) {
    console.error('Error transcribing voice memo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to transcribe voice memo'
    }
  }
} 