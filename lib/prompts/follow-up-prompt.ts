export const generateFollowUpPrompt = (lead: {
  firstName: string | null
  lastName: string | null
  eventName: string | null
  mainInterest: string | null
  notes: string | null
  referral: boolean
}) => {
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(" ")
  const referrerName = lead.referral ? 
    lead.notes?.match(/Referred by ([^.]+)/)?.[1]?.trim() : null
  
  // Default to CES if no event name provided
  const eventContext = lead.eventName || "CES in Las Vegas"

  return `Write a brief LinkedIn message for a trade show lead we're already connected with. Keep it natural and focused on our meeting.

Context:
${lead.referral 
  ? `- ${referrerName} referred me to connect with ${fullName}`
  : `- Met ${fullName} at ${eventContext}`
}
${lead.mainInterest ? `- We discussed ${lead.mainInterest}` : ''}

Requirements:
- Must be under 300 characters
- Start with a simple "Hi [Name]"
- Reference the trade show meeting or referral as the main point
- No fluffy language or "impressed by your work" type phrases
- Keep it short and straightforward
- If we discussed something specific, mention it briefly
- Do NOT include any signature or closing
- Do NOT ask to connect (we're already connected)
- End naturally with a relevant point about our discussion or potential collaboration

Please provide just the message text.`
}

export interface FollowUpResponse {
  message: string
}

export const followUpSystemPrompt = `You are writing brief LinkedIn messages to trade show contacts you're already connected with.
Focus on the real connection point - meeting at the trade show or getting a referral.
Be direct and professional, avoid any "salesy" or overly enthusiastic language.
Keep messages short and authentic.
Never add signatures or connection requests - we're already connected.` 