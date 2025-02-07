"use client"

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
import PhotoCapture from "@/app/_components/photo-capture"
import LeadsTable from "@/app/_components/leads-table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

// Set route segment config
export const maxDuration = 60 // 60 seconds timeout

// Dynamically import VoiceRecorder with no SSR
const VoiceRecorder = dynamic(
  () => import('@/app/_components/voice-recorder'),
  { ssr: false }
)

interface CapturedFiles {
  businessCard?: File | File[] | null
  voiceMemo?: Blob | null
  textNotes?: string
}

export default function Home() {
  const [capturedFiles, setCapturedFiles] = useState<CapturedFiles>({})
  const [isUploading, setIsUploading] = useState(false)
  const [photoKey, setPhotoKey] = useState(0)
  const [voiceKey, setVoiceKey] = useState(0)
  const [notesKey, setNotesKey] = useState(0)
  const [leads, setLeads] = useState<Lead[]>([])
  const [isRussian, setIsRussian] = useState(false)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [eventName, setEventName] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('lastEventName') ?? '' : ''
  )

  // Persist event name
  useEffect(() => {
    if (eventName) localStorage.setItem('lastEventName', eventName)
  }, [eventName])

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
    if (!eventName.trim()) {
      toast.error('Please enter an event name')
      return
    }

    if (isBulkMode) {
      if (!Array.isArray(capturedFiles.businessCard) || capturedFiles.businessCard.length === 0) {
        toast.error('Please select at least one business card')
        return
      }
    } else if (!capturedFiles.businessCard && !capturedFiles.voiceMemo && !capturedFiles.textNotes) {
      toast.error('Please capture at least one item')
      return
    }

    setIsUploading(true)

    try {
      if (isBulkMode && Array.isArray(capturedFiles.businessCard)) {
        // Process multiple business cards in parallel
        const results = await Promise.all(
          capturedFiles.businessCard.map(async (file) => {
            try {
              const businessCardPath = await uploadBusinessCard(file)
              const formData = new FormData()
              formData.append('file', file)
              
              const visionResult = await extractTextFromImage(formData)
              if (!visionResult.success || !visionResult.text) {
                console.error('Failed to extract text from business card')
                return { success: false, error: 'Failed to extract text' }
              }

              const combinedContext = `BUSINESS CARD:\n${visionResult.text}\n\n`
              
              // Process structured data
              const result = await processStructuredData(combinedContext)
              if (!result.success || !result.data) {
                console.error('Failed to structure data')
                return { success: false, error: 'Failed to structure data' }
              }

              // Create structured output
              const structuredData: StructuredOutput = {
                ...result.data,
                eventName,
                hasBusinessCard: true,
                hasVoiceMemo: false,
                hasTextNote: false,
                businessCardPath,
                voiceMemoPath: undefined,
                rawBusinessCard: visionResult.text,
                rawVoiceMemo: undefined,
                rawTextNote: undefined
              }

              // Create lead
              const createResult = await createCapturedLead({
                businessCardPath,
                structuredData
              })

              if (!createResult.success) {
                return { success: false, error: createResult.error }
              }

              return { success: true }
            } catch (error) {
              console.error('Error processing business card:', error)
              return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
            }
          })
        )
        
        const successful = results.filter(r => r.success).length
        const failed = results.filter(r => !r.success).length
        
        if (failed === 0) {
          toast.success(`Successfully created ${successful} leads`)
        } else if (successful === 0) {
          toast.error('Failed to create any leads')
        } else {
          toast.warning(`Created ${successful} leads, ${failed} failed`)
        }
      } else {
        // Original single lead processing logic
        let businessCardPath: string | undefined
        let voiceMemoPath: string | undefined
        let combinedContext = ''
        let rawVoiceMemoText: string | undefined
        let rawBusinessCardText: string | undefined

        // Process business card
        if (capturedFiles.businessCard && !Array.isArray(capturedFiles.businessCard)) {
          try {
            businessCardPath = await uploadBusinessCard(capturedFiles.businessCard)
            const formData = new FormData()
            formData.append('file', capturedFiles.businessCard)
            
            const visionResult = await extractTextFromImage(formData)
            if (visionResult.success && visionResult.text) {
              rawBusinessCardText = visionResult.text
              combinedContext += `BUSINESS CARD:\n${visionResult.text}\n\n`
            }
          } catch (error) {
            console.error('Error processing business card:', error)
          }
        }

        // Process voice memo
        if (capturedFiles.voiceMemo) {
          try {
            console.log('[Upload] Starting voice memo processing')
            voiceMemoPath = await uploadVoiceMemo(capturedFiles.voiceMemo)
            
            const audioFile = new File([capturedFiles.voiceMemo], 'voice-memo.mp3', { type: 'audio/mp3' })
            const formData = new FormData()
            formData.append('file', audioFile)
            
            const { success, text, error } = await transcribeVoiceMemo(formData, isRussian ? "ru" : "en")
            
            if (success && text) {
              rawVoiceMemoText = text
              combinedContext += `VOICE MEMO:\n${text}\n\n`
            } else {
              console.error('[Upload] Transcription failed:', error)
            }
          } catch (error) {
            console.error('[Upload] Error processing voice memo:', error)
          }
        }

        // Add text notes
        if (capturedFiles.textNotes) {
          combinedContext += `TEXT NOTES:\n${capturedFiles.textNotes}\n\n`
        }

        // Process structured data
        const result = await processStructuredData(combinedContext)
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to structure data')
        }

        // Create structured output
        const structuredData: StructuredOutput = {
          ...result.data,
          eventName,
          hasBusinessCard: !!businessCardPath,
          hasVoiceMemo: !!voiceMemoPath,
          hasTextNote: !!capturedFiles.textNotes,
          businessCardPath,
          voiceMemoPath,
          rawBusinessCard: rawBusinessCardText,
          rawVoiceMemo: rawVoiceMemoText,
          rawTextNote: capturedFiles.textNotes || undefined
        }

        // Create lead
        const createResult = await createCapturedLead({
          businessCardPath,
          voiceMemoPath,
          rawTextNote: capturedFiles.textNotes,
          structuredData
        })
        
        if (!createResult.success) {
          throw new Error(createResult.error)
        }

        toast.success('Lead created and processed successfully')
      }

      setCapturedFiles({})
      setPhotoKey(prev => prev + 1)
      setVoiceKey(prev => prev + 1)
      setNotesKey(prev => prev + 1)
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
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Event Name *
                </label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bulk-mode"
                    checked={isBulkMode}
                    onCheckedChange={(checked) => {
                      setIsBulkMode(checked)
                      // Reset files when switching modes
                      setCapturedFiles({})
                      setPhotoKey(prev => prev + 1)
                      setVoiceKey(prev => prev + 1)
                      setNotesKey(prev => prev + 1)
                    }}
                  />
                  <Label htmlFor="bulk-mode" className="text-sm font-medium cursor-pointer">
                    Bulk Business Cards Mode
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Enter the trade show or event name..."
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <PhotoCapture 
              key={`photo-${photoKey}`}
              onCapture={(file) => setCapturedFiles(prev => ({ ...prev, businessCard: file }))}
              isBulkMode={isBulkMode}
            />

            {!isBulkMode && (
              <>
                <div className="space-y-4">
                  <Card className="p-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span role="img" aria-label="US flag" className="text-xl">
                        🇺🇸
                      </span>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="russian-mode"
                          checked={isRussian}
                          onCheckedChange={setIsRussian}
                        />
                        <Label htmlFor="russian-mode" className="text-sm font-medium">
                          {isRussian ? " Русский" : "English"}
                        </Label>
                      </div>
                      <span role="img" aria-label="Russian flag" className="text-xl">
                        🇷🇺
                      </span>
                    </div>
                    <VoiceRecorder 
                      key={`voice-${voiceKey}`}
                      onCapture={(blob) => setCapturedFiles(prev => ({ ...prev, voiceMemo: blob }))} 
                    />
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Additional Notes
                  </label>
                  <Textarea
                    key={`notes-${notesKey}`}
                    placeholder="Add any additional notes about the lead..."
                    className="min-h-[100px] resize-y"
                    value={capturedFiles.textNotes || ''}
                    onChange={(e) => setCapturedFiles(prev => ({ ...prev, textNotes: e.target.value }))}
                  />
                </div>
              </>
            )}
            
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
                    {isBulkMode && Array.isArray(capturedFiles.businessCard) && capturedFiles.businessCard.length > 0
                      ? `Create ${capturedFiles.businessCard.length} Leads`
                      : 'Create New Lead'
                    }
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
              showActions={true}
              showQualificationFilter={false}
              showQualificationStats={false}
              allowedActions={['export']}
            />
          </div>
        )}
      </div>
    </div>
  )
} 