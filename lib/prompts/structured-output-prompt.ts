export const getStructuredOutputPrompt = (currentDate: string) => `
Extract and structure information with these rules:

IMPORTANT: If any information is unclear, ambiguous, or not explicitly mentioned - leave it empty. DO NOT make assumptions or guess.

0. Name Validation Priority:
   - Cross-reference all name instances and use frequency analysis
   - Look for the name in multiple formats:
     * Plain text mentions
     * Email address
     * LinkedIn URL
     * Website URL
   - If spellings differ, prefer the version that:
     1. Appears most frequently across all sources
     2. Makes most sense in business context
     3. Follows common name patterns
   - Use this validated name spelling for all fields

1. Basic Information:
   - First Name & Last Name: 
     * Split into separate fields
     * Don't include titles or honorifics
     * Must be clearly stated
   - Job Title:
     * Look for complete, sensible job titles
     * Combine multiple lines if they form a complete title
   - Company:
     * Don't mistake personal websites for company names
     * Don't include legal entities (LLC, Inc) unless part of official name
     * If multiple companies mentioned, use most relevant

2. Contact Information:
   - Email:
     * Verify valid email format
     * Fix common domain misspellings
     * Cross-reference company name for domain validation
   - LinkedIn:
     * Must start with "linkedin.com/in/"
     * Apply validated name spelling
   - Website:
     * Must include domain extension (.com, .org, etc.)
     * Fix any OCR errors based on cross-reference

3. Business Context:
   - Main Interest:
     * Only capture explicitly stated interests/focus areas
     * Must be clearly mentioned, not implied
   - Next Steps:
     * Only include clearly stated action items
     * Must have specific, mentioned actions
   - Notes:
     * Only include clearly stated, factual information
     * No interpretations or assumptions

4. Qualification Assessment:
   - Is Target:
     * YES: Clearly matches target profile
     * NO: Clearly doesn't match target profile
     * UNKNOWN: Not enough information to determine
   - ICP Fit:
     * YES: Strong match with ideal customer profile
     * NO: Definitely not a match
     * UNKNOWN: Insufficient information
   - Qualification Reason:
     * Document specific reasons for the assessment
     * Include key factors that led to the decision

5. Follow-up Information:
   - Contact Timing:
     * Capture exact timing phrase as mentioned
     * Examples: "reach out next week", "after maternity leave"
   - Contact Date:
     * ONLY if exact date mentioned, format as YYYY-MM-DD
     * Example: "December 20th" -> "${currentDate.split('-')[0]}-12-20"
     * Use current year unless next year explicitly stated

5. Referral Handling:
   - Set referral to true if someone else is mentioned to contact
   - When referral is true, capture in referralData:
     * First Name & Last Name of the person to contact
     * Position (job title) if mentioned
     * Contact Timing (when to reach out)
     * Contact Date (specific date if mentioned)
   
   Example timing for referred people:
   - "Sarah will be back from vacation on January 15th" -> referralData.contactDate: "2024-01-15"
   - "Better reach out to Mike next week" -> referralData.contactTiming: "next week"
   
   Important:
   - Set referral to true whenever another person to contact is mentioned
   - The referral flag here indicates "contains referral data"
   - Only capture information about who to contact next
   - Only include timing that relates to when to contact the referred person

Remember:
- Today's date is ${currentDate}
- Better to leave fields empty than guess
- Only include explicitly stated information
- Use exact phrases where possible
- Cross-validate information across all mentions
- Fix common OCR errors and misspellings
- Only create referral data when someone else is explicitly mentioned as a contact
- Inherit company context from the main lead
- Keep referral data minimal and focused
- Use exact phrases for timing and positions
- Format dates as YYYY-MM-DD
- Don't guess or assume information about the referral` 