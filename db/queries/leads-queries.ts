"use server"

import { eq, and, or, sql } from "drizzle-orm"
import { db } from "@/db/db"
import { leads } from "@/db/schema"
import type { Lead, NewLead } from "@/db/schema"

export async function getLeads(): Promise<Lead[]> {
  try {
    return await db.select().from(leads)
  } catch (error) {
    console.error("Error getting leads:", error)
    throw new Error("Failed to get leads")
  }
}

export async function getLead(id: string): Promise<Lead | undefined> {
  try {
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
    return lead
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
    const [lead] = await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.firstName, firstName),
          eq(leads.lastName, lastName),
          eq(leads.company, company)
        )
      )
    return lead
  } catch (error) {
    console.error("Error finding lead:", error)
    throw new Error("Failed to find lead")
  }
}

export async function createLead(lead: NewLead): Promise<Lead> {
  try {
    const [newLead] = await db
      .insert(leads)
      .values(lead)
      .returning()
    return newLead
  } catch (error) {
    console.error("Error creating lead:", error)
    throw new Error("Failed to create lead")
  }
}

export async function updateLead(id: string, lead: Partial<NewLead>): Promise<Lead> {
  try {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...lead, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning()
    return updatedLead
  } catch (error) {
    console.error("Error updating lead:", error)
    throw new Error("Failed to update lead")
  }
}

export async function deleteLead(id: string): Promise<Lead> {
  try {
    const [deletedLead] = await db
      .delete(leads)
      .where(eq(leads.id, id))
      .returning()
    return deletedLead
  } catch (error) {
    console.error("Error deleting lead:", error)
    throw new Error("Failed to delete lead")
  }
}

export async function getLeadsWithoutWebsites() {
  return await db
    .select()
    .from(leads)
    .where(
      or(
        eq(leads.website, ""),
        eq(leads.website, "N/A"),
        sql`${leads.website} IS NULL`
      )
    )
} 