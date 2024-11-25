"use server"

import { 
  StructuredOutputSchema, 
  StructuredOutputResponse, 
  StructuredOutput
} from '@/types/structured-output-types'
import { StructuredOutputService } from "@/lib/services/structured-output-service"
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt'
import { createLead } from './leads-actions'

export async function processTextNotes(text: string): Promise<StructuredOutputResponse> {
  try {
    const prompt = getStructuredOutputPrompt(
      new Date().toISOString().split('T')[0]
    )
    
    const result = await StructuredOutputService.structureText<StructuredOutput>(
      text,
      StructuredOutputSchema,
      prompt
    )

    if (result.success && result.data) {
      // Add text note specific flags and required fields
      const enrichedData: StructuredOutput = {
        // OpenAI parsed data
        ...result.data,
        // Add defaults for required fields
        nextSteps: result.data.nextSteps || "N/A",
        notes: result.data.notes || "N/A",
        // Source tracking
        hasBusinessCard: false,
        hasTextNote: true,
        hasVoiceMemo: false,
        // Raw data
        rawBusinessCard: undefined,
        rawTextNote: text,
        rawVoiceMemo: undefined,
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
    console.error('Error processing text notes:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process text notes'
    }
  }
} 