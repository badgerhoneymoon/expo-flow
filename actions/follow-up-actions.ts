"use server"

import { Lead } from "@/db/schema/leads-schema"
import { StructuredOutputService } from "@/lib/services/structured-output-service"
import { 
  generateFollowUpPrompt,  
  followUpSystemPrompt,
  FollowUpResponse 
} from "@/lib/prompts/follow-up-prompt"
import { db } from "@/db/db"
import { leads } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Create a Zod schema that matches our response schema
const followUpZodSchema = z.object({
  message: z.string().describe("The LinkedIn connection/follow-up message")
})

export async function generateFollowUps(inputLeads: Lead[]) {
  try {
    console.log('[Follow-up Generation] Starting to process leads');
    
    const processableLeads = inputLeads.filter(lead => 
      // Check if lead is qualified
      lead.isTarget === "YES" &&
      lead.icpFit === "YES" &&
      // Check if lead needs follow-up
      (!lead.followUpTemplate || lead.followUpTemplate === "N/A" || lead.followUpTemplate === "")
    )

    console.log(`[Follow-up Generation] Found ${processableLeads.length} leads to process`);

    const updates = await Promise.all(
      processableLeads.map(async lead => {
        try {
          // Create a simplified lead object that matches our prompt interface
          const promptLead = {
            firstName: lead.firstName,
            lastName: lead.lastName,
            jobTitle: lead.jobTitle,
            company: lead.company,
            mainInterest: lead.mainInterest,
            notes: lead.notes,
            eventName: lead.eventName,
            referral: lead.referral ?? false // Provide default false if null
          }

          const result = await StructuredOutputService.process<FollowUpResponse>(
            generateFollowUpPrompt(promptLead),
            followUpZodSchema,
            followUpSystemPrompt
          )

          if (result.success && result.data) {
            // Update the lead with the generated message
            const [updatedLead] = await db
              .update(leads)
              .set({ 
                followUpTemplate: result.data.message,
                updatedAt: new Date()
              })
              .where(eq(leads.id, lead.id))
              .returning()

            return updatedLead
          }
          return null
        } catch (error) {
          console.error(`[Follow-up Generation] Failed to process lead ${lead.id}:`, error)
          return null
        }
      })
    )

    const successfulUpdates = updates.filter(Boolean)
    
    console.log(`[Follow-up Generation] Complete. Generated ${successfulUpdates.length} follow-ups`);
    
    revalidatePath("/leads")
    
    return { 
      success: true, 
      data: { 
        updatedCount: successfulUpdates.length,
        failedCount: processableLeads.length - successfulUpdates.length
      } 
    }

  } catch (error) {
    console.error('[Follow-up Generation] Error:', error)
    return { 
      success: false, 
      error: "Failed to generate follow-up messages" 
    }
  }
} 