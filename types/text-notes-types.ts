import { z } from "zod";

export const TextNotesSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  qualified: z.enum(["yes", "no"]).optional(),
  reason: z.string().optional(),
  rawText: z.string().optional(),
});

export type TextNotesData = z.infer<typeof TextNotesSchema>;

export interface TextNotesResponse {
  success: boolean;
  data?: TextNotesData;
  error?: string;
} 