
// Re-export all functions from the modules
export * from './types';
export * from './core';
export * from './permissions';
export * from './filesystem';
export * from './videoOperations';

// Initialize default directories when the app is first opened
import { isCapacitorNative, addToLogHistory } from './core';
import { requestStoragePermission } from './permissions';
import { createDirectory } from './filesystem';

export const initializeDefaultDirectories = async (): Promise<void> => {
  if (isCapacitorNative()) {
    try {
      const initialized = localStorage.getItem('directories_initialized');
      if (!initialized) {
        addToLogHistory("Initializing default directories for first app launch", "info");
        
        // Request permissions first
        const permissionGranted = await requestStoragePermission();
        
        if (permissionGranted) {
          // Create default directories
          await createDirectory("/storage/emulated/0/Music/Flash YTConverter");
          await createDirectory("/storage/emulated/0/Movies/Flash YTConverter");
          
          // Mark as initialized
          localStorage.setItem('directories_initialized', 'true');
          addToLogHistory("Default directories successfully initialized", "success");
        } else {
          addToLogHistory("Could not initialize directories: Permission denied", "warning");
        }
      }
    } catch (error) {
      console.error("Error initializing default directories:", error);
      addToLogHistory("Error initializing default directories: " + (error as Error).message, "error");
    }
  }
};
