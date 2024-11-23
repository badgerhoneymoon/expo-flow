export interface PostEnrichmentLead {
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
  icpFit: 'Yes' | 'No'  // Note: No more 'Unknown' in post-enrichment
  icpScore: 'High' | 'Medium' | 'Low' | null
  because: string
  targetForOutreach: boolean
  followUpDate: string | null
  customizedFollowUp: string | null
  enrichmentNeeded: string | null
}

export const mockLeadsPostEnrichment: PostEnrichmentLead[] = [
  {
    id: 1,
    leadType: "Only Business Card Photo",
    fullName: "Emily Johnson",
    company: "Tech Innovators",
    position: "Senior Sales Manager",
    email: "emily.johnson@techinnovators.com",
    linkedIn: "http://linkedin.com/in/emilyjohnson",
    companyWebsite: "http://www.techinnovators.com",
    extractedVoiceMemo: null,
    gistOfMemo: null,
    icpFit: "Yes",
    icpScore: "High",
    because: "Fits our target market based on senior sales role and company alignment.",
    targetForOutreach: true,
    followUpDate: "2024-12-10",
    customizedFollowUp: "Hi Emily, it was great meeting you at CES 2025. I'd love to discuss how our EV charging solutions can complement Tech Innovators' offerings.",
    enrichmentNeeded: null
  },
  {
    id: 4,
    leadType: "New Lead",
    fullName: "Jane Doe",
    company: "Green Solutions",
    position: "Sustainability Manager",
    email: "jane.doe@greensolutions.com",
    linkedIn: "http://linkedin.com/in/janedoe",
    companyWebsite: "http://www.greensolutions.com",
    extractedVoiceMemo: null,
    gistOfMemo: null,
    icpFit: "Yes",
    icpScore: "High",
    because: "Direct decision-maker in sustainability projects.",
    targetForOutreach: true,
    followUpDate: "2024-12-20",
    customizedFollowUp: "Hi Jane, I hope you're well. Michael Smith recommended I reach out to discuss how our EV charging solutions can support Green Solutions' sustainability initiatives. Are you available for a meeting next week?",
    enrichmentNeeded: null
  }
] 