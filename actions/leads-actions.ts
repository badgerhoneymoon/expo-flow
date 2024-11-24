"use server"

import { revalidatePath } from "next/cache"
import * as queries from "@/db/queries/leads-queries"
import { 
  StructuredOutput,
  TargetStatus,
  ICPFitStatus 
} from "@/types/structured-output-types"
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

    let mainLeadResult;

    if (existingLead) {
      // Merge with existing lead data, preserving existing values unless new data is provided
      const updatedData = {
        ...existingLead, // Start with all existing data
        // Only update fields if new data has non-null values
        firstName: structuredOutput.firstName || existingLead.firstName,
        lastName: structuredOutput.lastName || existingLead.lastName,
        jobTitle: structuredOutput.jobTitle || existingLead.jobTitle,
        company: structuredOutput.company || existingLead.company,
        website: structuredOutput.website || existingLead.website,
        email: structuredOutput.email || existingLead.email,
        linkedin: structuredOutput.linkedin || existingLead.linkedin,
        mainInterest: structuredOutput.mainInterest || existingLead.mainInterest,
        nextSteps: structuredOutput.nextSteps || existingLead.nextSteps,
        notes: structuredOutput.notes || existingLead.notes,
        companyIndustry: structuredOutput.companyIndustry || existingLead.companyIndustry,
        companySize: structuredOutput.companySize || existingLead.companySize,
        companyBusiness: structuredOutput.companyBusiness || existingLead.companyBusiness,
        qualificationReason: structuredOutput.qualificationReason || existingLead.qualificationReason,
        contactTiming: structuredOutput.contactTiming || existingLead.contactTiming,
        contactDate: structuredOutput.contactDate || existingLead.contactDate,
        followUpTemplate: structuredOutput.followUpTemplate || existingLead.followUpTemplate,
        
        // Update source tracking flags (OR them together)
        hasBusinessCard: structuredOutput.hasBusinessCard || existingLead.hasBusinessCard,
        hasTextNote: structuredOutput.hasTextNote || existingLead.hasTextNote,
        hasVoiceMemo: structuredOutput.hasVoiceMemo || existingLead.hasVoiceMemo,
        
        // Preserve raw data from all sources
        rawBusinessCard: structuredOutput.rawBusinessCard || existingLead.rawBusinessCard,
        rawTextNote: structuredOutput.rawTextNote || existingLead.rawTextNote,
        rawVoiceMemo: structuredOutput.rawVoiceMemo || existingLead.rawVoiceMemo,
        
        // Special handling for enum fields - only update if new value is more certain
        isTarget: structuredOutput.isTarget === 'UNKNOWN' ? existingLead.isTarget : structuredOutput.isTarget,
        icpFit: structuredOutput.icpFit === 'UNKNOWN' ? existingLead.icpFit : structuredOutput.icpFit,
        
        // Special handling for boolean fields
        referral: structuredOutput.referral || existingLead.referral,
      }
      
      const updatedLead = await queries.updateLead(existingLead.id, updatedData)
      mainLeadResult = { success: true, data: updatedLead }
    } else {
      // Create new lead - let Supabase handle the ID
      const newLead = await queries.createLead(structuredOutputToNewLead(structuredOutput))
      mainLeadResult = { success: true, data: newLead }
    }

    // Handle referral if present
    if (structuredOutput.referral && structuredOutput.referralData) {
      // Create a new lead for the referral, inheriting company info from the main lead
      const referralLead: StructuredOutput = {
        firstName: structuredOutput.referralData.firstName,
        lastName: structuredOutput.referralData.lastName,
        jobTitle: structuredOutput.referralData.position,
        company: structuredOutput.company, // Inherit from main lead
        website: structuredOutput.website, // Inherit from main lead
        companyIndustry: structuredOutput.companyIndustry, // Inherit from main lead
        companySize: structuredOutput.companySize, // Inherit from main lead
        companyBusiness: structuredOutput.companyBusiness, // Inherit from main lead
        contactTiming: structuredOutput.referralData.contactTiming,
        contactDate: structuredOutput.referralData.contactDate,
        // Set source flags based on where the referral came from
        hasBusinessCard: structuredOutput.hasBusinessCard,
        hasTextNote: structuredOutput.hasTextNote,
        hasVoiceMemo: structuredOutput.hasVoiceMemo,
        // Default values for required fields
        isTarget: TargetStatus.UNKNOWN,
        icpFit: ICPFitStatus.UNKNOWN,
        referral: false, // This is a referred lead, not a referrer
        notes: `Referred by ${structuredOutput.firstName} ${structuredOutput.lastName}`
      }

      await createLead(referralLead)
    }

    revalidatePath("/leads")
    return mainLeadResult

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