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

    let updatedOrNewLead;

    if (existingLead) {
      // Merge with existing lead data, preserving existing values unless new data is provided
      const updatedData = {
        ...existingLead,
        firstName: structuredOutput.firstName === "N/A" ? existingLead.firstName : (structuredOutput.firstName || existingLead.firstName),
        lastName: structuredOutput.lastName === "N/A" ? existingLead.lastName : (structuredOutput.lastName || existingLead.lastName),
        jobTitle: structuredOutput.jobTitle === "N/A" ? existingLead.jobTitle : (structuredOutput.jobTitle || existingLead.jobTitle),
        company: structuredOutput.company === "N/A" ? existingLead.company : (structuredOutput.company || existingLead.company),
        website: structuredOutput.website === "N/A" ? existingLead.website : (structuredOutput.website || existingLead.website),
        email: structuredOutput.email === "N/A" ? existingLead.email : (structuredOutput.email || existingLead.email),
        linkedin: structuredOutput.linkedin === "N/A" ? existingLead.linkedin : (structuredOutput.linkedin || existingLead.linkedin),
        mainInterest: structuredOutput.mainInterest === "N/A" ? existingLead.mainInterest : (structuredOutput.mainInterest || existingLead.mainInterest),
        nextSteps: structuredOutput.nextSteps === "N/A" ? existingLead.nextSteps : (structuredOutput.nextSteps || existingLead.nextSteps),
        notes: structuredOutput.notes === "N/A" ? existingLead.notes : (structuredOutput.notes || existingLead.notes),
        companyIndustry: structuredOutput.companyIndustry === "N/A" ? existingLead.companyIndustry : (structuredOutput.companyIndustry || existingLead.companyIndustry),
        companySize: structuredOutput.companySize === "N/A" ? existingLead.companySize : (structuredOutput.companySize || existingLead.companySize),
        companyBusiness: structuredOutput.companyBusiness === "N/A" ? existingLead.companyBusiness : (structuredOutput.companyBusiness || existingLead.companyBusiness),
        qualificationReason: structuredOutput.qualificationReason === "N/A" ? existingLead.qualificationReason : (structuredOutput.qualificationReason || existingLead.qualificationReason),
        contactTiming: structuredOutput.contactTiming === "N/A" ? existingLead.contactTiming : (structuredOutput.contactTiming || existingLead.contactTiming),
        contactDate: structuredOutput.contactDate === "N/A" ? existingLead.contactDate : (structuredOutput.contactDate || existingLead.contactDate),
        followUpTemplate: structuredOutput.followUpTemplate === "N/A" ? existingLead.followUpTemplate : (structuredOutput.followUpTemplate || existingLead.followUpTemplate),
        
        // Source tracking flags don't need N/A handling as they're booleans
        hasBusinessCard: structuredOutput.hasBusinessCard || existingLead.hasBusinessCard,
        hasTextNote: structuredOutput.hasTextNote || existingLead.hasTextNote,
        hasVoiceMemo: structuredOutput.hasVoiceMemo || existingLead.hasVoiceMemo,
        
        // Raw data doesn't need N/A handling
        rawBusinessCard: structuredOutput.rawBusinessCard || existingLead.rawBusinessCard,
        rawTextNote: structuredOutput.rawTextNote || existingLead.rawTextNote,
        rawVoiceMemo: structuredOutput.rawVoiceMemo || existingLead.rawVoiceMemo,
        
        // Enum fields don't need N/A handling
        isTarget: structuredOutput.isTarget === 'UNKNOWN' ? existingLead.isTarget : structuredOutput.isTarget,
        icpFit: structuredOutput.icpFit === 'UNKNOWN' ? existingLead.icpFit : structuredOutput.icpFit,
        
        // Boolean fields don't need N/A handling
        referral: structuredOutput.referral || existingLead.referral,
      }
      
      updatedOrNewLead = await queries.updateLead(existingLead.id, updatedData)
    } else {
      // Create new lead
      updatedOrNewLead = await queries.createLead(structuredOutputToNewLead(structuredOutput))
    }

    // Handle referral if present - now using the updated/new lead data
    if (structuredOutput.referral && structuredOutput.referralData) {
      // Get the most up-to-date company information from the database
      const sourceLeadWithEnrichedData = await queries.getLead(updatedOrNewLead.id)
      if (!sourceLeadWithEnrichedData) {
        throw new Error("Failed to fetch updated lead data")
      }

      // Create a new lead for the referral using the enriched company data
      const referralLead: StructuredOutput = {
        firstName: structuredOutput.referralData.firstName,
        lastName: structuredOutput.referralData.lastName,
        jobTitle: structuredOutput.referralData.position,
        // Use the enriched company data from the source lead, handle null values
        company: sourceLeadWithEnrichedData.company || undefined,
        website: sourceLeadWithEnrichedData.website || undefined,
        companyIndustry: sourceLeadWithEnrichedData.companyIndustry || undefined,
        companySize: sourceLeadWithEnrichedData.companySize || undefined,
        companyBusiness: sourceLeadWithEnrichedData.companyBusiness || undefined,
        // Inherit main interest from source lead
        mainInterest: sourceLeadWithEnrichedData.mainInterest || undefined,
        // Required fields with defaults
        nextSteps: "Follow up with referred contact",
        notes: `Referred by ${sourceLeadWithEnrichedData.firstName || ''} ${sourceLeadWithEnrichedData.lastName || ''}`,
        // Referral specific data
        contactTiming: structuredOutput.referralData.contactTiming,
        contactDate: structuredOutput.referralData.contactDate,
        // Source tracking - inherit from the current source
        hasBusinessCard: structuredOutput.hasBusinessCard,
        hasTextNote: structuredOutput.hasTextNote,
        hasVoiceMemo: structuredOutput.hasVoiceMemo,
        // Use target assessment from referral data
        isTarget: structuredOutput.referralData.isTarget ?? TargetStatus.UNKNOWN,
        icpFit: ICPFitStatus.UNKNOWN, // Keep ICP as UNKNOWN since we need more info
        qualificationReason: structuredOutput.referralData.qualificationReason,
        // This person was referred by someone
        referral: true
      }

      // Create the referred lead
      await createLead(referralLead)

      // Update the source lead to referral: false since they did the referring
      const updatedSourceData = {
        ...updatedOrNewLead,
        referral: false // This person made a referral but wasn't referred themselves
      }
      updatedOrNewLead = await queries.updateLead(updatedOrNewLead.id, updatedSourceData)
    }

    revalidatePath("/leads")
    return { success: true, data: updatedOrNewLead }

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