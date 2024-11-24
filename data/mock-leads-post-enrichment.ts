export interface PostEnrichmentLead {
  id: number
  leadType: string
  fullName: string
  company: string
  companyInfo: string
  position: string
  email: string
  linkedIn: string | null
  companyWebsite: string | null
  extractedVoiceMemo: string | null
  gistOfMemo: string | null
  icpFit: 'Yes' | 'No'
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
    companyInfo: "Commercial real estate firm managing 15 Class A office buildings across major metropolitan areas with 2500+ parking spaces",
    position: "Facility Manager",
    email: "emily.johnson@techinnovators.com",
    linkedIn: "http://linkedin.com/in/emilyjohnson",
    companyWebsite: "http://www.techinnovators.com",
    extractedVoiceMemo: null,
    gistOfMemo: null,
    icpFit: "Yes",
    icpScore: "High",
    because: "Large commercial real estate portfolio with multiple locations and significant parking capacity",
    targetForOutreach: true,
    followUpDate: "2024-12-10",
    customizedFollowUp: "Hi Emily, it was great meeting you at CES 2025. Given Tech Innovators' extensive property portfolio, I'd love to discuss our enterprise EV charging solutions for your office buildings.",
    enrichmentNeeded: null
  },
  {
    id: 4,
    leadType: "New Lead",
    fullName: "Jane Doe",
    company: "Green Solutions",
    companyInfo: "Luxury eco-hotel chain with 12 properties and 1800+ parking spaces, focused on sustainable hospitality initiatives",
    position: "Sustainability Manager",
    email: "jane.doe@greensolutions.com",
    linkedIn: "http://linkedin.com/in/janedoe",
    companyWebsite: "http://www.greensolutions.com",
    extractedVoiceMemo: null,
    gistOfMemo: null,
    icpFit: "Yes",
    icpScore: "High",
    because: "Perfect ICP match: hotel chain with multiple locations, sustainability focus, and significant parking capacity",
    targetForOutreach: true,
    followUpDate: "2024-12-20",
    customizedFollowUp: "Hi Jane, Michael Smith recommended I reach out regarding EV charging solutions for Green Solutions' hotel properties. Would love to discuss how we can support your sustainability initiatives.",
    enrichmentNeeded: null
  }
] 