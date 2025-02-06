import type { NewLead } from "@/db/schema/leads-schema"
import type { StructuredOutput } from "@/types/structured-output-types"

export function structuredOutputToNewLead(output: StructuredOutput): Omit<NewLead, 'id'> {
  return {
    // Basic Lead Info
    firstName: output.firstName || "N/A",
    lastName: output.lastName || "N/A",
    jobTitle: output.jobTitle || "N/A",
    company: output.company || "N/A",
    website: output.website || "N/A",
    
    // Event Info
    eventName: output.eventName || "N/A",
    
    // Contact Info
    personalEmail: output.personalEmail || "N/A",
    companyEmail: output.companyEmail || "N/A",
    personalPhone: output.personalPhone || "N/A",
    companyPhone: output.companyPhone || "N/A",
    linkedin: output.linkedin || "N/A",

    // Internal enrichment
    mainInterest: output.mainInterest || "N/A",
    nextSteps: output.nextSteps || "N/A",
    notes: output.notes || "N/A",

    // External enrichment
    companyIndustry: output.companyIndustry || "N/A",
    companySize: output.companySize || "N/A",
    companyBusiness: output.companyBusiness || "N/A",

    // Referrals
    referrals: output.referrals || [],

    // Default qualification values
    isTarget: "UNKNOWN",
    icpFit: "UNKNOWN",
    qualificationReason: null,

    // Follow-up
    contactDate: output.contactDate || "N/A",
    followUpTemplate: output.followUpTemplate || "N/A",

    // Source Tracking
    hasBusinessCard: output.hasBusinessCard ?? false,
    hasTextNote: output.hasTextNote ?? false,
    hasVoiceMemo: output.hasVoiceMemo ?? false,

    // Raw Data
    rawBusinessCard: output.rawBusinessCard || null,
    rawTextNote: output.rawTextNote || null,
    rawVoiceMemo: output.rawVoiceMemo || null,

    // Storage Paths
    businessCardPath: output.businessCardPath || null,
    voiceMemoPath: output.voiceMemoPath || null,

    // Timestamps will be handled by default values
    createdAt: new Date(),
    updatedAt: new Date()
  }
} 