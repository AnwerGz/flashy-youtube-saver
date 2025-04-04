
import { VideoInfo } from './types';
import { isCapacitorNative, loadYtDlp, addToLogHistory } from './core';
import { getDemoVideoInfo, simulateDownload } from './demo';
import { toast } from 'sonner';
import { createDirectory } from './filesystem';
import { requestStoragePermission } from './permissions';

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
        // In a real app, we would call the native YT-DLP plugin here
        const { YtDlpPlugin } = (window as any).Capacitor.Plugins;
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

// Download video using yt-dlp
export const downloadVideo = async (
  url: string,
  format: string,
  outputPath: string,
  quality: string,
  isAudio: boolean,
  progressCallback: (progress: number) => void
): Promise<boolean> => {
  try {
    let filename = "unknown";
    const startTime = new Date();
    const formattedStartTime = startTime.toLocaleTimeString();
    
    // Determine output path based on file type
    const baseOutputPath = isAudio 
      ? "/storage/emulated/0/Music/Flash YTConverter"
      : "/storage/emulated/0/Movies/Flash YTConverter";
    
    // Use provided outputPath if it's not empty, otherwise use default
    const finalOutputPath = outputPath || baseOutputPath;
    
    addToLogHistory(`Starting download at ${formattedStartTime}`, "info");
    addToLogHistory(`URL: ${url}`, "info");
    addToLogHistory(`Format: ${isAudio ? 'audio' : 'video'} - ${quality}`, "info");
    addToLogHistory(`Output path: ${finalOutputPath}`, "info");
    
    if (!await loadYtDlp()) {
      // Simulate download progress for demo
      return simulateDownload(startTime, progressCallback, isAudio, finalOutputPath);
    } else if (isCapacitorNative()) {
      try {
        // Get references to required Capacitor plugins
        const pluginsAvailable = (window as any).Capacitor?.Plugins || {};
        
        if (!pluginsAvailable.YtDlpPlugin || !pluginsAvailable.Permissions || !pluginsAvailable.Filesystem) {
          toast.error("Required plugins not available");
          addToLogHistory("Required Capacitor plugins not available", "error");
          return false;
        }
        
        const { YtDlpPlugin, Permissions, Filesystem } = pluginsAvailable;
        
        // Request storage permission using Android 13+ compatible approach
        addToLogHistory("Checking storage permissions", "info");
        
        // First, check if we need READ_MEDIA_* permissions (Android 13+) or legacy STORAGE permission
        let isAndroid13Plus = false;
        
        try {
          // Check Android version if available
          const deviceInfo = await pluginsAvailable.Device?.getInfo();
          const androidVersion = deviceInfo?.androidSDKVersion || 0;
          isAndroid13Plus = androidVersion >= 33; // Android 13 is API 33+
          
          addToLogHistory(`Detected Android SDK version: ${androidVersion}`, "info");
        } catch (err) {
          addToLogHistory("Could not detect Android version, using legacy permission model", "warning");
        }
        
        let permissionGranted = false;
        
        if (isAndroid13Plus) {
          // For Android 13+, request specific media permissions
          try {
            addToLogHistory("Requesting Android 13+ specific media permissions", "info");
            
            const result = await Permissions.requestPermissions({
              permissions: ['android.permission.READ_MEDIA_AUDIO', 'android.permission.READ_MEDIA_VIDEO']
            });
            
            // Check if either permission was granted
            const audioGranted = result.permissions['android.permission.READ_MEDIA_AUDIO']?.granted || false;
            const videoGranted = result.permissions['android.permission.READ_MEDIA_VIDEO']?.granted || false;
            
            permissionGranted = audioGranted && videoGranted;
            
            addToLogHistory(`Media permissions granted: ${permissionGranted}`, 
              permissionGranted ? "success" : "warning");
            
          } catch (err) {
            console.error("Error requesting media permissions:", err);
            addToLogHistory(`Error requesting media permissions: ${(err as Error).message}`, "error");
            
            // Fall back to legacy storage permission as backup
            try {
              const legacyResult = await Permissions.requestPermissions({
                permissions: ['storage']
              });
              
              permissionGranted = legacyResult.permissions.storage?.granted || false;
              
              addToLogHistory(`Fallback storage permission granted: ${permissionGranted}`, 
                permissionGranted ? "success" : "warning");
                
            } catch (fallbackErr) {
              addToLogHistory(`Failed to request any storage permissions`, "error");
            }
          }
        } else {
          // For older Android versions, use legacy storage permission
          try {
            addToLogHistory("Requesting legacy storage permission", "info");
            
            const result = await Permissions.requestPermissions({
              permissions: ['storage']
            });
            
            permissionGranted = result.permissions.storage?.granted || false;
            
            addToLogHistory(`Storage permission granted: ${permissionGranted}`, 
              permissionGranted ? "success" : "warning");
              
          } catch (err) {
            console.error("Error requesting storage permission:", err);
            addToLogHistory(`Error requesting storage permission: ${(err as Error).message}`, "error");
          }
        }
        
        if (!permissionGranted) {
          toast.error("Storage permission denied. Cannot download without access to storage.");
          addToLogHistory("Download failed: Storage permission denied", "error");
          return false;
        }
        
        // Ensure the directory exists
        try {
          await createDirectory(finalOutputPath);
        } catch (err) {
          addToLogHistory(`Error creating directory: ${(err as Error).message}. Will attempt to continue.`, "warning");
        }
        
        // Start download with the plugin
        const downloadOptions = {
          url,
          format,
          outputPath: finalOutputPath,
          quality,
          isAudio
        };
        
        // Get filename from info if possible
        try {
          const info = await getVideoInfo(url);
          if (info) {
            filename = info.title.replace(/[^\w\s]/gi, '_');
          }
        } catch (error) {
          console.error("Could not get filename:", error);
          addToLogHistory(`Could not get video title: ${(error as Error).message}. Using default filename.`, "warning");
        }
        
        // Subscribe to download progress
        let progressHandle: any;
        try {
          progressHandle = await YtDlpPlugin.addListener('downloadProgress', (data: { progress: number; message?: string }) => {
            progressCallback(data.progress);
            
            // Log progress at 25%, 50%, 75% and 100%
            if (Math.floor(data.progress) % 25 === 0 && Math.floor(data.progress) > 0) {
              addToLogHistory(`Download progress: ${Math.floor(data.progress)}%`, "info");
            }
            
            // Log ytdlp messages if available
            if (data.message) {
              addToLogHistory(`yt-dlp: ${data.message}`, "info");
            }
          });
        } catch (err) {
          addToLogHistory(`Failed to add progress listener: ${(err as Error).message}. Download will continue without progress updates.`, "warning");
        }
        
        // Start the download
        addToLogHistory("Starting download with yt-dlp...", "info");
        
        try {
          const result = await YtDlpPlugin.download(downloadOptions);
          
          // Remove listener after download completes
          if (progressHandle) {
            await progressHandle.remove();
          }
          
          const endTime = new Date();
          const formattedEndTime = endTime.toLocaleTimeString();
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
          
          if (result.success) {
            const filePath = `${finalOutputPath}/${filename}${isAudio ? '.mp3' : '.mp4'}`;
            addToLogHistory(`Download completed at ${formattedEndTime} (took ${duration} seconds)`, "success");
            addToLogHistory(`File saved to: ${filePath}`, "success");
            toast.success(`Download completed! File saved to: ${filePath}`);
            return true;
          } else {
            addToLogHistory(`Download failed at ${formattedEndTime}`, "error");
            if (result.error) {
              addToLogHistory(`Error: ${result.error}`, "error");
            }
            toast.error("Download failed");
            return false;
          }
        } catch (err) {
          console.error("Download operation error:", err);
          addToLogHistory(`Download operation error: ${(err as Error).message}`, "error");
          toast.error("Download failed due to an error");
          
          // Remove listener if still active
          if (progressHandle) {
            try {
              await progressHandle.remove();
            } catch (cleanupErr) {
              // Ignore cleanup errors
            }
          }
          
          return false;
        }
      } catch (err) {
        console.error("General download error:", err);
        addToLogHistory(`General download error: ${(err as Error).message}`, "error");
        toast.error("Download process failed");
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error downloading video:", error);
    toast.error("Download failed");
    addToLogHistory("Download failed: " + (error as Error).message, "error");
    return false;
  }
};
