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
import { OCRService } from '@/lib/services/ocr-service'
import { extractBusinessCard } from '@/actions/extract-business-card'
import { processVoiceMemo } from '@/actions/process-voice-memo'
import { processTextNotes } from '@/actions/process-text-notes'
import type { StructuredOutput } from '@/types/structured-output-types'

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
      let structuredData: StructuredOutput = {
        firstName: "N/A",
        lastName: "N/A",
        nextSteps: "Process captured files",
        notes: "Lead created from captured files",
        hasBusinessCard: false,
        hasTextNote: false,
        hasVoiceMemo: false
      }

      // Upload business card if exists
      if (capturedFiles.businessCard) {
        try {
          businessCardPath = await uploadBusinessCard(capturedFiles.businessCard)
          const ocrResult = await OCRService.performOCR(capturedFiles.businessCard)
          if (ocrResult.success && ocrResult.text) {
            const response = await extractBusinessCard(ocrResult.text)
            if (response.success && response.data) {
              structuredData = {
                ...structuredData,
                ...response.data,
                hasBusinessCard: true,
                businessCardPath,
                rawBusinessCard: ocrResult.text
              }
            }
          }
        } catch (error) {
          console.error('Error processing business card:', error)
        }
      }

      // Upload voice memo if exists
      if (capturedFiles.voiceMemo) {
        try {
          voiceMemoPath = await uploadVoiceMemo(capturedFiles.voiceMemo)
          const formData = new FormData()
          formData.append('file', capturedFiles.voiceMemo)
          const response = await processVoiceMemo(formData)
          if (response.success && response.data) {
            structuredData = {
              ...structuredData,
              ...response.data,
              hasVoiceMemo: true,
              voiceMemoPath,
              rawVoiceMemo: response.data.rawVoiceMemo
            }
          }
        } catch (error) {
          console.error('Error processing voice memo:', error)
        }
      }

      // Process text notes if exists
      if (capturedFiles.textNotes) {
        try {
          const response = await processTextNotes(capturedFiles.textNotes)
          if (response.success && response.data) {
            structuredData = {
              ...structuredData,
              ...response.data,
              hasTextNote: true,
              rawTextNote: capturedFiles.textNotes
            }
          }
        } catch (error) {
          console.error('Error processing text notes:', error)
        }
      }

      // Create a single lead record with both storage paths and structured data
      const result = await createCapturedLead({
        businessCardPath,
        voiceMemoPath,
        rawTextNote: capturedFiles.textNotes
      })
      
      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Lead created and processed successfully')
      
      // Reset all captures after successful upload
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
            <LeadsTable leads={leads} />
          </div>
        )}
      </div>
    </div>
  )
} 