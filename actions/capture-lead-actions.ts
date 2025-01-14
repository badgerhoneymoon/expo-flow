"use server"

import { revalidatePath } from "next/cache"
import * as queries from "@/db/queries/leads-queries"
import { StructuredOutput } from "@/types/structured-output-types"
import { targetStatusEnum, icpFitStatusEnum } from "@/db/schema/leads-schema"

interface CaptureLeadInput {
  businessCardPath?: string
  voiceMemoPath?: string
  rawTextNote?: string
  structuredData?: StructuredOutput
}

export async function createCapturedLead(input: CaptureLeadInput) {
  try {
    // Create a lead record with structured data if available, otherwise use minimal data
    const leadData: StructuredOutput = input.structuredData || {
      firstName: "N/A",
      lastName: "N/A",
      nextSteps: "Process captured files",
      notes: "Lead created from captured files",
      hasBusinessCard: !!input.businessCardPath,
      hasVoiceMemo: !!input.voiceMemoPath,
      hasTextNote: !!input.rawTextNote,
      businessCardPath: input.businessCardPath,
      voiceMemoPath: input.voiceMemoPath,
      rawTextNote: input.rawTextNote,
      referrals: []
    }

    // Create new lead with default qualification values
    const newLeadData = {
      ...leadData,
      isTarget: targetStatusEnum.enumValues[2], // UNKNOWN
      icpFit: icpFitStatusEnum.enumValues[2], // UNKNOWN
      qualificationReason: null
    }

    const lead = await queries.createLead(newLeadData)
    revalidatePath("/leads")
    
    return { success: true, data: lead }
  } catch (error) {
    console.error('Failed to create captured lead:', error)
    return { success: false, error: "Failed to create lead" }
  }
} 