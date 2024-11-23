export interface FirstIterationLead {
  id: number
  leadType: string
  fullName: string
  company: string
  position: string
  email: string
  linkedIn: string | null
  companyWebsite: string | null
  extractedVoiceMemo: string | null
  gistOfMemo: string | null
  icpFit: 'Unknown' | 'Yes' | 'No'
  icpScore: string | null
  because: string
  targetForOutreach: boolean
  followUpDate: string | null
  customizedFollowUp: string | null
  enrichmentNeeded: string | null
}

export const mockLeadsFirstIteration: FirstIterationLead[] = [
  {
    id: 1,
    leadType: "Only Business Card Photo",
    fullName: "Emily Johnson",
    company: "Tech Innovators",
    position: "Senior Sales Manager",
    email: "emily.johnson@techinnovators.com",
    linkedIn: null,
    companyWebsite: null,
    extractedVoiceMemo: null,
    gistOfMemo: null,
    icpFit: "Unknown",
    icpScore: null,
    because: "Requires company website and LinkedIn to determine ICP fit",
    targetForOutreach: true,
    followUpDate: null,
    customizedFollowUp: null,
    enrichmentNeeded: "Company Website, LinkedIn"
  },
  {
    id: 2,
    leadType: "Business Card + Voice Memo",
    fullName: "Michael Smith",
    company: "Green Solutions",
    position: "Business Development Lead",
    email: "michael.smith@greensolutions.com",
    linkedIn: null,
    companyWebsite: "www.greensolutions.com",
    extractedVoiceMemo: "Hi, this is [Client's Name] from [Client's Company]. I just had a great conversation with Michael Smith from Green Solutions at CES 2025. He expressed strong interest in our sustainability-focused EV charging solutions and mentioned that I should connect with Jane Doe, the Sustainability Manager, once she returns from her maternity leave. We should plan to reach out to her around December 20th to explore potential collaboration opportunities.",
    gistOfMemo: JSON.stringify({
      event: "CES 2025",
      mainInterest: "Strong interest in sustainability-focused EV charging solutions",
      referral: {
        name: "Jane Doe",
        position: "Sustainability Manager",
        availability: "After maternity leave",
        suggestedContactDate: "2024-12-20"
      },
      nextSteps: "Reach out to Jane Doe to explore collaboration opportunities"
    }),
    icpFit: "Yes",
    icpScore: "Medium",
    because: "Company website shows interest in EV sustainability projects",
    targetForOutreach: false,
    followUpDate: null,
    customizedFollowUp: null,
    enrichmentNeeded: "Find Jane Doe's contact information (LinkedIn, email)"
  },
  {
    id: 3,
    leadType: "Unorganized Text Notes",
    fullName: "Sarah Williams",
    company: "Future Ventures",
    position: "Marketing Associate",
    email: "sarah.williams@futureventures.com",
    linkedIn: null,
    companyWebsite: null,
    extractedVoiceMemo: null,
    gistOfMemo: null,
    icpFit: "No",
    icpScore: null,
    because: "Disqualified based on current needs alignment",
    targetForOutreach: false,
    followUpDate: null,
    customizedFollowUp: null,
    enrichmentNeeded: null
  }
] 