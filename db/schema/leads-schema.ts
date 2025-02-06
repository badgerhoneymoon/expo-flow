import { pgTable, text, timestamp, boolean, uuid, pgEnum, jsonb } from "drizzle-orm/pg-core"

// Create Postgres enums with explicit values
export const targetStatusEnum = pgEnum('target_status', ['YES', 'NO', 'UNKNOWN'] as const)
export const icpFitStatusEnum = pgEnum('icp_fit_status', ['YES', 'NO', 'UNKNOWN'] as const)

// Add type for referral data
export interface ReferralData {
  firstName: string
  lastName: string
  position?: string
  contactDate?: string
  notes?: string
}

export const leads = pgTable("leads", {
  // Core Identification (handled by Supabase)
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Event Context
  eventName: text("event_name"),
  eventStartDate: timestamp("event_start_date"),
  eventEndDate: timestamp("event_end_date"),

  // Basic Lead Info
  firstName: text("first_name"),
  lastName: text("last_name"),
  jobTitle: text("job_title"),
  company: text("company"),
  website: text("website"),
  
  // Contact Info
  personalEmail: text("personal_email"),
  companyEmail: text("company_email"),
  personalPhone: text("personal_phone"),
  companyPhone: text("company_phone"),
  linkedin: text("linkedin"),

  // Source Tracking
  hasBusinessCard: boolean("has_business_card").default(false),
  hasTextNote: boolean("has_text_note").default(false),
  hasVoiceMemo: boolean("has_voice_memo").default(false),

  // Internal enrichment specific fields
  mainInterest: text("main_interest"),
  nextSteps: text("next_steps"),
  notes: text("notes"),

  // External enrichment specific fields
  companyIndustry: text("company_industry"),
  companySize: text("company_size"),
  companyBusiness: text("company_business"),

  // Referrals stored as JSONB array
  referrals: jsonb("referrals").default([]),
  
  // Qualification Info
  isTarget: targetStatusEnum("is_target").default('UNKNOWN'),
  icpFit: icpFitStatusEnum("icp_fit").default('UNKNOWN'),
  qualificationReason: text("qualification_reason"),

  // Follow-up
  contactDate: text("contact_date"),
  followUpTemplate: text("follow_up_template"),
  
  // Raw Data Storage
  rawBusinessCard: text("raw_business_card"),
  rawTextNote: text("raw_text_note"),
  rawVoiceMemo: text("raw_voice_memo"),

  // Storage Paths
  businessCardPath: text("business_card_path"),
  voiceMemoPath: text("voice_memo_path"),
})

export type Lead = typeof leads.$inferSelect & {
  referrals: ReferralData[]
}
export type NewLead = typeof leads.$inferInsert & {
  referrals: ReferralData[]
}