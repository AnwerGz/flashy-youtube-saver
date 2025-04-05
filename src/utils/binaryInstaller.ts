
import { Capacitor, registerPlugin } from '@capacitor/core';
import { toast } from 'sonner';
import { addToLogHistory } from './ytdlp/core';

export const initializeBinaries = async (): Promise<boolean> => {
  try {
    if (Capacitor.isNativePlatform()) {
      addToLogHistory("Checking binary installation", "info");
      
      if (!Capacitor.isPluginAvailable('BinaryInstaller')) {
        addToLogHistory("BinaryInstaller plugin not available", "error");
        toast.error("Binary installer plugin not available");
        return false;
      }
      
      const BinaryInstaller = registerPlugin<BinaryInstallerPlugin>('BinaryInstaller');
      
      // Check if binaries are already installed
      const checkResult = await BinaryInstaller.isInstalled();
      
      if (checkResult.installed) {
        addToLogHistory("Binary files already installed", "info");
        return true;
      }
      
      // Copy binaries from assets to app's private directory
      addToLogHistory("Installing binary files", "info");
      const result = await BinaryInstaller.copyBinaries();
      
      if (result.success) {
        addToLogHistory("Binary files successfully installed", "success");
        toast.success("Binary files installed successfully");
        return true;
      } else {
        addToLogHistory(`Failed to install binary files: ${result.message}`, "error");
        toast.error("Failed to install binary files");
        return false;
      }
    }
    
    // For web or non-native environments
    addToLogHistory("Running in browser environment, binary installation skipped", "info");
    return true;
  } catch (error) {
    console.error("Error initializing binaries:", error);
    addToLogHistory(`Error initializing binaries: ${(error as Error).message}`, "error");
    toast.error("Error initializing binary files");
    return false;
  }
};
