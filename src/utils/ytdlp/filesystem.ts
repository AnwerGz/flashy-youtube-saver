
import { isCapacitorNative, addToLogHistory } from './core';
import { Capacitor } from '@capacitor/core';

// Create directories for output
export const createDirectory = async (path: string): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      if (!Capacitor.Plugins.Filesystem) {
        addToLogHistory("Filesystem plugin not available. Using demo mode.", "warning");
        return true; // Return true in demo mode
      }
      
      const { Filesystem } = Capacitor.Plugins;
      addToLogHistory(`Creating directory: ${path}`, "info");
      
      try {
        await Filesystem.mkdir({
          path: path,
          recursive: true
        });
        
        addToLogHistory(`Successfully created directory: ${path}`, "success");
        return true;
      } catch (err: any) {
        // Check if directory exists error (common error code when directory already exists)
        if (err.message && (
            err.message.includes('exists') || 
            err.message.includes('EEXIST') || 
            err.code === 'EEXIST' || 
            err.code === 'ERROR_DIRECTORY_EXISTS')
          ) {
          addToLogHistory(`Directory already exists: ${path}`, "info");
          return true;
        }
        
        // Other error
        console.error("Error creating directory:", err);
        addToLogHistory(`Error creating directory: ${path}: ${err.message}`, "error");
        return false;
      }
    } catch (error) {
      console.error("Error in createDirectory:", error);
      addToLogHistory("Error accessing filesystem: " + (error as Error).message, "error");
      return false;
    }
  }
  
  // In browser environment
  addToLogHistory("Browser environment, skipping directory creation", "info");
  return true;
};

// List available storage directories
export const listDirectories = async (): Promise<string[]> => {
  if (isCapacitorNative()) {
    try {
      if (!Capacitor.Plugins.Filesystem) {
        addToLogHistory("Filesystem plugin not available. Using demo mode.", "warning");
        return ["Downloads", "Movies", "Music"]; // Return demo directories
      }
      
      const { Filesystem } = Capacitor.Plugins;
      addToLogHistory("Listing available directories", "info");
      
      try {
        // Try to list top-level directories
        const result = await Filesystem.readdir({
          path: "/"
        });
        
        addToLogHistory(`Found ${result.files.length} directories`, "info");
        return result.files;
      } catch (err) {
        // If we can't access root, try common Android directories
        addToLogHistory(`Could not list directories: ${(err as Error).message}. Returning default options.`, "warning");
        
        // Return common Android directories
        return [
          "/storage/emulated/0/Download",
          "/storage/emulated/0/Music",
          "/storage/emulated/0/Movies",
          "/storage/emulated/0/DCIM"
        ];
      }
    } catch (error) {
      console.error("Error listing directories:", error);
      addToLogHistory("Error listing directories: " + (error as Error).message, "error");
      return ["Downloads"];
    }
  }
  return ["Downloads", "Movies", "Music"];
};
