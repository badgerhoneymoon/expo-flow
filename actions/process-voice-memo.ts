"use server"

import { 
  StructuredOutputSchema, 
  StructuredOutputResponse, 
  StructuredOutput,
  TargetStatus,
  ICPFitStatus 
} from '@/types/structured-output-types'
import { WhisperService } from "@/lib/services/whisper-service"
import { StructuredOutputService } from "@/lib/services/structured-output-service"
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt'
import { createLead } from './leads-actions'

export async function processVoiceMemo(audioData: FormData): Promise<StructuredOutputResponse> {
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
      await WhisperService.transcribeAudio(audioFile)
    
    if (!transcriptionSuccess || !text) {
      return {
        success: false,
        error: transcriptionError || "Transcription failed"
      }
    }

    console.log('Whisper Transcription:', text)
    const prompt = getStructuredOutputPrompt(new Date().toISOString().split('T')[0])
    
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
        // Required enum fields with defaults
        isTarget: result.data.isTarget ?? TargetStatus.UNKNOWN,
        icpFit: result.data.icpFit ?? ICPFitStatus.UNKNOWN,
        // Source tracking
        hasBusinessCard: false,
        hasTextNote: false,
        hasVoiceMemo: true,
        // Raw data
        rawBusinessCard: undefined,
        rawTextNote: undefined,
        rawVoiceMemo: text,
        // Required boolean with default
        referral: result.data.referral ?? false
      }

      // Save to database
      const dbResult = await createLead(enrichedData)
      if (!dbResult.success) {
        throw new Error(dbResult.error)
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