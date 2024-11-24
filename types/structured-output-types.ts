import { z } from "zod"

// Define our enums
export enum TargetStatus {
  YES = "YES",
  NO = "NO",
  UNKNOWN = "UNKNOWN"
}

export enum ICPFitStatus {
  YES = "YES",
  NO = "NO",
  UNKNOWN = "UNKNOWN"
}

// This is our Zod schema for OpenAI's structured output
export const StructuredOutputSchema = z.object({
  // Basic Lead Info
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  
  // Contact Info
  email: z.string().optional(),
  linkedin: z.string().optional(),

  // Internal enrichment specific fields
  mainInterest: z.string().optional(),
  nextSteps: z.string().optional(),
  notes: z.string().optional(),

  // External enrichment specific fields
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
  companyBusiness: z.string().optional(),

  // Referral Info
  referral: z.boolean().optional(),

  // Qualification Info
  isTarget: z.nativeEnum(TargetStatus).optional().default(TargetStatus.UNKNOWN),
  icpFit: z.nativeEnum(ICPFitStatus).optional().default(ICPFitStatus.UNKNOWN),
  qualificationReason: z.string().optional(),

  // Follow-up
  contactTiming: z.string().optional(),
  contactDate: z.string().optional(),
  followUpTemplate: z.string().optional()
})

export type StructuredOutput = z.infer<typeof StructuredOutputSchema> & {
  // Add our application-specific fields here
  hasBusinessCard?: boolean
  hasTextNote?: boolean
  hasVoiceMemo?: boolean
  rawBusinessCard?: string
  rawTextNote?: string
  rawVoiceMemo?: string
}

export interface StructuredOutputResponse {
  success: boolean
  data?: StructuredOutput
  error?: string
} 