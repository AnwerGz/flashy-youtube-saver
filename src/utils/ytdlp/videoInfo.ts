
import { VideoInfo } from './types';
import { isCapacitorNative, loadYtDlp, addToLogHistory } from './core';
import { getDemoVideoInfo } from './demo';
import { toast } from 'sonner';
import { Capacitor, registerPlugin } from '@capacitor/core';

// Extract video information using yt-dlp
export const getVideoInfo = async (url: string): Promise<VideoInfo | null> => {
  try {
    addToLogHistory(`Getting video info for: ${url}`, "info");
    
    if (!await loadYtDlp()) {
      // Create a mock response for demo purposes
      addToLogHistory("Using demo mode for video info", "info");
      return getDemoVideoInfo(url);
    } else if (isCapacitorNative()) {
      try {
        // Call the native YT-DLP plugin
        if (!Capacitor.isPluginAvailable('YtDlpPlugin')) {
          throw new Error("YtDlpPlugin not available");
        }
        
        const YtDlpPlugin = registerPlugin<YtDlpPluginPlugin>('YtDlpPlugin');
        addToLogHistory("Calling native YT-DLP plugin for video info", "info");
        
        const result = await YtDlpPlugin.getVideoInfo({ url });
        addToLogHistory("Successfully retrieved video info", "success");
        return result.info;
      } catch (error) {
        console.error("Error from YtDlpPlugin.getVideoInfo:", error);
        addToLogHistory(`Plugin error: ${(error as Error).message}`, "error");
        throw error;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting video info:", error);
    toast.error("Failed to get video information");
    addToLogHistory("Failed to get video info: " + (error as Error).message, "error");
    return null;
  }
};
