"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ImagePlus, FileText, Mic } from 'lucide-react'
import { extractBusinessCard } from '@/actions/extract-business-card'
import { OCRService } from '@/lib/services/ocr-service'
import { processVoiceMemo } from '@/actions/process-voice-memo'

interface FileUpload {
  file: File
  progress: number
  type: 'image' | 'text' | 'audio'
  result?: string  // Add result field for OCR text
}

export default function UploadForm() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleFileSelect = (type: 'image' | 'text' | 'audio') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    
    switch(type) {
      case 'image':
        input.accept = 'image/*'
        break
      case 'text':
        input.accept = '.txt,.doc,.docx,.pdf'
        break
      case 'audio':
        input.accept = 'audio/*'
        break
    }
    
    input.onchange = (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || [])
      const newFiles = selectedFiles.map(file => ({
        file,
        progress: 0,
        type
      }))
      setFiles(prev => [...prev, ...newFiles])
    }
    
    input.click()
  }

  const processFiles = async () => {
    if (files.length === 0) return
    
    setIsProcessing(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      if (file.type === 'image') {
        try {
          const ocrResult = await OCRService.performOCR(file.file);
          
          if (!ocrResult.success) {
            throw new Error(ocrResult.error);
          }

          const response = await extractBusinessCard(ocrResult.text!);
          console.log('Server response:', response);
          
          setFiles(prev => 
            prev.map((f, index) => 
              index === i ? { 
                ...f, 
                progress: 100,
                result: [
                  '=== OCR Raw Output ===',
                  ocrResult.text,
                  '',
                  '=== Structured Data ===',
                  JSON.stringify(response.data, null, 2)
                ].join('\n')
              } : f
            )
          )
        } catch (error) {
          console.error('Error processing image:', error);
          setFiles(prev => 
            prev.map((f, index) => 
              index === i ? { ...f, progress: 100, result: 'Error processing image: ' + (error as Error).message } : f
            )
          )
        }
      } else if (file.type === 'audio') {
        try {
          const formData = new FormData();
          formData.append('file', file.file);
          
          const response = await processVoiceMemo(formData);
          console.log('Voice memo processing response:', response);
          
          setFiles(prev => 
            prev.map((f, index) => 
              index === i ? { 
                ...f, 
                progress: 100,
                result: [
                  '=== Structured Voice Memo Data ===',
                  JSON.stringify(response.data, null, 2)
                ].join('\n')
              } : f
            )
          )
        } catch (error) {
          console.error('Error processing voice memo:', error);
          setFiles(prev => 
            prev.map((f, index) => 
              index === i ? { ...f, progress: 100, result: 'Error processing voice memo: ' + (error as Error).message } : f
            )
          )
        }
      }
      // Handle text files here if needed...
    }
    
    setIsProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <Button 
              className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 flex flex-col items-center justify-center transition-all duration-200"
              onClick={() => handleFileSelect('image')}
              disabled={isProcessing}
            >
              <ImagePlus className="h-12 w-12 mb-3" />
              <span className="text-lg font-medium">Upload Business Card Photos</span>
            </Button>
            <p className="text-sm text-muted-foreground text-center px-2">
              JPG, PNG, GIF, and other image formats
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex flex-col items-center justify-center transition-all duration-200"
              onClick={() => handleFileSelect('text')}
              disabled={isProcessing}
            >
              <FileText className="h-12 w-12 mb-3" />
              <span className="text-lg font-medium">Upload Text Notes</span>
            </Button>
            <p className="text-sm text-muted-foreground text-center px-2">
              TXT, DOC, DOCX, PDF files
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              className="h-32 bg-gradient-to-br from-cyan-400 to-sky-600 hover:from-cyan-500 hover:to-sky-700 flex flex-col items-center justify-center transition-all duration-200"
              onClick={() => handleFileSelect('audio')}
              disabled={isProcessing}
            >
              <Mic className="h-12 w-12 mb-3" />
              <span className="text-lg font-medium">Upload Voice Memos</span>
            </Button>
            <p className="text-sm text-muted-foreground text-center px-2">
              MP3, WAV, M4A, OGG, and other audio formats
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{file.file.name}</span>
                  <span>{file.progress}%</span>
                </div>
                <Progress value={file.progress} />
                {file.result && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                    {file.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={processFiles}
          disabled={isProcessing || files.length === 0}
        >
          {isProcessing ? 'Processing...' : 'Process Data'}
        </Button>
      </CardContent>
    </Card>
  )
} 