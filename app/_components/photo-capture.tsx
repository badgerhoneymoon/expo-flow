"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function PhotoCapture() {
  const [photo, setPhoto] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className={cn(
        "relative p-6 rounded-xl border-2 border-dashed",
        "bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm",
        photo ? "border-indigo-500" : "border-gray-200 dark:border-gray-800"
      )}>
        <AnimatePresence mode="wait">
          {photo ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-[1.6] w-full"
            >
              <img 
                src={photo} 
                alt="Business card preview" 
                className="rounded-lg object-contain w-full h-full"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => setPhoto(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Take a photo or upload a business card
                </p>
              </div>
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="outline"
                    className="gap-2"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4" />
                      Add Photo
                    </span>
                  </Button>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 