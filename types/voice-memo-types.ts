import { z } from "zod";

// TODO: Future enhancement - Add event context and metadata to improve date/time interpretation
// - Event dates (start/end) to interpret relative timing ("next week" relative to event)
// - Voice memo recording timestamp
// - Timezone information
// - Multiple memos timeline support

export const VoiceMemoSchema = z.object({
  mainInterest: z.string().optional(),
  company: z.string().optional(),
  referral: z.object({                          // If we should follow up a different contact
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    position: z.string().optional(),
    contactTiming: z.string().optional(),      // Raw timing text (e.g., "next week", "after December")
    contactDate: z.string().optional(),        // Structured YYYY-MM-DD date
  }).optional(),
  event: z.string().optional(),
  nextSteps: z.string().optional(),
  notes: z.string().optional(),
  rawText: z.string().optional(),
});

export type VoiceMemoData = z.infer<typeof VoiceMemoSchema>;

export interface VoiceMemoResponse {
  success: boolean;
  data?: VoiceMemoData;
  error?: string;
} 