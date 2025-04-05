
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

// Check if we're running in a Capacitor environment
export const isCapacitorNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Create log history methods
export const addToLogHistory = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
  try {
    const storageKey = 'flash_converter_logs';
    const stored = localStorage.getItem(storageKey);
    const logs = stored ? JSON.parse(stored) : [];
    
    logs.push({
      timestamp: new Date().toISOString(),
      message,
      type
    });
    
    localStorage.setItem(storageKey, JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to add to log history:", error);
  }
};

// Load the YTDLP plugin if in Capacitor environment
export const loadYtDlp = async (): Promise<boolean> => {
  try {
    if (isCapacitorNative()) {
      // Capacitor environment - check if YtDlpPlugin is available
      console.log("Running in Capacitor environment");
      
      // Check if the plugin is registered
      if (!Capacitor.isPluginAvailable('YtDlpPlugin')) {
        console.log("YtDlpPlugin not available, running in demo mode");
        addToLogHistory("YtDlp plugin not detected. Running in demo mode.", "warning");
        return false;
      }
      
      return true;
    } else {
      // Browser environment - not fully supported
      console.log("Running in browser environment");
      addToLogHistory("Running in browser environment. Full functionality requires the mobile app", "warning");
      return false;
    }
  } catch (error) {
    console.error("Failed to load yt-dlp:", error);
    addToLogHistory("Failed to initialize download engine: " + (error as Error).message, "error");
    return false;
  }
};
