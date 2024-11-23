import { z } from "zod";

export const BusinessCardSchema = z.object({
  fullName: z.string(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  linkedin: z.string().optional(),
  rawText: z.string().optional(),
}).partial();

export type BusinessCardData = z.infer<typeof BusinessCardSchema>;

export interface BusinessCardExtractResponse {
  success: boolean;
  data?: BusinessCardData;
  error?: string;
} 