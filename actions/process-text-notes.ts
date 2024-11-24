"use server"

import { TextNotesSchema, TextNotesData } from '@/types/text-notes-types';
import { StructuredOutputService } from "@/lib/services/structured-output-service";

const TEXT_NOTES_PROMPT = `Extract and structure information from text notes with these rules:

1. Name:
   - Split into firstName and lastName if both are present
   - Don't include titles or honorifics
   - Leave empty if unclear or not mentioned

2. Job Title:
   - Extract exact job title if mentioned
   - Leave empty if not clearly stated

3. Company:
   - Extract company name if mentioned
   - Don't include legal entities (LLC, Inc) unless part of official name
   - Leave empty if not mentioned

4. Qualification:
   - Use "yes" or "no" if qualification can be determined
   - Base this on:
     * Budget mentions
     * Company size/scale
     * Decision making authority
     * Project scope
   - Leave empty if insufficient information

5. Reason:
   - Explain qualification decision if made
   - Be specific about why qualified or not qualified
   - Leave empty if qualification is unclear

Remember:
- All fields are optional
- Only include information that is explicitly stated
- Don't make assumptions
- Use exact text from notes where possible
- Better to leave a field empty than to guess`;

export async function processTextNotes(text: string) {
  try {
    return await StructuredOutputService.structureText<TextNotesData>(
      text,
      TextNotesSchema,
      TEXT_NOTES_PROMPT
    );
  } catch (error) {
    console.error('Error processing text notes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process text notes'
    };
  }
} 