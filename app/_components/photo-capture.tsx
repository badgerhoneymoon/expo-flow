"use client"

import { useState } from "react"
import { Upload, X, Camera } from "lucide-react"
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
    <div className="space-y-8">
      <motion.div 
        layout
        className={cn(
          "relative flex flex-col items-center p-8 rounded-xl bg-white/50 dark:bg-gray-950/50 border shadow-xl backdrop-blur-sm",
          "transition-all duration-500 ease-in-out",
          photo ? "min-h-[240px]" : "min-h-[160px]"
        )}
      >
        <motion.div layout className="relative w-full flex flex-col items-center">
          {!photo ? (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className={cn(
                "p-8 rounded-2xl transition-colors duration-200",
                "bg-emerald-100 dark:bg-emerald-900/30"
              )}>
                <Button 
                  size="lg"
                  variant="default"
                  className={cn(
                    "h-16 w-16 rounded-xl transition-all duration-300 hover:scale-105",
                    "bg-emerald-500 hover:bg-emerald-600 text-white"
                  )}
                  asChild
                >
                  <span>
                    <Camera className="w-6 h-6" />
                  </span>
                </Button>
              </div>
            </label>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
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
                  onClick={() => setPhoto(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
} 