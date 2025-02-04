"use client"

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
import PhotoCapture from "@/app/_components/photo-capture"
import LeadsTable from "@/app/_components/leads-table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { uploadBusinessCard, uploadVoiceMemo } from "@/lib/storage/storage-client"
import { createCapturedLead } from "@/actions/capture-lead-actions"
import { getLeads } from "@/actions/leads-actions"
import type { Lead } from "@/db/schema/leads-schema"
import type { StructuredOutput } from '@/types/structured-output-types'
import { processStructuredData } from "@/actions/process-structured-data"
import { transcribeVoiceMemo } from "@/actions/process-voice-memo"
import { extractTextFromImage } from '@/actions/vision-actions'

// Dynamically import VoiceRecorder with no SSR
const VoiceRecorder = dynamic(
  () => import('@/app/_components/voice-recorder'),
  { ssr: false }
)

interface CapturedFiles {
  businessCard?: File | null
  voiceMemo?: Blob | null
  textNotes?: string
}

export default function VoiceMemosPage() {
  const [capturedFiles, setCapturedFiles] = useState<CapturedFiles>({})
  const [isUploading, setIsUploading] = useState(false)
  const [key, setKey] = useState(0)
  const [leads, setLeads] = useState<Lead[]>([])

  // Fetch leads on mount and after successful upload
  const fetchLeads = async () => {
    const result = await getLeads()
    if (result.success) {
      setLeads(result.data || [])
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleUpload = async () => {
    if (!capturedFiles.businessCard && !capturedFiles.voiceMemo && !capturedFiles.textNotes) {
      toast.error('Please capture at least one item')
      return
    }

    setIsUploading(true)

    try {
      let businessCardPath: string | undefined
      let voiceMemoPath: string | undefined
      let combinedContext = ''
      let rawVoiceMemoText: string | undefined
      let rawBusinessCardText: string | undefined

      // First, collect all raw text
      // 1. Business Card OCR
      if (capturedFiles.businessCard) {
        try {
          businessCardPath = await uploadBusinessCard(capturedFiles.businessCard)
          
          // Create FormData for Vision API
          const formData = new FormData()
          formData.append('file', capturedFiles.businessCard)
          
          const visionResult = await extractTextFromImage(formData)
          if (visionResult.success && visionResult.text) {
            rawBusinessCardText = visionResult.text // Store raw OCR text
            combinedContext += `BUSINESS CARD:\n${visionResult.text}\n\n`
          }
        } catch (error) {
          console.error('Error processing business card:', error)
        }
      }

      // 2. Voice Memo Transcription
      if (capturedFiles.voiceMemo) {
        try {
          console.log('[Upload] Starting voice memo processing')
          
          voiceMemoPath = await uploadVoiceMemo(capturedFiles.voiceMemo)
          console.log('[Upload] Voice memo uploaded to storage:', voiceMemoPath)
          
          // Convert Blob to File and create FormData
          const audioFile = new File([capturedFiles.voiceMemo], 'voice-memo.mp3', { type: 'audio/mp3' })
          const formData = new FormData()
          formData.append('file', audioFile)
          
          const { success, text, error } = await transcribeVoiceMemo(formData)
          console.log('[Upload] Transcription result:', { success, text, error })
          
          if (success && text) {
            console.log('[Upload] Raw voice memo text before storage:', text)
            rawVoiceMemoText = text // Store raw transcription
            console.log('[Upload] Raw voice memo text after storage:', rawVoiceMemoText)
            combinedContext += `VOICE MEMO:\n${text}\n\n`
            console.log('[Upload] Updated combined context:', combinedContext)
          } else {
            console.error('[Upload] Transcription failed:', error)
          }
        } catch (error) {
          console.error('[Upload] Error processing voice memo:', error)
          console.error('[Upload] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error)
          })
        }
      }

      // 3. Text Notes
      if (capturedFiles.textNotes) {
        combinedContext += `TEXT NOTES:\n${capturedFiles.textNotes}\n\n`
      }

      // Now process all the text together
      console.log('[Upload] Processing combined context:', combinedContext)
      const result = await processStructuredData(combinedContext)
      console.log('[Upload] Structured data result:', result)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to structure data')
      }

      // Create the structured data with source tracking
      const structuredData: StructuredOutput = {
        ...result.data,
        hasBusinessCard: !!businessCardPath,
        hasVoiceMemo: !!voiceMemoPath,
        hasTextNote: !!capturedFiles.textNotes,
        businessCardPath,
        voiceMemoPath,
        // Store the full raw text sections
        rawBusinessCard: rawBusinessCardText,
        rawVoiceMemo: rawVoiceMemoText,
        rawTextNote: capturedFiles.textNotes || undefined
      }
      console.log('[Upload] Final structured data with raw voice memo:', structuredData.rawVoiceMemo)

      // Create a single lead record
      const createResult = await createCapturedLead({
        businessCardPath,
        voiceMemoPath,
        rawTextNote: capturedFiles.textNotes,
        structuredData
      })
      console.log('[Upload] Create lead result:', createResult)
      
      if (!createResult.success) {
        throw new Error(createResult.error)
      }

      toast.success('Lead created and processed successfully')
      
      // Reset all captures
      setCapturedFiles({})
      setKey(prev => prev + 1)
      
      // Refresh leads list
      fetchLeads()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to process lead')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                Lead Capture
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Capture trade show leads with business cards and quick voice notes
            </p>
          </div>
          
          <div className="space-y-8">
            <PhotoCapture 
              key={`photo-${key}`}
              onCapture={(file) => setCapturedFiles(prev => ({ ...prev, businessCard: file }))} 
            />
            <VoiceRecorder 
              key={`voice-${key}`}
              onCapture={(blob) => setCapturedFiles(prev => ({ ...prev, voiceMemo: blob }))} 
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Additional Notes
              </label>
              <Textarea
                key={`notes-${key}`}
                placeholder="Add any additional notes about the lead..."
                className="min-h-[100px] resize-y"
                value={capturedFiles.textNotes || ''}
                onChange={(e) => setCapturedFiles(prev => ({ ...prev, textNotes: e.target.value }))}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                className="w-full h-14 text-lg"
                onClick={handleUpload}
                disabled={!capturedFiles.businessCard && !capturedFiles.voiceMemo && !capturedFiles.textNotes || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Create New Lead
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {leads.length > 0 && (
          <div>
            <LeadsTable 
              leads={leads} 
              showActions={false}
              showQualificationFilter={false}
              showQualificationStats={false}
            />
          </div>
        )}
      </div>
    </div>
  )
} 