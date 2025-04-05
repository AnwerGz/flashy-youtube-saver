
import { VideoInfo } from './types';
import { isCapacitorNative, loadYtDlp, addToLogHistory } from './core';
import { getDemoVideoInfo, simulateDownload } from './demo';
import { toast } from 'sonner';
import { createDirectory } from './filesystem';
import { requestStoragePermission } from './permissions';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

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
        // Check if required plugins are available
        if (!Capacitor.isPluginAvailable('YtDlpPlugin') || 
            !Capacitor.isPluginAvailable('Permissions') || 
            !Capacitor.isPluginAvailable('Filesystem')) {
          toast.error("Required plugins not available");
          addToLogHistory("Required Capacitor plugins not available", "error");
          return false;
        }
        
        // Request storage permission
        addToLogHistory("Checking storage permissions", "info");
        const permissionGranted = await requestStoragePermission();
        
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
        
        const YtDlpPlugin = registerPlugin<YtDlpPluginPlugin>('YtDlpPlugin');
        
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
        
        // Start download with the plugin
        const downloadOptions = {
          url,
          format,
          outputPath: finalOutputPath,
          quality,
          isAudio
        };
        
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
            addToLogHistory(`Download completed at ${formattedEndTime} (took ${duration}s)`, "success");
            addToLogHistory(`File saved to: ${filePath}`, "success");
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
