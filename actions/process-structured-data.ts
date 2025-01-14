"use server"

import { StructuredOutputService } from "@/lib/services/structured-output-service"
import { getStructuredOutputPrompt } from '@/lib/prompts/structured-output-prompt'
import { StructuredOutputSchema, type StructuredOutput } from '@/types/structured-output-types'

export async function processStructuredData(text: string) {
  try {
    const prompt = getStructuredOutputPrompt(new Date().toISOString().split('T')[0])
    const result = await StructuredOutputService.structureText<StructuredOutput>(
      text,
      StructuredOutputSchema,
      prompt
    )

    return result
  } catch (error) {
    console.error('Error processing structured data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process structured data'
    }
  }
} 