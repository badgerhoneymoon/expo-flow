"use client"

import { useState } from "react"
import { X, Camera, FileImage, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PhotoStats {
  size: number
  name: string
}

interface PhotoCaptureProps {
  onCapture: (file: File | null) => void
}

export default function PhotoCapture({ onCapture }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [stats, setStats] = useState<PhotoStats | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
        setStats({
          size: file.size,
          name: file.name
        })
        onCapture(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = () => {
    setPhoto(null)
    setStats(null)
    onCapture(null)
  }

  // Function to handle base64 to file conversion (for camera capture)
  const base64ToFile = async (base64String: string, filename: string): Promise<File> => {
    const res = await fetch(base64String)
    const blob = await res.blob()
    return new File([blob], filename, { type: 'image/jpeg' })
  }

  return (
    <div className="space-y-8">
      <motion.div 
        layout
        className={cn(
          "relative flex flex-col items-center p-8 rounded-xl bg-white/50 dark:bg-gray-950/50 border shadow-xl backdrop-blur-sm",
          "transition-all duration-500 ease-in-out",
          photo ? "min-h-[240px]" : "min-h-[160px]"
        )}
      >
        <div className="relative w-full flex flex-col items-center">
          {!photo ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Camera capture input */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileSelect}
                  id="camera-input"
                />
                <div className={cn(
                  "p-4 rounded-2xl transition-colors duration-200 h-full",
                  "bg-emerald-100 dark:bg-emerald-900/30"
                )}>
                  <Button 
                    size="lg"
                    variant="default"
                    className={cn(
                      "h-full w-full rounded-xl transition-all duration-300 hover:scale-105",
                      "bg-emerald-500 hover:bg-emerald-600 text-white flex flex-col items-center justify-center gap-2 py-4"
                    )}
                    onClick={() => document.getElementById('camera-input')?.click()}
                    type="button"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-sm font-medium">Take Photo</span>
                  </Button>
                </div>
              </label>

              {/* File selection input */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  id="gallery-input"
                />
                <div className={cn(
                  "p-4 rounded-2xl transition-colors duration-200 h-full",
                  "bg-blue-100 dark:bg-blue-900/30"
                )}>
                  <Button 
                    size="lg"
                    variant="default"
                    className={cn(
                      "h-full w-full rounded-xl transition-all duration-300 hover:scale-105",
                      "bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center gap-2 py-4"
                    )}
                    onClick={() => document.getElementById('gallery-input')?.click()}
                    type="button"
                  >
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-sm font-medium">Gallery</span>
                  </Button>
                </div>
              </label>
            </div>
          ) : (
            <motion.div 
              className="w-full space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 1 },
                y: { duration: 1.1 }
              }}
            >
              {stats && (
                <div className="flex justify-center items-center gap-3 text-sm text-muted-foreground/80 mb-2">
                  <div className="flex items-center gap-1.5">
                    <FileImage className="w-3.5 h-3.5 opacity-70" />
                    <span>{formatFileSize(stats.size)}</span>
                  </div>
                </div>
              )}
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={photo} 
                  alt="Business card preview" 
                  className="w-full h-auto object-contain"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 