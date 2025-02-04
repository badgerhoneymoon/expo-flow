import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface StructuredOutputResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class StructuredOutputService {
  /**
   * Generic method to structure data using OpenAI
   */
  static async process<T>(
    input: string,
    schema: z.ZodSchema,
    prompt: string,
    modelName: string = "gpt-4o"
  ): Promise<StructuredOutputResponse<T>> {
    try {
      const completion = await openai.beta.chat.completions.parse({
        model: modelName,
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: input
          }
        ],
        response_format: zodResponseFormat(schema, "data")
      });

      const parsedData = completion.choices[0].message.parsed;
      
      if (!parsedData) {
        return {
          success: false,
          error: 'Failed to parse data'
        };
      }

      // Extract raw data sections using string manipulation instead of regex
      const extractSection = (marker: string) => {
        const start = input.indexOf(marker + ":\n");
        if (start === -1) return undefined;
        
        const contentStart = start + marker.length + 2;
        const end = input.indexOf("\n\n", contentStart);
        const result = end === -1 ? input.slice(contentStart) : input.slice(contentStart, end);
        console.log(`[StructuredOutput] Extracted ${marker}:`, result);
        return result;
      };

      // Preserve raw data fields if they exist in the input context
      const rawData = {
        rawBusinessCard: extractSection("BUSINESS CARD"),
        rawVoiceMemo: extractSection("VOICE MEMO"),
        rawTextNote: extractSection("TEXT NOTES")
      };
      
      console.log('[StructuredOutput] Final raw data:', rawData);

      return {
        success: true,
        data: {
          ...parsedData,
          ...rawData
        } as T
      };

    } catch (error) {
      console.error('Error structuring data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to structure data'
      };
    }
  }

  // Keep for backward compatibility
  static async structureText<T>(
    text: string,
    schema: z.ZodSchema,
    prompt: string,
    modelName: string = "gpt-4o"
  ): Promise<StructuredOutputResponse<T>> {
    return this.process<T>(text, schema, prompt, modelName);
  }
} 