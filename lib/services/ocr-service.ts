"use client"

import { createWorker, PSM } from 'tesseract.js';

/**
 * Interface defining the structure of OCR processing results
 * success: Whether the OCR operation completed successfully
 * text: The extracted text (if successful)
 * error: Error message (if unsuccessful)
 */
interface OCRResult {
  success: boolean;
  text?: string;
  error?: string;
}

export class OCRService {
  /**
   * Preprocesses an image to improve OCR accuracy by:
   * 1. Converting the image to grayscale
   * 2. Applying binary thresholding (black and white)
   * 3. Increasing contrast
   * 
   * @param file - The image file to process
   * @returns Promise containing the processed image as a base64 data URL
   */
  private static async preprocessImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for image manipulation
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Draw original image to canvas
            ctx.drawImage(img, 0, 0);
            
            // Get pixel data for processing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Apply binary thresholding
            // Convert each pixel to either pure black or pure white
            // This helps Tesseract better distinguish text from background
            for (let i = 0; i < data.length; i += 4) {
              // Give more weight to blue channel for blue text
              const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
              data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0;
            }
            
            // Update canvas with processed image
            ctx.putImageData(imageData, 0, 0);
          }
          
          resolve(canvas.toDataURL());
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Performs OCR on an image file using Tesseract.js
   * Includes preprocessing for better accuracy
   * 
   * @param file - The image file to process
   * @returns Promise containing the OCR result
   */
  public static async performOCR(file: File): Promise<OCRResult> {
    try {
      console.log('Starting image processing:', file.name);

      // Apply image preprocessing to improve OCR accuracy
      const processedImageUrl = await this.preprocessImage(file);
      console.log('Image preprocessed');

      // Initialize Tesseract worker with English language
      const worker = await createWorker('eng');
      console.log('Worker created');

      // Configure Tesseract to treat the image as a single block of text
      // This is optimal for business cards which typically have distinct text blocks
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      
      console.log('Starting OCR...');
      const result = await worker.recognize(processedImageUrl);
      console.log('OCR completed');
      
      // Clean up worker resources
      await worker.terminate();

      // Validate that text was actually extracted
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