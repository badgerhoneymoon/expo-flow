"use server"

import { createWorker } from 'tesseract.js';
import { BusinessCardSchema, BusinessCardExtractResponse } from '@/types/business-card-types';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function extractBusinessCard(imageBase64: string): Promise<BusinessCardExtractResponse> {
  try {
    // 1. OCR with Tesseract
    const worker = await createWorker('eng');
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();

    // Log raw Tesseract output for testing
    console.log('Tesseract Raw Output:', text);

    // Comment out GPT processing for testing
    /*
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Extract only these fields from the business card text: full name, job title, company name, email address, and LinkedIn URL if present."
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
    */

    // For testing, just return the raw text
    return {
      success: true,
      data: {
        fullName: "Test",  // Added to satisfy TypeScript
        rawText: text      // Added this to see full output
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