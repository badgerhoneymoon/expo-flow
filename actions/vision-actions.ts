"use server"

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function extractTextFromImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      }
    }

    // Convert File to Buffer for OpenAI API
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all text from this business card image. Return ONLY the extracted text, formatted exactly as it appears on the card. Do not add any additional formatting, explanations, or labels."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    })

    const extractedText = response.choices[0]?.message?.content

    if (!extractedText) {
      return {
        success: false,
        error: 'No text extracted from image'
      }
    }

    return {
      success: true,
      text: extractedText.trim()
    }

  } catch (error) {
    console.error('Vision API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract text from image'
    }
  }
} 