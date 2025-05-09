import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WhisperTranscriptionResponse {
  success: boolean;
  text?: string;
  error?: string;
}

export class WhisperService {
  static async transcribeAudio(audioFile: File, language?: string): Promise<WhisperTranscriptionResponse> {
    try {
      console.log('[Whisper] Starting transcription...');
      const formData = new FormData();
      formData.append('file', audioFile);
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: language || "en",
        response_format: "text",
      });

      console.log('[Whisper] Raw transcription result:', transcription);
      
      return {
        success: true,
        text: transcription,
      };
    } catch (error) {
      console.error("[Whisper] API Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to transcribe audio",
      };
    }
  }
} 