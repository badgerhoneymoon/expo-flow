"use client"

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
import PhotoCapture from "@/app/_components/photo-capture"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { uploadBusinessCard, uploadVoiceMemo } from "@/lib/storage/storage-client"

// Dynamically import VoiceRecorder with no SSR
const VoiceRecorder = dynamic(
  () => import('@/app/_components/voice-recorder'),
  { ssr: false }
)

interface CapturedFiles {
  businessCard?: File | null
  voiceMemo?: Blob | null
}

export default function VoiceMemosPage() {
  const [capturedFiles, setCapturedFiles] = useState<CapturedFiles>({})
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!capturedFiles.businessCard && !capturedFiles.voiceMemo) {
      toast.error('Please capture at least one file first')
      return
    }

    setIsUploading(true)
    try {
      const uploads = []

      if (capturedFiles.businessCard) {
        uploads.push(uploadBusinessCard(capturedFiles.businessCard))
      }
      if (capturedFiles.voiceMemo) {
        uploads.push(uploadVoiceMemo(capturedFiles.voiceMemo))
      }

      const paths = await Promise.all(uploads)
      toast.success('Files uploaded successfully')
      
      // Reset captures after successful upload
      setCapturedFiles({})
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
            onCapture={(file) => setCapturedFiles(prev => ({ ...prev, businessCard: file }))} 
          />
          <VoiceRecorder 
            onCapture={(blob) => setCapturedFiles(prev => ({ ...prev, voiceMemo: blob }))} 
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              className="w-full h-14 text-lg"
              onClick={handleUpload}
              disabled={!capturedFiles.businessCard && !capturedFiles.voiceMemo || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload {Object.keys(capturedFiles).filter(key => capturedFiles[key as keyof CapturedFiles]).length} file{Object.keys(capturedFiles).filter(key => capturedFiles[key as keyof CapturedFiles]).length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 