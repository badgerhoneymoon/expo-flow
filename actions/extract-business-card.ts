"use server"

import { 
  StructuredOutputSchema, 
  StructuredOutputResponse, 
  StructuredOutput
} from '@/types/structured-output-types'
import { StructuredOutputService } from '@/lib/services/structured-output-service'
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt'
import { createLead } from './leads-actions'

function preprocessOCRText(text: string): string {
  return text
    // Fix NSW government email typos
    .replace(/\.nsw\.gov\.ail/gi, '.nsw.gov.au')
    .replace(/\.nsw\.gov\.all/gi, '.nsw.gov.au')
}

export async function extractBusinessCard(text: string): Promise<StructuredOutputResponse> {
  try {
    const preprocessedText = preprocessOCRText(text)
    const prompt = getStructuredOutputPrompt(
      new Date().toISOString().split('T')[0]
    )
    
    const result = await StructuredOutputService.structureText<StructuredOutput>(
      preprocessedText,
      StructuredOutputSchema,
      prompt
    )

    if (result.success && result.data) {
      const enrichedData: StructuredOutput = {
        ...result.data,
        nextSteps: result.data.nextSteps || "N/A",
        notes: result.data.notes || "N/A",
        hasBusinessCard: true,
        hasTextNote: false,
        hasVoiceMemo: false,
        rawBusinessCard: text,
        rawTextNote: undefined,
        rawVoiceMemo: undefined,
        referral: result.data.referral ?? false
      }

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
    console.error('Error extracting business card:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract business card data'
    }
  }
} 