import { Lead } from "@/db/schema/leads-schema"

type MockProfiles = {
  [key: `${string} ${string}`]: string  // Just store LinkedIn URLs
}

// Mock LinkedIn profile data - just URLs
export const MOCK_LINKEDIN_PROFILES: MockProfiles = {
  "Jane Doe": "https://www.linkedin.com/in/jane-doe-tech-executive",
  "Emily Johnson": "https://www.linkedin.com/in/emily-johnson-product"
}

interface LinkedInEnrichmentResult {
  success: boolean
  data?: {
    enrichedCount: number
    profiles: Array<{
      leadId: string
      linkedin: string
    }>
  }
  error?: string
}

export async function mockEnrichLinkedInProfiles(leads: Lead[]): Promise<LinkedInEnrichmentResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  try {
    const enrichableLeads = leads.filter(lead => {
      const fullName = `${lead.firstName} ${lead.lastName}` as const
      return (
        // Check if lead is qualified
        lead.isTarget === "YES" &&
        lead.icpFit === "YES" &&
        // Check if lead needs LinkedIn
        (!lead.linkedin || lead.linkedin === "N/A" || lead.linkedin === "") &&
        // Check if we have mock data for this person
        Object.prototype.hasOwnProperty.call(MOCK_LINKEDIN_PROFILES, fullName)
      )
    })

    const enrichedProfiles = enrichableLeads.map(lead => {
      const fullName = `${lead.firstName} ${lead.lastName}` as keyof typeof MOCK_LINKEDIN_PROFILES
      const linkedInUrl = MOCK_LINKEDIN_PROFILES[fullName]

      return {
        leadId: lead.id,
        linkedin: linkedInUrl
      }
    })

    return {
      success: true,
      data: {
        enrichedCount: enrichedProfiles.length,
        profiles: enrichedProfiles
      }
    }

  } catch (error) {
    return {
      success: false,
      error: "Failed to enrich LinkedIn profiles"
    }
  }
} 