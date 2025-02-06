import { z } from "zod";

// TODO: Future enhancement - Add event context and metadata to improve date/time interpretation
// - Event dates (start/end) to interpret relative timing ("next week" relative to event)
// - Voice memo recording timestamp
// - Timezone information
// - Multiple memos timeline support

export const VoiceMemoSchema = z.object({
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

  // Follow-up
  contactDate: z.string().optional(),      // Absolute date in YYYY-MM-DD format
  followUpTemplate: z.string().optional(), // Generated follow-up message

  // Additional Info
  mainInterest: z.string().optional(),     // Main topic of interest
  nextSteps: z.string().optional(),        // Specific next actions
  notes: z.string().optional(),            // Additional context or observations

  // Referrals
  referrals: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    position: z.string().optional(),
    contactDate: z.string().optional(),
    notes: z.string().optional()
  })).optional()
});

export type VoiceMemoData = z.infer<typeof VoiceMemoSchema>;

export interface VoiceMemoResponse {
  success: boolean;
  data?: VoiceMemoData;
  error?: string;
} 