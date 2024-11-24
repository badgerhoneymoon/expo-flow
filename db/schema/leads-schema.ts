import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core"

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
  email: text("email"),
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

  // Referral Info
  referral: boolean("referral").default(false),
  
  // Qualification Info
  isTarget: boolean("is_target").default(false),
  icpFit: boolean("icp_fit"),
  qualificationReason: text("qualification_reason"),

  // Follow-up
  contactTiming: text("contact_timing"),
  contactDate: text("contact_date"),
  followUpTemplate: text("follow_up_template"),
  
  // Raw Data Storage
  rawBusinessCard: text("raw_business_card"),
  rawTextNote: text("raw_text_note"),
  rawVoiceMemo: text("raw_voice_memo"),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert