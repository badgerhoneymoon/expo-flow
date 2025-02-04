"use server"

import { revalidatePath } from "next/cache"
import { createLead } from "@/actions/leads-actions"
import type { StructuredOutput } from "@/types/structured-output-types"

interface CaptureLeadInput {
  businessCardPath?: string
  voiceMemoPath?: string
  rawTextNote?: string
  structuredData?: StructuredOutput
}

export async function createCapturedLead(input: CaptureLeadInput) {
  try {
    if (!input.structuredData) {
      throw new Error("Structured data is required")
    }

    // Use the proper lead creation logic from leads-actions
    const result = await createLead(input.structuredData)
    
    if (!result.success) {
      throw new Error(result.error)
    }

    revalidatePath("/leads")
    return result
    
  } catch (error) {
    console.error('Failed to create captured lead:', error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create lead" }
  }
} 