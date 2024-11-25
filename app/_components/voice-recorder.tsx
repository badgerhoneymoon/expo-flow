"use client"

import { useReactMediaRecorder } from "react-media-recorder"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Mic, Square, Upload, Loader2 } from "lucide-react"
import { saveVoiceMemo } from "@/actions/voice-memo-actions"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function VoiceRecorder() {
  const [isUploading, setIsUploading] = useState(false)
  const [savedRecordings, setSavedRecordings] = useState<string[]>([])
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/mp3" },
  })

  const handleSave = async () => {
    if (!mediaBlobUrl) return
    
    setIsUploading(true)
    try {
      const response = await fetch(mediaBlobUrl)
      const blob = await response.blob()
      
      const result = await saveVoiceMemo(blob)
      
      if (result.isSuccess && result.data) {
        const audioData: string = result.data
        setSavedRecordings(prev => [...prev, audioData])
        toast.success("Recording saved successfully")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Failed to save recording:", error)
      toast.error("Failed to save recording")
    } finally {
      setIsUploading(false)
    }
  }

  const isRecording = status === "recording"

  return (
    <div className="space-y-8">
      <motion.div 
        className="relative flex flex-col items-center gap-6 p-8 rounded-xl bg-white/50 dark:bg-gray-950/50 border shadow-xl backdrop-blur-sm"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="relative"
          animate={isRecording ? {
            scale: [1, 1.1, 1],
            transition: { 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }
          } : {}}
        >
          {/* Animated rings */}
          {isRecording && (
            <>
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-red-500/50 pointer-events-none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeOut"
                }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-red-500/30 pointer-events-none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeOut",
                  delay: 0.5
                }}
              />
            </>
          )}

          {/* Main button */}
          <div className={cn(
            "p-8 rounded-full transition-colors duration-200",
            isRecording ? "bg-red-100 dark:bg-red-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"
          )}>
            <Button 
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={cn(
                "h-16 w-16 rounded-full transition-transform duration-200 hover:scale-105",
                isRecording && "animate-pulse"
              )}
              onClick={() => isRecording ? stopRecording() : startRecording()}
              disabled={status === "acquiring_media"}
            >
              {isRecording ? (
                <Square className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mediaBlobUrl && (
            <motion.div 
              className="w-full space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm border">
                <audio src={mediaBlobUrl} controls className="w-full" />
              </div>
              
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isUploading}
                className="w-full h-12 hover:scale-[1.02] transition-transform duration-200"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploading ? "Saving..." : "Save Recording"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {savedRecordings.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-center">Saved Recordings</h3>
            <div className="space-y-4">
              {savedRecordings.map((base64Audio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 shadow-sm border backdrop-blur-sm hover:shadow-md transition-shadow duration-200"
                >
                  <audio 
                    src={`data:audio/mp3;base64,${base64Audio}`}
                    controls 
                    className="w-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 