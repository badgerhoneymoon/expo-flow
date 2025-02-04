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

// Raw data schema to ensure preservation
export const RawDataSchema = z.object({
  rawBusinessCard: z.string().optional(),
  rawTextNote: z.string().optional(),
  rawVoiceMemo: z.string().optional(),
  businessCardPath: z.string().optional(),
  voiceMemoPath: z.string().optional(),
  hasBusinessCard: z.boolean().optional(),
  hasTextNote: z.boolean().optional(),
  hasVoiceMemo: z.boolean().optional()
})

// This is our Zod schema for OpenAI's structured output
export const StructuredOutputSchema = z.object({
  // Basic Lead Info
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  
  // Contact Info
  personalEmail: z.string().optional(),
  companyEmail: z.string().optional(),
  personalPhone: z.string().optional(),
  companyPhone: z.string().optional(),
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
}).merge(RawDataSchema)

export type StructuredOutput = z.infer<typeof StructuredOutputSchema>

export interface StructuredOutputResponse {
  success: boolean
  data?: StructuredOutput
  error?: string
} 