"use client"

import VoiceRecorder from "@/app/_components/voice-recorder"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"

export default function VoiceMemosPage() {
  return (
    <div className="container mx-auto py-12 px-4 min-h-screen bg-gradient-to-b from-transparent to-indigo-50/20 dark:to-indigo-950/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
              <Mic className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-2"
          >
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                Voice Memos
              </span>
            </h1>
            <p className="text-muted-foreground">
              Capture your thoughts with crystal clear audio
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl" />
          
          <VoiceRecorder />
        </motion.div>
      </motion.div>
    </div>
  )
} 