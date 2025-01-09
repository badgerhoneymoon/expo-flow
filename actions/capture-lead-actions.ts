"use server"

import { revalidatePath } from "next/cache"
import * as queries from "@/db/queries/leads-queries"
import { StructuredOutput } from "@/types/structured-output-types"
import { targetStatusEnum, icpFitStatusEnum } from "@/db/schema/leads-schema"

export async function createCapturedLead(paths: {
  businessCardPath?: string
  voiceMemoPath?: string
}) {
  try {
    // Create a minimal lead record for the captured files
    const leadData: StructuredOutput = {
      firstName: "N/A",
      lastName: "N/A",
      nextSteps: "Process captured files",
      notes: "Lead created from captured files",
      hasBusinessCard: !!paths.businessCardPath,
      hasVoiceMemo: !!paths.voiceMemoPath,
      businessCardPath: paths.businessCardPath,
      voiceMemoPath: paths.voiceMemoPath
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