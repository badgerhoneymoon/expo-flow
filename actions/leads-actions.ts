"use server"

import { revalidatePath } from "next/cache"
import * as queries from "@/db/queries/leads-queries"
import type { StructuredOutput } from "@/types/structured-output-types"
import { structuredOutputToNewLead } from "@/lib/utils/structured-output-converter"

export async function getLeads() {
  try {
    const leads = await queries.getLeads()
    return { success: true, data: leads }
  } catch (error) {
    return { success: false, error: "Failed to fetch leads" }
  }
}

export async function getLead(id: string) {
  try {
    const lead = await queries.getLead(id)
    if (!lead) throw new Error("Lead not found")
    return { success: true, data: lead }
  } catch (error) {
    return { success: false, error: "Failed to fetch lead" }
  }
}

export async function createLead(structuredOutput: StructuredOutput) {
  try {
    // Check for existing lead
    const existingLead = await queries.findLeadByNameAndCompany(
      structuredOutput.firstName || "",
      structuredOutput.lastName || "",
      structuredOutput.company || ""
    )

    if (existingLead) {
      // Merge with existing lead data
      const updatedData = {
        ...structuredOutputToNewLead(structuredOutput),
        hasBusinessCard: structuredOutput.hasBusinessCard ?? existingLead.hasBusinessCard,
        hasTextNote: structuredOutput.hasTextNote ?? existingLead.hasTextNote,
        hasVoiceMemo: structuredOutput.hasVoiceMemo ?? existingLead.hasVoiceMemo,
        rawBusinessCard: structuredOutput.rawBusinessCard || existingLead.rawBusinessCard,
        rawTextNote: structuredOutput.rawTextNote || existingLead.rawTextNote || undefined,
        rawVoiceMemo: structuredOutput.rawVoiceMemo || existingLead.rawVoiceMemo || undefined
      }
      
      const updatedLead = await queries.updateLead(existingLead.id, updatedData)
      revalidatePath("/leads")
      return { success: true, data: updatedLead }
    }

    // Create new lead - let Supabase handle the ID
    const newLead = await queries.createLead(structuredOutputToNewLead(structuredOutput))
    revalidatePath("/leads")
    return { success: true, data: newLead }
  } catch (error) {
    return { success: false, error: "Failed to create lead" }
  }
}

export async function updateLead(id: string, structuredOutput: Partial<StructuredOutput>) {
  try {
    const existingLead = await queries.getLead(id)
    if (!existingLead) throw new Error("Lead not found")
    
    const updateData = {
      ...structuredOutputToNewLead({
        ...structuredOutput,
        referral: structuredOutput.referral ?? existingLead.referral
      } as StructuredOutput)
    }
    
    const updatedLead = await queries.updateLead(id, updateData)
    revalidatePath("/leads")
    return { success: true, data: updatedLead }
  } catch (error) {
    return { success: false, error: "Failed to update lead" }
  }
}

export async function deleteLead(id: string) {
  try {
    const deletedLead = await queries.deleteLead(id)
    revalidatePath("/leads")
    return { success: true, data: deletedLead }
  } catch (error) {
    return { success: false, error: "Failed to delete lead" }
  }
} 