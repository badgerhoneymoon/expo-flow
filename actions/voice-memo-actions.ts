"use server"

interface ActionState<T> {
  isSuccess: boolean
  message: string
  data?: T
}

export async function saveVoiceMemo(blob: Blob): Promise<ActionState<string>> {
  try {
    // Convert blob to base64 for local storage testing
    const buffer = await blob.arrayBuffer()
    const base64Audio = Buffer.from(buffer).toString('base64')
    
    return {
      isSuccess: true,
      message: "Voice memo saved successfully",
      data: base64Audio
    }
  } catch (error) {
    console.error("Failed to save voice memo:", error)
    return {
      isSuccess: false,
      message: "Failed to save voice memo"
    }
  }
} 