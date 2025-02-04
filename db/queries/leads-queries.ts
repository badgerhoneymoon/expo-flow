"use server"

import { eq, and, or, sql } from "drizzle-orm"
import { db } from "@/db/db"
import { leads } from "@/db/schema"
import type { Lead, NewLead, ReferralData } from "@/db/schema"

export async function getLeads(): Promise<Lead[]> {
  try {
    const results = await db.select().from(leads)
    return results.map(lead => ({ ...lead, referrals: (lead.referrals || []) as ReferralData[] }))
  } catch (error) {
    console.error("Error getting leads:", error)
    throw new Error("Failed to get leads")
  }
}

export async function getLead(id: string): Promise<Lead | undefined> {
  try {
    const [result] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
    
    return result ? { ...result, referrals: (result.referrals || []) as ReferralData[] } : undefined
  } catch (error) {
    console.error("Error getting lead:", error)
    throw new Error("Failed to get lead")
  }
}

export async function findLeadByNameAndCompany(
  firstName: string,
  lastName: string,
  company: string
): Promise<Lead | undefined> {
  try {
    const [result] = await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.firstName, firstName),
          eq(leads.lastName, lastName)
        )
      )
    
    return result ? { ...result, referrals: (result.referrals || []) as ReferralData[] } : undefined
  } catch (error) {
    console.error("Error finding lead:", error)
    throw new Error("Failed to find lead")
  }
}

export async function createLead(lead: NewLead): Promise<Lead> {
  try {
    console.log('Creating lead in DB with raw voice memo:', lead.rawVoiceMemo)
    const [newLead] = await db
      .insert(leads)
      .values(lead)
      .returning()
    console.log('Created lead in DB with raw voice memo:', newLead.rawVoiceMemo)
    return { ...newLead, referrals: (newLead.referrals || []) as ReferralData[] }
  } catch (error) {
    console.error("Error creating lead:", error)
    throw new Error("Failed to create lead")
  }
}

export async function updateLead(id: string, lead: Partial<NewLead>): Promise<Lead> {
  try {
    console.log(`[DB Update] Updating lead ${id} with raw voice memo:`, lead.rawVoiceMemo);
    
    const [updatedLead] = await db
      .update(leads)
      .set({ ...lead, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning()
    
    console.log(`[DB Update] Updated lead with raw voice memo:`, updatedLead.rawVoiceMemo);
    return { ...updatedLead, referrals: (updatedLead.referrals || []) as ReferralData[] };
  } catch (error) {
    console.error("[DB Update] Error updating lead:", error);
    throw new Error("Failed to update lead");
  }
}

export async function deleteLead(id: string): Promise<Lead> {
  try {
    const [deletedLead] = await db
      .delete(leads)
      .where(eq(leads.id, id))
      .returning()
    return { ...deletedLead, referrals: (deletedLead.referrals || []) as ReferralData[] }
  } catch (error) {
    console.error("Error deleting lead:", error)
    throw new Error("Failed to delete lead")
  }
}

export async function getLeadsWithoutWebsites(): Promise<Lead[]> {
  const results = await db
    .select()
    .from(leads)
    .where(
      or(
        eq(leads.website, ""),
        eq(leads.website, "N/A"),
        sql`${leads.website} IS NULL`
      )
    )
  return results.map(lead => ({ ...lead, referrals: (lead.referrals || []) as ReferralData[] }))
}

export async function updateLeadLinkedIn(id: string, linkedin: string): Promise<Lead> {
  try {
    console.log(`[DB Update] Updating LinkedIn for lead ${id} with: ${linkedin}`);
    
    const [updatedLead] = await db
      .update(leads)
      .set({ 
        linkedin,
        updatedAt: new Date() 
      })
      .where(eq(leads.id, id))
      .returning()
    
    console.log(`[DB Update] LinkedIn update result:`, updatedLead);
    return { ...updatedLead, referrals: (updatedLead.referrals || []) as ReferralData[] };
  } catch (error) {
    console.error("[DB Update] Error updating lead LinkedIn:", error);
    throw new Error("Failed to update lead LinkedIn");
  }
} 