import type { NewLead } from "@/db/schema/leads-schema"
import type { StructuredOutput } from "@/types/structured-output-types"

export function structuredOutputToNewLead(output: StructuredOutput): Omit<NewLead, 'id'> {
  return {
    // Basic Lead Info
    firstName: output.firstName || null,
    lastName: output.lastName || null,
    jobTitle: output.jobTitle || null,
    company: output.company || null,
    website: output.website || null,
    
    // Contact Info
    email: output.email || null,
    linkedin: output.linkedin || null,

    // Internal enrichment
    mainInterest: output.mainInterest || null,
    nextSteps: output.nextSteps || null,
    notes: output.notes || null,

    // External enrichment
    companyIndustry: output.companyIndustry || null,
    companySize: output.companySize || null,
    companyBusiness: output.companyBusiness || null,

    // Referral & Qualification
    referral: output.referral,
    isTarget: output.isTarget,
    icpFit: output.icpFit || null,
    qualificationReason: output.qualificationReason || null,

    // Follow-up
    contactTiming: output.contactTiming || null,
    contactDate: output.contactDate || null,
    followUpTemplate: output.followUpTemplate || null,

    // Source Tracking
    hasBusinessCard: output.hasBusinessCard ?? false,
    hasTextNote: output.hasTextNote ?? false,
    hasVoiceMemo: output.hasVoiceMemo ?? false,

    // Raw Data
    rawBusinessCard: output.rawBusinessCard || null,
    rawTextNote: output.rawTextNote || null,
    rawVoiceMemo: output.rawVoiceMemo || null
  }
} 