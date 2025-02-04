"use client"

import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { Mic, Square, FileAudio, Clock, Gauge } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Add function to send logs to server
async function sendLogToServer(action: string, data: any) {
  try {
    await fetch('/api/debug-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        data,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    })
  } catch (error) {
    console.error('Failed to send log:', error)
  }
}

interface RecordingStats {
  size: number
  duration: number
  bitrate: number
}

interface VoiceRecorderProps {
  onCapture: (blob: Blob | null) => void
}

export default function VoiceRecorder({ onCapture }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [stats, setStats] = useState<RecordingStats | null>(null)
  const [timer, setTimer] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Request microphone access on mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Log available MIME types
        const supportedTypes = [
          'audio/webm',
          'audio/mp4',
          'audio/ogg',
          'audio/wav',
          'audio/mp3'
        ].filter(type => MediaRecorder.isTypeSupported(type))

        sendLogToServer('init', {
          supportedTypes,
          userAgent: navigator.userAgent
        })

        // Try to use a supported MIME type
        const options = {
          mimeType: supportedTypes[0] || 'audio/webm'
        }
        
        sendLogToServer('recorder-config', {
          selectedMimeType: options.mimeType
        })

        mediaRecorderRef.current = new MediaRecorder(stream, options)
        
        mediaRecorderRef.current.ondataavailable = (e) => {
          const chunkInfo = {
            size: e.data.size,
            type: e.data.type
          }
          sendLogToServer('chunk-available', chunkInfo)
          chunksRef.current.push(e.data)
        }

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { 
            type: mediaRecorderRef.current?.mimeType || 'audio/mp3'
          })

          if (startTimeRef.current) {
            const duration = (Date.now() - startTimeRef.current) / 1000
            const recordingInfo = {
              size: blob.size,
              type: blob.type,
              mimeType: mediaRecorderRef.current?.mimeType,
              duration,
              chunks: chunksRef.current.length,
              chunkSizes: chunksRef.current.map(chunk => chunk.size)
            }
            
            setStats({
              size: blob.size,
              duration,
              bitrate: (blob.size * 8) / (duration * 1000)
            })

            sendLogToServer('recording-completed', recordingInfo)
            onCapture(blob)
          }

          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          chunksRef.current = []
        }

        sendLogToServer('init-success', { message: 'Microphone access granted' })
      })
      .catch(err => {
        sendLogToServer('init-error', { 
          error: err.message || 'Microphone access denied'
        })
        toast.error("Please allow microphone access")
      })

    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleRecordingClick = () => {
    if (!mediaRecorderRef.current) return

    if (isRecording) {
      sendLogToServer('recording-stop', {
        duration: timer
      })
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setIsRecording(false)
    } else {
      sendLogToServer('recording-start', {
        mimeType: mediaRecorderRef.current.mimeType
      })
      startTimeRef.current = Date.now()
      setTimer(0)
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setAudioUrl(null)
      setStats(null)
      onCapture(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <motion.div 
        layout
        className={cn(
          "relative flex flex-col items-center p-8 rounded-xl bg-white/50 dark:bg-gray-950/50 border shadow-xl backdrop-blur-sm",
          "transition-all duration-500 ease-in-out",
          isRecording ? "min-h-[240px]" : "min-h-[160px]"
        )}
      >
        <motion.div layout className="relative w-full flex flex-col items-center">
          <div className="relative">
            <div className={cn(
              "relative p-8 rounded-full transition-colors duration-500",
              isRecording ? "bg-red-100 dark:bg-red-900/30" : "bg-indigo-100 dark:bg-indigo-900/30"
            )}>
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-400/25 dark:bg-red-400/20"
                  animate={{
                    scale: [1, 1.25],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  style={{ aspectRatio: "1/1" }}
                />
              )}
              
              <Button 
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={cn(
                  "h-16 w-16 rounded-full transition-all duration-300 hover:scale-105 relative z-10",
                  !isRecording && "bg-indigo-500 hover:bg-indigo-600 text-white"
                )}
                onClick={handleRecordingClick}
              >
                {isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-2xl font-mono text-red-500/90 dark:text-red-400/90 mt-4"
              >
                {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {audioUrl && stats && (
              <motion.div 
                className="w-full mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground/80 mb-4">
                  <div className="flex items-center gap-1.5">
                    <FileAudio className="w-3.5 h-3.5 opacity-70" />
                    <span>{formatFileSize(stats.size)}</span>
                  </div>
                  <span className="opacity-50">•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span>{formatDuration(stats.duration)}</span>
                  </div>
                  <span className="opacity-50">•</span>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 opacity-70" />
                    <span>{stats.bitrate.toFixed(1)} kbps</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm border">
                  <audio 
                    src={audioUrl} 
                    controls 
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
} 