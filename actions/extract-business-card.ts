"use server"

import { 
  StructuredOutputSchema, 
  StructuredOutputResponse, 
  StructuredOutput,
  TargetStatus, 
  ICPFitStatus 
} from '@/types/structured-output-types'
import { StructuredOutputService } from '@/lib/services/structured-output-service'
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt'
import { createLead } from './leads-actions'
import { getCompanyProfile } from './company-profile-actions'

export async function extractBusinessCard(text: string): Promise<StructuredOutputResponse> {
  try {
    console.log('Tesseract Raw Output:', text)
    
    // Get company profile data
    const companyProfile = await getCompanyProfile()
    
    const prompt = getStructuredOutputPrompt(
      new Date().toISOString().split('T')[0],
      companyProfile.targetJobTitles,
      companyProfile.icpDescription,
      companyProfile.targetMarkets
    )
    
    const result = await StructuredOutputService.structureText<StructuredOutput>(
      text,
      StructuredOutputSchema,
      prompt
    )

    if (result.success && result.data) {
      // Add business card specific flags and required fields
      const enrichedData: StructuredOutput = {
        // OpenAI parsed data
        ...result.data,
        // Add defaults for required fields
        nextSteps: result.data.nextSteps || "N/A",
        notes: result.data.notes || "N/A",
        // Required enum fields with defaults
        isTarget: result.data.isTarget ?? TargetStatus.UNKNOWN,
        icpFit: result.data.icpFit ?? ICPFitStatus.UNKNOWN,
        // Source tracking
        hasBusinessCard: true,
        hasTextNote: false,
        hasVoiceMemo: false,
        // Raw data
        rawBusinessCard: text,
        rawTextNote: undefined,
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
    console.error('Error extracting business card:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract business card data'
    }
  }
} 