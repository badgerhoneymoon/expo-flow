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
    modelName: string = "gpt-4o-mini"
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

      return {
        success: true,
        data: {
          ...parsedData,
          rawInput: input
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
    modelName: string = "gpt-4o-mini"
  ): Promise<StructuredOutputResponse<T>> {
    return this.process<T>(text, schema, prompt, modelName);
  }
} 