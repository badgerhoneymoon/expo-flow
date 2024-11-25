"use server"

import { StructuredOutputService } from '@/lib/services/structured-output-service'
import { QualificationSchema, type QualificationOutput } from '@/types/qualification-types'
import { getQualificationPrompt } from '@/lib/prompts/qualification-prompt'
import { getLead } from './leads-actions'
import { getCompanyProfile } from './company-profile-actions'
import { db } from '@/db/db'
import { leads } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { Lead } from '@/db/schema/leads-schema'

function formatQualificationReason(targetReason: string, icpReason: string): string {
  return `Target Assessment:\n${targetReason}\n\nICP Assessment:\n${icpReason}`;
}

export async function qualifyLead(leadId: string) {
  try {
    // Get company profile for context
    const companyProfile = await getCompanyProfile()

    // Get lead data
    const lead = await getLead(leadId)
    if (!lead.success || !lead.data) {
      throw new Error('Failed to get lead data')
    }

    // Prepare lead data for prompt
    const leadData = {
      jobTitle: lead.data.jobTitle || 'N/A',
      mainInterest: lead.data.mainInterest || undefined,
      notes: lead.data.notes || undefined,
      companyIndustry: lead.data.companyIndustry || undefined,
      companySize: lead.data.companySize || undefined,
      companyBusiness: lead.data.companyBusiness || undefined
    }

    // Get qualification analysis
    const result = await StructuredOutputService.process<QualificationOutput>(
      JSON.stringify(leadData),
      QualificationSchema,
      getQualificationPrompt(companyProfile, leadData)
    )

    if (!result.success || !result.data) {
      throw new Error('Failed to qualify lead')
    }

    // Update lead with combined qualification reason
    const [updatedLead] = await db
      .update(leads)
      .set({
        isTarget: result.data.isTarget,
        icpFit: result.data.icpFit,
        qualificationReason: formatQualificationReason(
          result.data.targetReason,
          result.data.icpReason
        ),
        updatedAt: new Date()
      } satisfies Partial<Lead>)
      .where(eq(leads.id, leadId))
      .returning()

    if (!updatedLead) {
      throw new Error('Failed to update lead with qualification')
    }

    return {
      success: true,
      data: result.data
    }

  } catch (error) {
    console.error('Error qualifying lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to qualify lead'
    }
  }
}

// Add a function to qualify multiple leads
export async function qualifyLeads(leadIds: string[]) {
  try {
    // Process all leads in parallel using Promise.all
    const results = await Promise.all(
      leadIds.map(async (id) => {
        const result = await qualifyLead(id)
        return {
          id,          // Keep track of which lead ID this result is for
          ...result    // Spread the qualification result
        }
      })
    )

    // Split results into successful and failed
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    // Return a summary with statistics
    return {
      success: true,
      data: {
        total: results.length,      // Total number of leads processed
        successful: successful.length,  // How many succeeded
        failed: failed.length,          // How many failed
        results                         // Full details of all results
      }
    }
  } catch (error) {
    console.error('Error qualifying leads:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to qualify leads'
    }
  }
} 