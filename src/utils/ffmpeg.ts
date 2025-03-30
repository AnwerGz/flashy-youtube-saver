
import { toast } from "sonner";

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
    if (isCapacitorNative()) {
      // In a real app, we would call the native FFmpeg plugin
      const { FFmpegPlugin } = (window as any).Capacitor.Plugins;
      
      // Subscribe to conversion progress
      FFmpegPlugin.addListener('conversionProgress', (data: { progress: number }) => {
        progressCallback(data.progress);
      });
      
      const result = await FFmpegPlugin.convert({
        inputPath,
        outputPath,
        format,
        quality
      });
      
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
