import { z } from "zod"

// Schema for referrals
export const ReferralSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  position: z.string().optional(),
  contactTiming: z.string().optional(),
  contactDate: z.string().optional(),
  notes: z.string().optional()
})

export type Referral = z.infer<typeof ReferralSchema>

// This is our Zod schema for OpenAI's structured output
export const StructuredOutputSchema = z.object({
  // Basic Lead Info
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  
  // Contact Info
  email: z.string().optional(),
  linkedin: z.string().optional(),

  // Internal enrichment specific fields
  mainInterest: z.string().optional(),
  nextSteps: z.string(),
  notes: z.string(),

  // External enrichment specific fields
  companyIndustry: z.string().optional(),
  companySize: z.string().optional(),
  companyBusiness: z.string().optional(),

  // Referral Info
  referrals: z.array(ReferralSchema),

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
  businessCardPath?: string
  voiceMemoPath?: string
}

export interface StructuredOutputResponse {
  success: boolean
  data?: StructuredOutput
  error?: string
} 