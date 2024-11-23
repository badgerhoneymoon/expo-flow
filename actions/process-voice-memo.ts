"use server"

import { VoiceMemoSchema, VoiceMemoData } from '@/types/voice-memo-types';
import { WhisperService } from "@/lib/services/whisper-service";
import { StructuredOutputService } from "@/lib/services/structured-output-service";

const currentDate = new Date().toISOString().split('T')[0]; // Gets current date in YYYY-MM-DD format

const VOICE_MEMO_PROMPT = `Today's date is ${currentDate}. Extract and structure information from the voice memo with these rules:

IMPORTANT: If any information is unclear, ambiguous, or not explicitly mentioned - leave it empty. DO NOT make assumptions or guess.

1. Main Interest:
   - Only capture explicitly stated business interests or focus areas
   - Must be clearly mentioned, not implied
   - If unclear or ambiguous, leave empty

2. Company:
   - Only include if company name is explicitly mentioned
   - Do not include legal entities (LLC, Inc, etc) unless they're part of the official name
   - If multiple companies are mentioned, use the most relevant one
   - If unclear or not mentioned, leave empty

3. Referral Information:
   - Name: 
     * Split into firstName and lastName
     * Only if both parts are clearly stated
     * Example: "Jane Doe" -> firstName: "Jane", lastName: "Doe"
     * If only one name is mentioned, leave both fields empty
     * Don't include titles or honorifics
   - Position: Only if explicitly mentioned
   - Contact Timing: 
     * Capture the exact timing phrase as mentioned
     * Examples: "reach out next week", "after maternity leave", "in December"
     * Include any context about timing or availability
   - Contact Date:
     * ONLY if an exact date is mentioned, format as YYYY-MM-DD
     * Example: "December 20th" -> "${new Date().getFullYear()}-12-20"
     * For dates in the future, use the current year unless next year is explicitly stated
     * For past dates, use the mentioned year or current year based on context
     * If no exact date is mentioned, leave empty
   - Leave any field empty if not explicitly stated

4. Event:
   - Only include if an event or meeting is specifically named
   - Must be explicitly mentioned (e.g., "at CES 2025")
   - If no event is mentioned, leave empty

5. Next Steps:
   - Only include clearly stated action items
   - Must have specific, mentioned actions
   - If actions are vague or implied, leave empty

6. Additional Notes:
   - Only include clearly stated, factual information
   - Do not include interpretations or assumptions
   - If information is ambiguous, leave it out

Remember: 
- It's better to leave a field empty than to make assumptions
- Names must be clearly split into first and last name
- Contact Date must be in YYYY-MM-DD format or left empty
- Contact Timing should capture the raw timing phrase exactly as mentioned
- Use current year (${new Date().getFullYear()}) for dates unless explicitly stated otherwise`;

export async function processVoiceMemo(audioData: FormData) {
  try {
    const audioFile = audioData.get('file') as File;
    if (!audioFile) {
      return {
        success: false,
        error: "No audio file provided"
      };
    }

    const { success, text, error } = await WhisperService.transcribeAudio(audioFile);
    
    if (!success || !text) {
      return {
        success: false,
        error: error || "Transcription failed"
      };
    }

    return await StructuredOutputService.structureText<VoiceMemoData>(
      text,
      VoiceMemoSchema,
      VOICE_MEMO_PROMPT
    );

  } catch (error) {
    console.error('Error processing voice memo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process voice memo'
    };
  }
} 