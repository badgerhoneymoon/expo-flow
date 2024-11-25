import { z } from "zod";

export const QualificationSchema = z.object({
  isTarget: z.enum(['YES', 'NO', 'UNKNOWN']),
  icpFit: z.enum(['YES', 'NO', 'UNKNOWN']),
  targetReason: z.string(),
  icpReason: z.string(),
});

export type QualificationOutput = z.infer<typeof QualificationSchema>; 