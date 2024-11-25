"use server"

import { revalidatePath } from "next/cache"
import * as queries from "@/db/queries/leads-queries"
import { StructuredOutput } from "@/types/structured-output-types"
import { structuredOutputToNewLead } from "@/lib/utils/structured-output-converter"
import { searchCompanyUrl, enrichCompanyData } from "@/lib/services/exa-service"
import { targetStatusEnum, icpFitStatusEnum } from "@/db/schema/leads-schema"
import { db } from "@/db/db"
import { leads } from "@/db/schema"
import { eq, and, or, sql } from "drizzle-orm"
import type { Lead } from "@/db/schema/leads-schema"

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
        
        // Keep existing qualification data
        isTarget: existingLead.isTarget,
        icpFit: existingLead.icpFit,
        qualificationReason: existingLead.qualificationReason,
        
        // Boolean fields don't need N/A handling
        referral: structuredOutput.referral || existingLead.referral,
      }
      
      updatedOrNewLead = await queries.updateLead(existingLead.id, updatedData)
    } else {
      // Create new lead with default qualification values
      const newLeadData = {
        ...structuredOutputToNewLead(structuredOutput),
        isTarget: targetStatusEnum.enumValues[2],
        icpFit: icpFitStatusEnum.enumValues[2],
        qualificationReason: null
      }
      updatedOrNewLead = await queries.createLead(newLeadData)
    }

    // Handle referral if present
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
        company: sourceLeadWithEnrichedData.company || undefined,
        website: sourceLeadWithEnrichedData.website || undefined,
        companyIndustry: sourceLeadWithEnrichedData.companyIndustry || undefined,
        companySize: sourceLeadWithEnrichedData.companySize || undefined,
        companyBusiness: sourceLeadWithEnrichedData.companyBusiness || undefined,
        mainInterest: sourceLeadWithEnrichedData.mainInterest || undefined,
        nextSteps: "Follow up with referred contact",
        notes: `Referred by ${sourceLeadWithEnrichedData.firstName || ''} ${sourceLeadWithEnrichedData.lastName || ''}`,
        contactTiming: structuredOutput.referralData.contactTiming,
        contactDate: structuredOutput.referralData.contactDate,
        hasBusinessCard: structuredOutput.hasBusinessCard,
        hasTextNote: structuredOutput.hasTextNote,
        hasVoiceMemo: structuredOutput.hasVoiceMemo,
        referral: true
      }

      // Create the referred lead
      await createLead(referralLead)

      // Update the source lead to referral: false since they did the referring
      const updatedSourceData = {
        ...updatedOrNewLead,
        referral: false
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

export async function findMissingWebsites() {
  try {
    console.log('[Website Processing] Starting to process leads');
    
    // Get leads that need either website or enrichment
    const leadsToProcess = await db
      .select()
      .from(leads)
      .where(
        or(
          // Needs website
          or(
            eq(leads.website, ""),
            eq(leads.website, "N/A"),
            sql`${leads.website} IS NULL`
          ),
          // OR needs enrichment
          and(
            or(
              eq(leads.companyIndustry, ""),
              eq(leads.companyIndustry, "N/A"),
              sql`${leads.companyIndustry} IS NULL`
            ),
            or(
              eq(leads.companyBusiness, ""),
              eq(leads.companyBusiness, "N/A"),
              sql`${leads.companyBusiness} IS NULL`
            )
          )
        )
      )

    console.log(`[Website Processing] Found ${leadsToProcess.length} leads to process`);
    
    let websiteUpdates = 0;
    let enrichmentUpdates = 0;
    
    for (const lead of leadsToProcess) {
      console.log(`[Website Processing] Processing lead: ${lead.id} (${lead.company})`);
      
      if (!lead.company || lead.company === "N/A") {
        console.log(`[Website Processing] Skipping lead ${lead.id} - no valid company name`);
        continue;
      }

      let websiteToUse = lead.website;
      
      // Only search for website if it's missing
      if (!websiteToUse || websiteToUse === "N/A") {
        const { primaryUrl } = await searchCompanyUrl(lead.company);
        if (primaryUrl) {
          websiteToUse = primaryUrl;
          websiteUpdates++;
          
          // Update website immediately if found
          await db
            .update(leads)
            .set({ website: primaryUrl })
            .where(eq(leads.id, lead.id));
            
          console.log(`[Website Processing] Updated website for ${lead.id}: ${primaryUrl}`);
        }
      }
      
      // Try enrichment if we have a website and missing either industry or business info
      if (websiteToUse && websiteToUse !== "N/A" && 
          (!lead.companyIndustry || lead.companyIndustry === "N/A" ||
           !lead.companyBusiness || lead.companyBusiness === "N/A")) {
        
        console.log(`[Website Processing] Attempting enrichment for ${lead.id}`);
        const enrichmentData = await enrichCompanyData(websiteToUse);
        
        if (enrichmentData) {
          const updateData: Partial<Lead> = {};
          
          if ((!lead.companyIndustry || lead.companyIndustry === "N/A") && enrichmentData.industry) {
            updateData.companyIndustry = enrichmentData.industry;
          }
          
          if ((!lead.companyBusiness || lead.companyBusiness === "N/A") && enrichmentData.valueProp) {
            updateData.companyBusiness = enrichmentData.valueProp;
          }
          
          if (Object.keys(updateData).length > 0) {
            await db
              .update(leads)
              .set(updateData)
              .where(eq(leads.id, lead.id));
              
            enrichmentUpdates++;
            console.log(`[Website Processing] Enriched data for ${lead.id}`, updateData);
          }
        }
      }
    }
    
    console.log(`[Website Processing] Complete. Websites: ${websiteUpdates}, Enrichments: ${enrichmentUpdates}`);
    
    return { 
      success: true, 
      data: { 
        processedCount: leadsToProcess.length,
        websiteUpdates,
        enrichmentUpdates
      } 
    }
  } catch (error) {
    console.error('[Website Processing] Error:', error);
    return { success: false, error: "Failed to process websites and enrichments" }
  }
} 