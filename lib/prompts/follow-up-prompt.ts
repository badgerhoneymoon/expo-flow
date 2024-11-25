export const generateFollowUpPrompt = (lead: {
  // Basic info
  firstName: string | null
  lastName: string | null
  jobTitle: string | null
  company: string | null
  
  // Context
  mainInterest: string | null
  notes: string | null
  eventName: string | null
  referral: boolean
}) => {
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(" ")
  
  // Get referrer name from notes if it's a referral
  const referrerName = lead.referral ? 
    lead.notes?.match(/Referred by ([^.]+)/)?.[1]?.trim() : null

  const interactionContext = [
    lead.eventName && `met at ${lead.eventName}`,
    lead.mainInterest && `discussed ${lead.mainInterest}`,
  ].filter(Boolean).join(", ")

  return `Please write a concise LinkedIn connection request/follow-up message with the following context:

RECIPIENT:
- Name: ${fullName}
- Position: ${lead.jobTitle || "Unknown position"}
- Company: ${lead.company || "Unknown company"}

${lead.referral ? 
  `REFERRAL:
Referred by: ${referrerName || "someone from your team"}` 
  : 
  `CONTEXT:
${interactionContext || "No specific interaction details available"}`
}

Requirements:
1. Keep it under 300 characters (LinkedIn limit)
2. Be professional yet personable
3. ${lead.referral ? 
     `Mention that ${referrerName || "your colleague"} recommended connecting` : 
     "Reference our meeting/interaction briefly"}
4. Include a clear reason for connecting
5. No generic messages

Please provide the connection message in plain text format.`
}

export interface FollowUpResponse {
  message: string
}

export const followUpSystemPrompt = `You are an expert B2B networker with excellent LinkedIn communication skills.
Your task is to write personalized, concise LinkedIn connection requests and follow-up messages.
Focus on building genuine professional connections.
Always be brief (under 300 characters), authentic, and value-focused.
Never be generic or overly formal.
Format your response as a JSON object with a 'message' field.` 