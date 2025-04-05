
import { toast } from "sonner";
import { requestStoragePermission } from "./ytdlp"; 
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

// Check if we're running in a Capacitor environment
const isCapacitorNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Convert between formats using FFmpeg
export const convertMedia = async (
  inputPath: string,
  outputPath: string,
  format: string,
  quality: string,
  progressCallback: (progress: number) => void
): Promise<boolean> => {
  try {
    // First check if we have storage permission
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      toast.error("Storage permission is required for conversion");
      return false;
    }

    if (isCapacitorNative()) {
      if (!Capacitor.isPluginAvailable('FFmpegPlugin')) {
        // Simulate conversion progress for demo
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          progressCallback(Math.min(progress, 100));
          if (progress >= 100) {
            clearInterval(interval);
            toast.success(`Conversion completed! (Demo mode)`);
          }
        }, 300);
        return true;
      }
      
      // In a real app with the plugin registered
      const FFmpegPlugin = registerPlugin('FFmpegPlugin');
      
      // Subscribe to conversion progress
      const handle = await FFmpegPlugin.addListener('conversionProgress', (data: { progress: number }) => {
        progressCallback(data.progress);
      });
      
      const result = await FFmpegPlugin.convert({
        inputPath,
        outputPath,
        format,
        quality
      });
      
      // Remove listener after conversion completes
      await handle.remove();
      
      return result.success;
    } else {
      // Simulate conversion progress for demo
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progressCallback(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);
          toast.success(`Conversion completed! (Demo mode)`);
        }
      }, 300);
      return true;
    }
  } catch (error) {
    console.error("Error converting media:", error);
    toast.error("Conversion failed");
    return false;
  }
};

// Check if FFmpeg is installed and available
export const checkFFmpegAvailability = async (): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      return Capacitor.isPluginAvailable('FFmpegPlugin');
    } catch (error) {
      console.error("Error checking FFmpeg availability:", error);
      return false;
    }
  }
  // In browser, we'll assume it's not available
  return false;
};
