
import { isCapacitorNative, addToLogHistory } from './core';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

// Request storage permission for Android
export const requestStoragePermission = async (): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      addToLogHistory("Requesting storage permissions", "info");
      
      // Check if we can access Permissions through Capacitor
      if (!Capacitor.isPluginAvailable('Permissions')) {
        addToLogHistory("Permissions plugin not available. Using demo mode.", "warning");
        return true; // Return true in demo mode
      }
      
      // First, try to determine Android version
      let isAndroid13Plus = false;
      
      try {
        const deviceInfo = Capacitor.getPlatform();
        const androidVersion = deviceInfo === 'android' ? '13' : '0'; // Simplified version detection
        isAndroid13Plus = parseInt(androidVersion) >= 13; // Android 13+
        
        addToLogHistory(`Detected platform: ${deviceInfo}`, "info");
      } catch (err) {
        addToLogHistory("Could not detect device platform, using legacy permission model", "warning");
      }
      
      let permissionResult;
      
      if (isAndroid13Plus) {
        // For Android 13+, we need specific media permissions
        addToLogHistory("Requesting Android 13+ specific media permissions", "info");
        
        try {
          // Use dynamic plugin import when needed
          const Permissions = registerPlugin('Permissions');
          permissionResult = await Permissions.query({
            name: 'android.permission.READ_MEDIA_AUDIO' as any
          });
          const audioResult = permissionResult.state === 'granted';
          
          permissionResult = await Permissions.query({
            name: 'android.permission.READ_MEDIA_VIDEO' as any
          });
          const videoResult = permissionResult.state === 'granted';
          
          if (!audioResult || !videoResult) {
            const results = await Permissions.requestPermissions({
              permissions: [
                'android.permission.READ_MEDIA_AUDIO',
                'android.permission.READ_MEDIA_VIDEO'
              ] as any
            });
            
            // Check if the required permissions were granted
            const audioGranted = results.permissions['android.permission.READ_MEDIA_AUDIO'].state === 'granted';
            const videoGranted = results.permissions['android.permission.READ_MEDIA_VIDEO'].state === 'granted';
            
            const granted = audioGranted && videoGranted;
            
            addToLogHistory(`Media permissions request result: ${granted ? "granted" : "denied"}`, 
              granted ? "success" : "warning");
              
            return granted;
          }
          return true;
        } catch (err) {
          addToLogHistory(`Error requesting Android 13+ permissions: ${(err as Error).message}. Trying legacy permission.`, "warning");
          
          // Fall back to legacy permission
          try {
            const Permissions = registerPlugin('Permissions');
            permissionResult = await Permissions.query({ name: 'storage' });
            
            if (permissionResult.state !== 'granted') {
              const result = await Permissions.requestPermissions({ permissions: ['storage'] });
              const granted = result.permissions.storage.state === 'granted';
              
              addToLogHistory(`Fallback storage permission result: ${granted ? "granted" : "denied"}`, 
                granted ? "success" : "warning");
                
              return granted;
            }
            return true;
          } catch (fallbackErr) {
            addToLogHistory(`Failed to request any permissions: ${(fallbackErr as Error).message}`, "error");
            return false;
          }
        }
      } else {
        // For pre-Android 13 devices
        addToLogHistory("Requesting standard storage permission", "info");
        
        try {
          const Permissions = registerPlugin('Permissions');
          permissionResult = await Permissions.query({ name: 'storage' });
          
          if (permissionResult.state !== 'granted') {
            const result = await Permissions.requestPermissions({ permissions: ['storage'] });
            const granted = result.permissions.storage.state === 'granted';
            
            addToLogHistory(`Storage permission request result: ${granted ? "granted" : "denied"}`, 
              granted ? "success" : "warning");
              
            return granted;
          }
          return true;
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
