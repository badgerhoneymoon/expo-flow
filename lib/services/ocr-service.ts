"use client"

import { createWorker, PSM } from 'tesseract.js';

interface OCRResult {
  success: boolean;
  text?: string;
  error?: string;
}

export class OCRService {
  private static async preprocessImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Draw original image
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Convert to grayscale and increase contrast
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              // Increase contrast
              data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0;
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          
          resolve(canvas.toDataURL());
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  public static async performOCR(file: File): Promise<OCRResult> {
    try {
      console.log('Starting image processing:', file.name);

      // Preprocess image
      const processedImageUrl = await this.preprocessImage(file);
      console.log('Image preprocessed');

      const worker = await createWorker('eng');
      console.log('Worker created');

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      
      console.log('Starting OCR...');
      const result = await worker.recognize(processedImageUrl);
      console.log('OCR completed');
      
      await worker.terminate();

      if (!result.data.text) {
        throw new Error('No text extracted from image');
      }

      return {
        success: true,
        text: result.data.text
      };

    } catch (error) {
      console.error('OCR Error:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
} 