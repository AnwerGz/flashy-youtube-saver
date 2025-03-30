
import { toast } from "sonner";
import { requestStoragePermission } from "./ytdlp"; 

// Check if we're running in a Capacitor environment
const isCapacitorNative = (): boolean => {
  return typeof (window as any).Capacitor !== 'undefined';
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
      // In a real app, we would call the native FFmpeg plugin
      const { FFmpegPlugin } = (window as any).Capacitor.Plugins;
      
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
      const { FFmpegPlugin } = (window as any).Capacitor.Plugins;
      // We would need to add a method to check FFmpeg availability in the native plugin
      // For now, we'll assume it's available if the plugin exists
      return typeof FFmpegPlugin !== 'undefined';
    } catch (error) {
      console.error("Error checking FFmpeg availability:", error);
      return false;
    }
  }
  // In browser, we'll assume it's not available
  return false;
};
