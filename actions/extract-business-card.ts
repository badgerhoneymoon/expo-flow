"use server"

import { BusinessCardSchema, BusinessCardExtractResponse } from '@/types/business-card-types';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Extracts structured business card information from raw OCR text using GPT-4
 * 
 * @param text - Raw OCR text from the business card image
 * @returns Promise containing either the parsed business card data or an error response
 */
export async function extractBusinessCard(text: string): Promise<BusinessCardExtractResponse> {
  try {
    // Log raw OCR output for debugging
    console.log('Tesseract Raw Output:', text);

    // Use OpenAI's beta chat completion with Zod schema validation
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          // Detailed prompt instructing GPT how to extract and format business card fields
          // Includes specific rules for handling common OCR issues and field validation
          content: `Extract business card information with these rules:

1. Name: 
   - Extract first name and last name separately
   - First cross-reference all mentions of the name in different contexts (email, website, social media)
   - Use the most consistent spelling across all mentions
   - Example: If "Michael Kappel" appears as "@MichaelKappel" and "facebook.com/MikeKappel":
     * firstName: "Michael" (or "Mike" if that seems to be preferred)
     * lastName: "Kappel"
   - Don't include titles, certifications, or honorifics

2. Job Title: 
   - Look for complete, sensible job titles
   - Combine multiple lines if they form a complete title
   - If title is ambiguous or unclear, leave it empty
   - Examples of good titles: "Software Systems Design Engineer", "Senior Developer"
   - Examples of incomplete/bad titles: "Software Systems" (too vague), "Systems" (too generic)

3. Company: 
   - Don't mistake personal websites for company names
   - Look for actual company names
   - If no clear company, leave empty

4. Email: 
   - Verify it's a valid email format
   - Cross-check the name part with the determined correct name spelling

5. LinkedIn: 
   - Must start with "linkedin.com/in/"
   - Fix common OCR errors (like 'v' instead of '/')
   - Use the determined correct name spelling

6. Website:
   - Cross-check with the determined correct name spelling
   - Must include domain extension (.com, .org, etc.)
   - Fix any OCR errors based on the correct name spelling
   - Example: If name is "Kappel", then "Kappei.com" is likely an OCR error

Clean up any OCR artifacts like brackets, random characters, or formatting symbols.`
        },
        {
          role: "user",
          content: text
        }
      ],
      // Use Zod schema to validate and type the response
      response_format: zodResponseFormat(BusinessCardSchema, "businessCard")
    });

    // Extract the parsed data from GPT's response
    const parsedData = completion.choices[0].message.parsed;
    
    // Return error if no data was parsed
    if (!parsedData) {
      return {
        success: false,
        error: 'No data was parsed from the business card'
      };
    }

    // Return successful response with parsed data and original raw text
    return {
      success: true,
      data: {
        ...parsedData,
        rawText: text
      }
    };

  } catch (error) {
    // Log and return any errors that occur during extraction
    console.error('Error extracting business card:', error);
    return {
      success: false,
      error: 'Failed to extract business card data'
    };
  }
} 