"use server"

import { BusinessCardSchema, BusinessCardData, BusinessCardExtractResponse } from '@/types/business-card-types';
import { StructuredOutputService } from '@/lib/services/structured-output-service';

const BUSINESS_CARD_PROMPT = `Extract business card information with these rules:
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
     - Check for common OCR character confusions:
       * 'l' vs 'i'
       * 't' vs 'l'
       * 'rn' vs 'm'
       * 'e' vs 'c'
       * 'n' vs 'h'
     - When a name appears differently, compare character by character
       Example: "Michael" vs "Michaet" - 'l' is more likely than 't' in names
     - Use this validated name spelling for all fields

  1. Name: 
     - Extract first name and last name separately
     - Don't include titles or honorifics

  2. Job Title: 
     - Look for complete, sensible job titles
     - Combine multiple lines if they form a complete title
     - If title is ambiguous or unclear, leave it empty

  3. Company: 
     - Don't mistake personal websites for company names
     - Look for actual company names
     - If no clear company, leave empty

  4. Email: 
     - Verify it's a valid email format
     - Apply validated name spelling from rule 0
     - Fix common domain misspellings:
       Examples: 'selutions' -> 'solutions', 'technolgies' -> 'technologies'
     - Cross-reference company name to validate/correct domain part
     - For ambiguous cases, prefer the most common spelling in business context

  5. LinkedIn: 
     - Must start with "linkedin.com/in/"
     - Apply validated name spelling from rule 0
     - Fix common OCR errors

  6. Website:
     - Apply validated name spelling from rule 0
     - Must include domain extension (.com, .org, etc.)
     - Fix any OCR errors based on cross-reference`;

export async function extractBusinessCard(text: string): Promise<BusinessCardExtractResponse> {
  try {
    console.log('Tesseract Raw Output:', text);
    return await StructuredOutputService.structureText<BusinessCardData>(
      text,
      BusinessCardSchema,
      BUSINESS_CARD_PROMPT
    );
  } catch (error) {
    console.error('Error extracting business card:', error);
    return {
      success: false,
      error: 'Failed to extract business card data'
    };
  }
} 