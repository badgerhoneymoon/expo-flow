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
- URL & Phone Number Validation:  
  - URLs must begin with "http://" or "https://" and include a valid domain extension (e.g., .com, .org).  
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
  * Ensure the URL is complete with the proper protocol ("http://" or "https://").
  * Verify that it contains a valid domain extension.
  * Correct any OCR errors (e.g., "htp://" → "http://").

────────────────────────────────────────────
2. CONTACT INFORMATION:
- Personal Email:
  * Extract email addresses that are clearly intended as personal.
  * Validate the format, convert to lowercase, and correct common typos.
- Company Email:
  * Extract email addresses that match the company domain.
  * If a company website is provided, ensure the email corresponds to that domain.
  * Validate the format and correct errors.
  * Tie-Breaker: If multiple company emails exist without clear labeling, leave the field empty.
  * Example: Between "john@acme.com" and "john@gmail.com", choose "john@acme.com" if the website is acme.com.
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
4. FOLLOW-UP INFORMATION:
- Contact Timing:
  * Extract the exact phrasing for follow-up timing.
  * Convert relative expressions (e.g., "in 2 weeks", "next Monday", "mid-Q2", "end of fiscal year") to an absolute date (YYYY-MM-DD) using currentDate.
  * If the timing is too ambiguous (e.g., "after maternity leave", "early next month") and cannot be precisely determined, leave the field empty and optionally record the original phrase in "notes" as ambiguous.
- Contact Date:
  * Include only if an exact date is explicitly provided.
  * Format as YYYY-MM-DD.
  * Example: "December 20th" becomes "${currentDate.split('-')[0]}-12-20".
  * Use the current year unless another year is explicitly provided.
  * If the date conversion is ambiguous, leave the field empty and optionally record the original phrase in "notes" as ambiguous.

────────────────────────────────────────────
5. REFERRAL HANDLING:
- Always include a referrals array in the output, even if empty.
- For each explicitly mentioned referral, output an object with:
  * firstName & lastName (REQUIRED):
    - Apply the same extraction and validation rules as for the main lead.
    - For partial names, assign "N/A" to the missing component.
  * Position: Include if provided.
  * Contact Timing: Convert any natural language timing to an absolute date (YYYY-MM-DD) using currentDate, if possible.
  * Contact Date: Must be in YYYY-MM-DD format if an exact date is provided.
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
      "contactTiming": "2024-XX-XX" // Exact date computed from "next week"
    }
- Do not combine referral details from different parts; include only those explicitly mentioned.

────────────────────────────────────────────
FINAL REMINDERS & VALIDATION:
- Today's date is ${currentDate}.
- If any field is ambiguous, conflicting, or not explicitly provided, leave it empty.
- Actionable follow-ups must appear only in nextSteps, contactTiming, or contactDate; they must not appear in notes.
- All dates must be in absolute YYYY-MM-DD format.
- Personal and company contact details must remain distinct.
- Use exact phrases when available; do not fabricate or infer data.
- Cross-check all extracted information; if multiple valid data points exist for the same field with no clear tie-breaker, leave that field empty.
- Validate that the final output strictly conforms to the expected JSON schema (with correct field names and types) and contains no extra keys or stray text.
- (Optional for debugging) Record any ambiguities or conflicts internally, but do not include them in the final output.
`;