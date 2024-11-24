import { z } from "zod"

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

  // Internal enrichment fields
  mainInterest: z.string().optional(),
  nextSteps: z.string().optional(),
  notes: z.string().optional(),

  // Referral Info
  referral: z.boolean().default(false),
  
  // Follow-up
  contactTiming: z.string().optional(),
  contactDate: z.string().optional(),

  // Source Tracking
  hasBusinessCard: z.boolean().default(false),
  hasTextNote: z.boolean().default(false),
  hasVoiceMemo: z.boolean().default(false),

  // Raw Data Storage
  rawBusinessCard: z.string().optional(),
  rawTextNote: z.string().optional(),
  rawVoiceMemo: z.string().optional(),
})

export type StructuredOutput = z.infer<typeof StructuredOutputSchema>

export interface StructuredOutputResponse {
  success: boolean
  data?: StructuredOutput
  error?: string
} 