"use client"

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
import PhotoCapture from "@/app/_components/photo-capture"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { uploadBusinessCard, uploadVoiceMemo } from "@/lib/storage/storage-client"
import { createCapturedLead } from "@/actions/capture-lead-actions"

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

  const handleUpload = async () => {
    if (!capturedFiles.businessCard && !capturedFiles.voiceMemo && !capturedFiles.textNotes) {
      toast.error('Please capture at least one type of information')
      return
    }

    setIsUploading(true)
    try {
      const uploads = []
      const paths: { businessCardPath?: string, voiceMemoPath?: string } = {}

      if (capturedFiles.businessCard) {
        uploads.push(uploadBusinessCard(capturedFiles.businessCard))
      }
      if (capturedFiles.voiceMemo) {
        uploads.push(uploadVoiceMemo(capturedFiles.voiceMemo))
      }

      const uploadedPaths = await Promise.all(uploads)
      
      // Map paths to their respective types
      if (capturedFiles.businessCard) {
        paths.businessCardPath = uploadedPaths[0]
      }
      if (capturedFiles.voiceMemo && !capturedFiles.businessCard) {
        paths.voiceMemoPath = uploadedPaths[0]
      } else if (capturedFiles.voiceMemo) {
        paths.voiceMemoPath = uploadedPaths[1]
      }

      // Create lead record
      const result = await createCapturedLead({
        ...paths,
        rawTextNote: capturedFiles.textNotes
      })
      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Lead created successfully')
      
      // Reset all captures after successful upload
      setCapturedFiles({})
      
      // Force a re-render of components by key change
      setKey(prev => prev + 1)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Save Lead Information
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 