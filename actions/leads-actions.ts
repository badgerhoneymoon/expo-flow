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
        personalEmail: structuredOutput.personalEmail === "N/A" ? existingLead.personalEmail : (structuredOutput.personalEmail || existingLead.personalEmail),
        companyEmail: structuredOutput.companyEmail === "N/A" ? existingLead.companyEmail : (structuredOutput.companyEmail || existingLead.companyEmail),
        personalPhone: structuredOutput.personalPhone === "N/A" ? existingLead.personalPhone : (structuredOutput.personalPhone || existingLead.personalPhone),
        companyPhone: structuredOutput.companyPhone === "N/A" ? existingLead.companyPhone : (structuredOutput.companyPhone || existingLead.companyPhone),
        linkedin: structuredOutput.linkedin === "N/A" ? existingLead.linkedin : (structuredOutput.linkedin || existingLead.linkedin),
        mainInterest: structuredOutput.mainInterest === "N/A" ? existingLead.mainInterest : (structuredOutput.mainInterest || existingLead.mainInterest),
        nextSteps: structuredOutput.nextSteps === "N/A" ? existingLead.nextSteps : (structuredOutput.nextSteps || existingLead.nextSteps),
        notes: structuredOutput.notes === "N/A" ? existingLead.notes : (structuredOutput.notes || existingLead.notes),
        companyIndustry: structuredOutput.companyIndustry === "N/A" ? existingLead.companyIndustry : (structuredOutput.companyIndustry || existingLead.companyIndustry),
        companySize: structuredOutput.companySize === "N/A" ? existingLead.companySize : (structuredOutput.companySize || existingLead.companySize),
        companyBusiness: structuredOutput.companyBusiness === "N/A" ? existingLead.companyBusiness : (structuredOutput.companyBusiness || existingLead.companyBusiness),
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
        
        // Merge referrals - combine existing and new, removing duplicates
        referrals: [
          ...(existingLead.referrals || []),
          ...(structuredOutput.referrals || [])
        ].filter((referral, index, self) => 
          index === self.findIndex(r => 
            r.firstName === referral.firstName && 
            r.lastName === referral.lastName
          )
        )
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
        referrals: structuredOutput.referrals ?? existingLead.referrals
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

export async function updateLeadsLinkedIn(profiles: Array<{ leadId: string, linkedin: string }>) {
  try {
    console.log('[LinkedIn Update] Starting to update profiles:', profiles);
    
    const updates = await Promise.all(
      profiles.map(async profile => {
        try {
          return await queries.updateLeadLinkedIn(profile.leadId, profile.linkedin);
        } catch (error) {
          console.error(`[LinkedIn Update] Failed to update lead ${profile.leadId}:`, error);
          return null;
        }
      })
    );

    const successfulUpdates = updates.filter(Boolean);
    
    console.log(`[LinkedIn Update] Completed. Updated ${successfulUpdates.length} profiles`);
    
    revalidatePath("/leads");
    
    return { 
      success: true, 
      data: { 
        updatedCount: successfulUpdates.length,
        failedCount: profiles.length - successfulUpdates.length
      } 
    };
  } catch (error) {
    console.error('[LinkedIn Update] Error:', error);
    return { success: false, error: "Failed to update LinkedIn profiles" };
  }
}

export async function exportFilteredLeadsToCSV(filters: {
  eventName?: string;
  qualifiedOnly?: boolean;
}) {
  try {
    // Get filtered leads from database using our query function
    const filteredLeads = await queries.getFilteredLeads(filters);
    
    // Define CSV headers based on all schema columns
    const headers = [
      // Event Context
      'Event Name',
      'Event Start Date',
      'Event End Date',
      
      // Basic Lead Info
      'First Name',
      'Last Name',
      'Job Title',
      'Company',
      'Website',
      
      // Contact Info
      'Personal Email',
      'Company Email',
      'Personal Phone',
      'Company Phone',
      'LinkedIn',
      
      // Internal enrichment
      'Main Interest',
      'Next Steps',
      'Notes',
      
      // External enrichment
      'Company Industry',
      'Company Size',
      'Company Business',
      
      // Qualification Info
      'Is Target',
      'ICP Fit',
      'Qualification Reason',
      
      // Follow-up
      'Contact Date',
      'Follow Up Template',
      
      // Raw Data
      'Raw Business Card',
      'Raw Text Note',
      'Raw Voice Memo',
      
      // Referrals (as JSON string)
      'Referrals'
    ];

    // Convert leads to CSV rows
    const rows = filteredLeads.map(lead => [
      // Event Context
      lead.eventName,
      lead.eventStartDate ? new Date(lead.eventStartDate).toISOString() : '',
      lead.eventEndDate ? new Date(lead.eventEndDate).toISOString() : '',
      
      // Basic Lead Info
      lead.firstName,
      lead.lastName,
      lead.jobTitle,
      lead.company,
      lead.website,
      
      // Contact Info
      lead.personalEmail,
      lead.companyEmail,
      lead.personalPhone,
      lead.companyPhone,
      lead.linkedin,
      
      // Internal enrichment
      lead.mainInterest,
      lead.nextSteps,
      lead.notes,
      
      // External enrichment
      lead.companyIndustry,
      lead.companySize,
      lead.companyBusiness,
      
      // Qualification Info
      lead.isTarget,
      lead.icpFit,
      lead.qualificationReason,
      
      // Follow-up
      lead.contactDate,
      lead.followUpTemplate,
      
      // Raw Data
      lead.rawBusinessCard,
      lead.rawTextNote,
      lead.rawVoiceMemo,
      
      // Referrals as JSON string
      JSON.stringify(lead.referrals || [])
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          // Handle cells that might contain commas, quotes, or newlines
          if (cell === null || cell === undefined) return '""';
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      )
    ].join('\n');

    return { success: true, data: csvContent };
  } catch (error) {
    console.error('[Filtered CSV Export] Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to export filtered leads to CSV" 
    };
  }
}