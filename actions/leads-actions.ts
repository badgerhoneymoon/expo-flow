"use server"

import { revalidatePath } from "next/cache"
import * as queries from "@/db/queries/leads-queries"
import type { NewLead } from "@/db/schema/leads-schema"

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

export async function createLead(lead: NewLead) {
  try {
    // Check for existing lead
    const existingLead = await queries.findLeadByNameAndCompany(
      lead.firstName || "",
      lead.lastName || "",
      lead.company || ""
    )

    if (existingLead) {
      // Update existing lead
      const updatedLead = await queries.updateLead(existingLead.id, {
        ...lead,
        hasBusinessCard: lead.hasBusinessCard || existingLead.hasBusinessCard,
        hasTextNote: lead.hasTextNote || existingLead.hasTextNote,
        hasVoiceMemo: lead.hasVoiceMemo || existingLead.hasVoiceMemo,
      })
      revalidatePath("/leads")
      return { success: true, data: updatedLead }
    }

    // Create new lead
    const newLead = await queries.createLead(lead)
    revalidatePath("/leads")
    return { success: true, data: newLead }
  } catch (error) {
    return { success: false, error: "Failed to create lead" }
  }
}

export async function updateLead(id: string, lead: Partial<NewLead>) {
  try {
    const updatedLead = await queries.updateLead(id, lead)
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