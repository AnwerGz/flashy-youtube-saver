
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
import { addToLogHistory } from './core';

// Request storage permission from the user
export const requestStoragePermission = async (): Promise<boolean> => {
  try {
    // Check if we're in a browser
    if (!Capacitor.isNativePlatform()) {
      // In the browser, we'll simulate permission granted
      addToLogHistory("Browser environment, simulating permission granted", "info");
      return true;
    }

    if (!Capacitor.isPluginAvailable('Permissions')) {
      addToLogHistory("Permissions plugin not available", "warning");
      return false;
    }

    // Check Android version to determine which permissions to request
    const platform = Capacitor.getPlatform();
    const isAndroid = platform === 'android';
    let androidVersion = 0;

    if (isAndroid) {
      try {
        // Get device info
        const deviceInfo = { androidSDKVersion: 0 }; // Fallback value
        androidVersion = deviceInfo.androidSDKVersion;
      } catch (error) {
        // If we can't get the version, assume a recent Android version
        androidVersion = 33; // Fallback to Android 13
      }
    }

    // First check current permission status
    const Permissions = registerPlugin<PermissionsPlugin>('Permissions');
    
    if (isAndroid) {
      if (androidVersion >= 33) {
        // Android 13+ (API 33+) uses granular media permissions
        const mediaAudioStatus = await Permissions.query({
          name: 'android.permission.READ_MEDIA_AUDIO'
        });
        
        const mediaVideoStatus = await Permissions.query({
          name: 'android.permission.READ_MEDIA_VIDEO'
        });
        
        // If both permissions are already granted, return true
        if (mediaAudioStatus.state === 'granted' && mediaVideoStatus.state === 'granted') {
          addToLogHistory("Media permissions already granted", "success");
          return true;
        }
        
        // Request the granular media permissions
        const result = await Permissions.requestPermissions({
          permissions: [
            'android.permission.READ_MEDIA_AUDIO',
            'android.permission.READ_MEDIA_VIDEO'
          ]
        });
        
        // Check if both permissions were granted
        const audioGranted = result.permissions['android.permission.READ_MEDIA_AUDIO'].state === 'granted';
        const videoGranted = result.permissions['android.permission.READ_MEDIA_VIDEO'].state === 'granted';
        
        const allGranted = audioGranted && videoGranted;
        
        if (allGranted) {
          addToLogHistory("All media permissions granted", "success");
        } else {
          addToLogHistory("Some media permissions were denied", "warning");
        }
        
        return allGranted;
      } else {
        // Android 12 and below uses storage permission
        const storageStatus = await Permissions.query({
          name: 'android.permission.WRITE_EXTERNAL_STORAGE'
        });
        
        if (storageStatus.state === 'granted') {
          addToLogHistory("Storage permission already granted", "success");
          return true;
        }
        
        // Request storage permission
        const result = await Permissions.requestPermissions({
          permissions: [
            'android.permission.READ_EXTERNAL_STORAGE',
            'android.permission.WRITE_EXTERNAL_STORAGE'
          ]
        });
        
        const writeGranted = result.permissions['android.permission.WRITE_EXTERNAL_STORAGE'].state === 'granted';
        
        if (writeGranted) {
          addToLogHistory("Storage permission granted", "success");
        } else {
          addToLogHistory("Storage permission denied", "warning");
        }
        
        return writeGranted;
      }
    } else if (platform === 'ios') {
      // iOS doesn't need explicit storage permission for most operations
      addToLogHistory("iOS doesn't require explicit storage permission for app directory", "info");
      return true;
    }
    
    // Default to granted in unsupported platforms
    return true;
  } catch (error) {
    console.error("Error requesting storage permission:", error);
    addToLogHistory("Error requesting permission: " + (error as Error).message, "error");
    return false;
  }
};
