"use client"

import { useState, useEffect } from "react"
import { X, Camera, FileImage, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PhotoStats {
  size: number
  name: string
}

interface PhotoCaptureProps {
  onCapture: (file: File | File[] | null) => void
  isBulkMode?: boolean
}

export default function PhotoCapture({ onCapture, isBulkMode = false }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const [stats, setStats] = useState<{ size: number } | null>(null)
  const [photos, setPhotos] = useState<string[]>([])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (isBulkMode) {
      // Handle multiple files
      const imageUrls = files.map(file => URL.createObjectURL(file))
      setPhotos(imageUrls)
      onCapture(files)
    } else {
      // Handle single file
      const file = files[0]
      const imageUrl = URL.createObjectURL(file)
      setPhoto(imageUrl)
      setStats({ size: file.size })
      onCapture(file)
    }
  }

  const handleReset = () => {
    if (isBulkMode) {
      photos.forEach(url => URL.revokeObjectURL(url))
      setPhotos([])
      onCapture([])
    } else {
      if (photo) URL.revokeObjectURL(photo)
      setPhoto(undefined)
      setStats(null)
      onCapture(null)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup URLs on unmount
      if (isBulkMode) {
        photos.forEach(url => URL.revokeObjectURL(url))
      } else if (photo) {
        URL.revokeObjectURL(photo)
      }
    }
  }, [photo, photos, isBulkMode])

  return (
    <div className="w-full">
      {!photo && photos.length === 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Camera capture button */}
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
              "bg-purple-100 dark:bg-purple-900/30"
            )}>
              <Button 
                size="lg"
                variant="default"
                className={cn(
                  "h-full w-full rounded-xl transition-all duration-300 hover:scale-105",
                  "bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center justify-center gap-2 py-4"
                )}
                onClick={() => document.getElementById('camera-input')?.click()}
                type="button"
              >
                <Camera className="w-6 h-6" />
                <span className="text-sm font-medium">Camera</span>
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
              multiple={isBulkMode}
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
                <span className="text-sm font-medium">{isBulkMode ? 'Select Multiple' : 'Gallery'}</span>
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
          {isBulkMode ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{photos.length} business cards selected</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleReset}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-[3/2]">
                    <img 
                      src={url} 
                      alt={`Business card ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </motion.div>
      )}
    </div>
  )
} 