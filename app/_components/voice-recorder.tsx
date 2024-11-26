"use client"

import { useReactMediaRecorder } from "react-media-recorder"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { Mic, Square, FileAudio, Clock, Gauge } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface RecordingStats {
  size: number
  duration: number
  bitrate: number
}

export default function VoiceRecorder() {
  const [stats, setStats] = useState<RecordingStats | null>(null)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/webm;codecs=opus" },
    mediaRecorderOptions: {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 24000,
    },
    onStart: () => {
      startTimeRef.current = Date.now()
      setStats(null)
      setTimer(0)
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    },
    onStop: async (blobUrl) => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (blobUrl && startTimeRef.current) {
        const response = await fetch(blobUrl)
        const blob = await response.blob()
        const duration = (Date.now() - startTimeRef.current) / 1000
        const size = blob.size
        const bitrate = (size * 8) / (duration * 1000)

        setStats({
          size,
          duration,
          bitrate
        })
      }
    }
  })

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

  const isRecording = status === "recording"

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
          <motion.div layout>
            <div className={cn(
              "relative p-8 rounded-full transition-colors duration-500",
              isRecording 
                ? "bg-red-100 dark:bg-red-900/30" 
                : "bg-indigo-100 dark:bg-indigo-900/30"
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
                />
              )}
              
              <Button 
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={cn(
                  "h-16 w-16 rounded-full transition-all duration-300 hover:scale-105 relative z-10",
                  !isRecording && "bg-indigo-500 hover:bg-indigo-600 text-white"
                )}
                onClick={() => isRecording ? stopRecording() : startRecording()}
              >
                {isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div 
            layout
            className="overflow-hidden"
            animate={{ 
              height: isRecording ? "5rem" : "0rem",
              marginTop: isRecording ? "1rem" : "0rem"
            }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className="text-3xl font-mono text-red-500/90 dark:text-red-400/90"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
                  </motion.div>
                  <motion.div 
                    className="text-sm text-muted-foreground/70 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Recording
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {stats && (
              <motion.div 
                layout
                className="w-full mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground/80">
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
                <div className="mt-4 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm border">
                  <audio 
                    src={mediaBlobUrl} 
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