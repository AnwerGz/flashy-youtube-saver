
import { isCapacitorNative, addToLogHistory } from './core';
import { toast } from 'sonner';

// Request storage permission for Android
export const requestStoragePermission = async (): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      addToLogHistory("Requesting storage permissions", "info");
      
      const pluginsAvailable = (window as any).Capacitor?.Plugins || {};
      if (!pluginsAvailable.Permissions) {
        addToLogHistory("Permissions plugin not available. Using demo mode.", "warning");
        return true; // Return true in demo mode
      }
      
      const { Permissions } = pluginsAvailable;
      
      // First, try to determine Android version
      let isAndroid13Plus = false;
      
      try {
        if (pluginsAvailable.Device) {
          const deviceInfo = await pluginsAvailable.Device.getInfo();
          const androidVersion = deviceInfo?.androidSDKVersion || 0;
          isAndroid13Plus = androidVersion >= 33; // Android 13 is API 33+
          
          addToLogHistory(`Detected Android SDK version: ${androidVersion}`, "info");
        }
      } catch (err) {
        addToLogHistory("Could not detect Android version, using legacy permission model", "warning");
      }
      
      let permissionResult;
      
      if (isAndroid13Plus) {
        // For Android 13+, we need specific media permissions
        addToLogHistory("Requesting Android 13+ specific media permissions", "info");
        
        try {
          permissionResult = await Permissions.requestPermissions({
            permissions: ['android.permission.READ_MEDIA_AUDIO', 'android.permission.READ_MEDIA_VIDEO', 'android.permission.READ_MEDIA_IMAGES']
          });
          
          // Check if the required permissions were granted
          const audioGranted = permissionResult.permissions['android.permission.READ_MEDIA_AUDIO']?.granted || false;
          const videoGranted = permissionResult.permissions['android.permission.READ_MEDIA_VIDEO']?.granted || false;
          
          const granted = audioGranted && videoGranted;
          
          addToLogHistory(`Media permissions request result: ${granted ? "granted" : "denied"}`, 
            granted ? "success" : "warning");
            
          return granted;
        } catch (err) {
          addToLogHistory(`Error requesting Android 13+ permissions: ${(err as Error).message}. Trying legacy permission.`, "warning");
          
          // Fall back to legacy permission
          try {
            permissionResult = await Permissions.requestPermissions({
              permissions: ['storage']
            });
            
            const granted = permissionResult.permissions.storage?.granted || false;
            
            addToLogHistory(`Fallback storage permission result: ${granted ? "granted" : "denied"}`, 
              granted ? "success" : "warning");
              
            return granted;
          } catch (fallbackErr) {
            addToLogHistory(`Failed to request any permissions: ${(fallbackErr as Error).message}`, "error");
            return false;
          }
        }
      } else {
        // For pre-Android 13 devices
        addToLogHistory("Requesting standard storage permission", "info");
        
        try {
          permissionResult = await Permissions.requestPermissions({
            permissions: ['storage']
          });
          
          // Check if permissions were granted
          const granted = permissionResult.permissions.storage?.granted || false;
          
          addToLogHistory(`Storage permission request result: ${granted ? "granted" : "denied"}`, 
            granted ? "success" : "warning");
            
          return granted;
        } catch (err) {
          addToLogHistory(`Error requesting storage permission: ${(err as Error).message}`, "error");
          return false;
        }
      }
    } catch (error) {
      console.error("Error in requestStoragePermission:", error);
      addToLogHistory("Error requesting storage permission: " + (error as Error).message, "error");
      return false;
    }
  }
  
  // In browser or if Capacitor isn't available, assume it's granted
  addToLogHistory("Browser environment, assuming storage permission granted", "info");
  return true;
};
