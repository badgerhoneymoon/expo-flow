export const getStructuredOutputPrompt = (currentDate: string) => `
Extract and structure the provided information as completely as possible according to the rules and schema below. Your goal is to capture every explicit detail without fabricating any data. If any information is ambiguous, conflicting, or not explicitly provided for its primary field, leave that field empty. However, if you detect potentially valuable data that cannot be confidently assigned to a specific field, record it in the "notes" field in a structured manner prefixed with "Ambiguous:" followed by the original text. DO NOT assume, guess, or infer data.

────────────────────────────────────────────
GENERAL DIRECTIVES:
- Explicit Data Only: Capture only the data explicitly provided in the input.
- Cross-Reference & Validation:  
  - Validate each piece of information by checking multiple sources (plain text, email, LinkedIn, website).  
  - If multiple values exist (e.g., two emails or phone numbers) and no clear label or frequency advantage is present, leave the primary field empty. Optionally, record the conflicting values in "notes" as "Ambiguous:" entries.
- Separation of Concerns:  
  - Do not merge data across fields. Actionable follow-ups must not be placed in notes.  
  - Personal and company contact details must remain distinct.
- Error Correction: Correct common OCR errors and typos (e.g., "gmial.com" → "gmail.com", "htp://" → "http://").
- Phone numbers must include a country code, contain only numeric characters (except the + sign), and conform to standard or regionally acceptable formats.
- Date Conversion:  
  - All dates must be in YYYY-MM-DD format.  
  - Convert any relative or natural language dates (e.g., "next Monday", "in 10 days", "early next month", "mid-Q2", "end of fiscal year") to an absolute date using currentDate as the reference.  
  - If the exact date cannot be determined, leave the field empty and record the original phrase in "notes" as "Ambiguous:".
- Exact Phrasing: Use the exact wording from the source for direct quotes; do not paraphrase.
- Schema Enforcement:  
  - The final output must strictly conform to the expected JSON schema (exact field names and data types) with no additional keys or stray text.
- Referrals Array: Always include the referrals array in the output, even if empty.
- Optional Debug Log: (For internal use only) Optionally record any detected ambiguities or conflicts internally; do not include these logs in the final output.

────────────────────────────────────────────
0. NAME VALIDATION PRIORITY:
- Sources: Extract names from plain text, email addresses, LinkedIn URLs, and website URLs.
- Frequency & Context: Use frequency analysis and contextual clues to choose the most common, correctly spelled version.
- Tie-Breaking: If multiple spellings exist, choose the version that:
  1. Appears most frequently,
  2. Fits the business context,
  3. Matches common name patterns.
- Uniformity: Apply the validated spelling uniformly.
- Examples:  
  - If "John Smith" and "Jon Smith" appear, choose "John Smith" if it is more frequent and contextually appropriate.  
  - For "Dr. Juan Carlos de la Vega", remove the title so that firstName is "Juan Carlos" and lastName is "de la Vega".  
  - For diverse names, e.g., "Dr. María del Carmen Sánchez López" should yield firstName: "María del Carmen" and lastName: "Sánchez López"; "Anne-Marie O'Neil" retains the hyphen and apostrophe.

────────────────────────────────────────────
1. BASIC INFORMATION:
- First Name & Last Name (REQUIRED):
  * Extract the full name and split it into firstName and lastName.
  * Remove any titles (e.g., Mr., Ms., Dr.) and honorifics.
  * Use common naming conventions to split the name intelligently.
  * For single-word names:
    - If clearly a first name (e.g., "Alice"), set firstName to the word and lastName to "N/A".
    - If ambiguous (e.g., "Madonna"), set firstName to "N/A" and lastName to the word.
  * If no name is found, set both fields to "N/A".
  * Examples:  
    - "Dr. Emily" → firstName: "Emily", lastName: "N/A".  
    - "Juan Carlos de la Vega" → firstName: "Juan Carlos", lastName: "de la Vega".  
    - "Madonna" → firstName: "N/A", lastName: "Madonna".
- Job Title:
  * Extract complete, coherent job titles.
  * Merge multi-line entries into a single title.
  * Example: "Senior\nSoftware Engineer" becomes "Senior Software Engineer".
- Company:
  * Extract the company name.
  * Do not confuse personal website names with company names.
  * Exclude legal suffixes (e.g., LLC, Inc.) unless they are officially part of the name.
  * If multiple companies are mentioned, select the one with the highest contextual relevance.
  * Example: Between "Acme Corp" and "Acme Personal", choose "Acme Corp".
- Website:
  * Extract website URLs from any of these sources in order of priority:
    1. Explicit website on card (e.g., "company.com", "www.company.com")
    2. Company domain from company email (e.g., "john@acme.com" → "acme.com")
    3. Company domain from personal email if it matches company name
  * For extracted URLs:
    - Remove any protocol if present (http://, https://)
    - Remove any trailing slashes or paths
    - Keep "www." if present, but don't add it if missing
  * For email-derived domains:
    - Extract the domain after @ in company or personal email
    - Remove any subdomains except "www" (e.g., "sales.company.co.uk" → "company.co.uk")
    - Skip if domain is a common email provider (gmail.com, yahoo.com, etc.)
  * If multiple valid websites are found:
    - Prefer the one that best matches the company name
    - If unclear, leave empty and add both to notes as "Ambiguous:"
- Contact Date:
  * Format as YYYY-MM-DD.
  * Convert relative expressions (e.g., "in 2 weeks", "next Monday", "mid-Q2", "end of fiscal year") to an absolute date using currentDate.
  * Example: "December 20th" becomes "${currentDate.split('-')[0]}-12-20".
  * Use the current year unless another year is explicitly provided.
  * If the date conversion is ambiguous, then record the original phrase in "notes" as ambiguous.
  * If a contact date is mentioned for any referral, it should also be set as the contact date for the main lead.

────────────────────────────────────────────
2. CONTACT INFORMATION:
- Personal Email:
  * Classify email addresses in this order:
    1. Personal email providers (gmail.com, yahoo.com, outlook.com, etc.)
    2. Individual work emails that contain the person's name:
       - First name (john@company.com)
       - Last name (smith@company.com)
       - Full name (john.smith@company.com)
       - Initials (js@company.com)
    3. Role-based emails that match the person's job title:
       - cto@company.com for Chief Technology Officer
       - head.sales@company.com for Head of Sales
       - Abbreviated forms of their position:
         * ops.manager@company.com → Operational Manager
         * om@company.com → Operational Manager
         * dev.lead@company.com → Development Lead
         * pm@company.com → Project Manager/Product Manager (note ambiguity in notes)
  * If multiple personal emails found, prefer work email over personal provider
  * If no clear personal email found, set to "N/A"

- Company Email:
  * Classify email addresses as company email if they are:
    1. Generic company addresses:
       - info@company.com
       - contact@company.com
       - sales@company.com
       - support@company.com
       - hello@company.com
    2. Department emails not matching the person's role:
       - marketing@company.com
       - hr@company.com
       - etc.

  * If no company email or website, set to "N/A"

- If an email could be classified as both personal and company:
  * Prioritize personal if it contains the person's name
  * Use as company email if it's purely role-based
  * If still ambiguous, put in personal and note the ambiguity

- Personal Phone:
  * Extract mobile or cell numbers clearly labeled as personal.
  * Format with a country code (e.g., +1-555-555-5555) and remove all non-numeric characters except the +.
  * If multiple personal phone numbers exist without clear preference, leave the field empty.
- Company Phone:
  * Extract phone numbers labeled as office or company numbers.
  * Format with a country code and remove extraneous characters.
  * If multiple values exist with no clear preference, leave the field empty.
- LinkedIn:
  * Extract URLs starting with "linkedin.com/in/".
  * Validate that the profile corresponds to the validated name when possible.  

────────────────────────────────────────────
3. BUSINESS CONTEXT:
- Main Interest:
  * Capture explicit and implied business interests, focus areas, or challenges.
  * Record topics the individual is enthusiastic about using the exact phrasing.
  * Example: "Interested in AI solutions" should be captured verbatim.
- Next Steps:
  * Include only clear, actionable follow-up instructions.
  * Convert any natural language date references (e.g., "next Friday", "in 10 days", "early next quarter") to an absolute date (YYYY-MM-DD) using currentDate.
  * Do NOT include vague or speculative suggestions.
  * If no explicit action is provided, leave this field empty.
  * Example: "Schedule demo next Friday" becomes "Schedule demo - 2024-XX-XX" (with the exact date computed).
- Notes:
  * Include factual context, observations, and background details.
  * Do NOT include actionable follow-up instructions or direct date references.
  * Structured Ambiguous Data: For any potentially valuable but non-explicit information, record it in "notes" with the prefix "Ambiguous:" followed by the original text.
  * Example: If the input says "Maybe follow up when things settle," add a note: "Ambiguous: 'Maybe follow up when things settle'".

────────────────────────────────────────────
4. REFERRAL HANDLING:
- Always include a referrals array in the output, even if empty.
- For each explicitly mentioned referral, output an object with:
  * firstName & lastName (REQUIRED):
    - Apply the same extraction and validation rules as for the main lead.
    - For partial names, assign "N/A" to the missing component.
  * Position: Include if provided.
  * Contact Date: 
    - Must be in YYYY-MM-DD format.
    - Convert any relative or natural language timing (e.g., "next week", "after vacation") to an absolute date using currentDate.
    - If the date cannot be determined precisely, then record the original phrase in "notes" as ambiguous.
    - When a contact date is set for a referral, ensure it is also set as the contact date for the main lead.
  * Notes: Include any additional context regarding the referral.
- Examples:  
  - For "Sarah will be back from vacation on January 15th":  
    {
      "firstName": "Sarah",
      "lastName": "N/A",
      "contactDate": "2024-01-15"
    }
  - For "Better reach out to Mike Smith next week":  
    {
      "firstName": "Mike",
      "lastName": "Smith",
      "contactDate": "2024-XX-XX" // Exact date computed from "next week"
    }
- Do not combine referral details from different parts; include only those explicitly mentioned.

────────────────────────────────────────────
FINAL REMINDERS & VALIDATION:
- Today's date is ${currentDate}.
- Self-Reference Handling:
  * Do not create a referral entry when the speaker is referring to themselves or the main lead.
  * Match the main lead's name in the voice notes to the name on the business card, even if transcribed differently.
  * Example: If the voice note contains "John Smith will follow up", and John Smith is the main lead, do not create a referral.
- If any field is ambiguous, conflicting, or not explicitly provided, leave it in Notes as ambiguous.
- Actionable follow-ups must appear only in nextSteps, with their associated dates in contactDate; they must not appear in notes.
- All dates must be in absolute YYYY-MM-DD format.
- Personal and company contact details must remain distinct.
- Use exact phrases when available; do not fabricate or infer data.
- Cross-check all extracted information; if multiple valid data points exist for the same field with no clear tie-breaker, leave that field empty.
- Validate that the final output strictly conforms to the expected JSON schema (with correct field names and types) and contains no extra keys or stray text.
- (Optional for debugging) Record any ambiguities or conflicts internally, but do not include them in the final output.
`;