"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface UploadProgressProps {
  fileName: string
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
}

export function UploadProgress({ fileName, progress, status }: UploadProgressProps) {
  const [show, setShow] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (status === "complete") {
      // Start fade out after 1 second of completion
      const fadeTimeout = setTimeout(() => {
        setShow(false)
      }, 1000)

      return () => clearTimeout(fadeTimeout)
    }
  }, [status])

  // Remove from DOM after animation completes
  const onAnimationComplete = () => {
    if (!show) {
      setShouldRender(false)
    }
  }

  if (!shouldRender) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, height: "auto" }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onAnimationComplete={onAnimationComplete}
          className="space-y-2 mb-2"
        >
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">{fileName}</span>
            <div className="flex items-center gap-2">
              <span 
                className={cn(
                  "text-xs font-medium",
                  status === "error" && "text-red-500"
                )}
              >
                {status === "uploading" && "Ready for processing..."}
                {status === "processing" && "Processing..."}
                {status === "complete" && "Complete"}
                {status === "error" && "Error"}
              </span>
              {status === "complete" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              )}
            </div>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-1",
              status === "complete" && "bg-green-100 [&>div]:bg-green-500",
              status === "error" && "bg-red-100 [&>div]:bg-red-500"
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
} 