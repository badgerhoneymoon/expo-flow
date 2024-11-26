"use client"

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
import PhotoCapture from "@/app/_components/photo-capture"

// Dynamically import VoiceRecorder with no SSR
const VoiceRecorder = dynamic(
  () => import('@/app/_components/voice-recorder'),
  { ssr: false }
)

export default function VoiceMemosPage() {
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
          <PhotoCapture />
          <VoiceRecorder />
        </div>
      </motion.div>
    </div>
  )
} 