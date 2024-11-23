"use server"

import { BusinessCardSchema, BusinessCardExtractResponse } from '@/types/business-card-types';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function extractBusinessCard(text: string): Promise<BusinessCardExtractResponse> {
  try {
    console.log('Tesseract Raw Output:', text);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Extract business card information with these rules:

1. Full Name: Extract just the person's last and first name
2. Job Title: Extract the complete title without any skills/technologies
3. Company: 
   - Don't mistake personal websites for company names
   - Look for actual company names (like Microsoft)
   - If no clear company, leave empty
4. Email: Verify it's a valid email format
5. LinkedIn: 
   - Must start with "linkedin.com/in/"
   - Fix common OCR errors (like 'v' instead of '/')
   - Ensure proper formatting

Clean up any OCR artifacts like brackets, random characters, or formatting symbols.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: zodResponseFormat(BusinessCardSchema, "businessCard")
    });

    const parsedData = completion.choices[0].message.parsed;
    
    if (!parsedData) {
      return {
        success: false,
        error: 'No data was parsed from the business card'
      };
    }

    return {
      success: true,
      data: {
        ...parsedData,
        rawText: text
      }
    };

  } catch (error) {
    console.error('Error extracting business card:', error);
    return {
      success: false,
      error: 'Failed to extract business card data'
    };
  }
} 