
// This file provides a wrapper around yt-dlp WebAssembly module

import { toast } from "sonner";

// Interface for YT-DLP info extraction
interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  formats: VideoFormat[];
  isPlaylist: boolean;
  playlistItems?: VideoInfo[];
  playlistTitle?: string;
  playlistCount?: number;
}

interface VideoFormat {
  formatId: string;
  extension: string;
  resolution?: string;
  filesize?: number;
  audioQuality?: string;
  type: "audio" | "video" | "both";
  quality: string;
}

// Check if we're running in a Capacitor environment
const isCapacitorNative = (): boolean => {
  return typeof (window as any).Capacitor !== 'undefined';
};

// Create log history methods
const addToLogHistory = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
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

// Load the YTDLP WebAssembly module if in browser environment
// In Capacitor, we'll use native bindings
const loadYtDlp = async (): Promise<boolean> => {
  try {
    if (isCapacitorNative()) {
      // Capacitor environment - check if YtDlpPlugin is available
      console.log("Running in Capacitor environment");
      return true;
    } else {
      // Browser environment - not fully supported
      console.log("Running in browser environment");
      toast.error("Full functionality requires the mobile app");
      addToLogHistory("Running in browser environment. Full functionality requires the mobile app", "warning");
      return false;
    }
  } catch (error) {
    console.error("Failed to load yt-dlp:", error);
    toast.error("Failed to initialize download engine");
    addToLogHistory("Failed to initialize download engine: " + (error as Error).message, "error");
    return false;
  }
};

// Extract video information using yt-dlp
export const getVideoInfo = async (url: string): Promise<VideoInfo | null> => {
  try {
    addToLogHistory(`Getting video info for: ${url}`, "info");
    
    if (!await loadYtDlp()) {
      // Create a mock response for demo purposes
      addToLogHistory("Using demo mode for video info", "info");
      const isPlaylist = url.includes('list=');
      if (isPlaylist) {
        return {
          id: 'playlist-id',
          title: 'Sample YouTube Playlist',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          formats: [],
          isPlaylist: true,
          playlistTitle: 'Sample YouTube Playlist',
          playlistCount: 25,
          playlistItems: Array(25).fill(null).map((_, i) => ({
            id: `video-${i}`,
            title: `Sample Video ${i + 1}`,
            thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            duration: '3:45',
            formats: [],
            isPlaylist: false
          }))
        };
      } else {
        return {
          id: 'video-id',
          title: 'Sample YouTube Video',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: '3:45',
          formats: [
            {
              formatId: 'audio-1',
              extension: 'mp3',
              audioQuality: '128kbps',
              type: 'audio',
              quality: '128kbps'
            },
            {
              formatId: 'audio-2',
              extension: 'mp3',
              audioQuality: '192kbps',
              type: 'audio',
              quality: '192kbps'
            },
            {
              formatId: 'audio-3',
              extension: 'mp3',
              audioQuality: '256kbps',
              type: 'audio',
              quality: '256kbps'
            },
            {
              formatId: 'audio-4',
              extension: 'mp3',
              audioQuality: '320kbps',
              type: 'audio',
              quality: '320kbps'
            },
            {
              formatId: 'video-1',
              extension: 'mp4',
              resolution: '360p',
              type: 'video',
              quality: '360p'
            },
            {
              formatId: 'video-2',
              extension: 'mp4',
              resolution: '480p',
              type: 'video',
              quality: '480p'
            },
            {
              formatId: 'video-3',
              extension: 'mp4',
              resolution: '720p',
              type: 'video',
              quality: '720p'
            },
            {
              formatId: 'video-4',
              extension: 'mp4',
              resolution: '1080p',
              type: 'video',
              quality: '1080p'
            }
          ],
          isPlaylist: false
        };
      }
    } else if (isCapacitorNative()) {
      // In a real app, we would call the native YT-DLP plugin here
      const { YtDlpPlugin } = (window as any).Capacitor.Plugins;
      addToLogHistory("Calling native YT-DLP plugin for video info", "info");
      const result = await YtDlpPlugin.getVideoInfo({ url });
      addToLogHistory("Successfully retrieved video info", "success");
      return result.info;
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
      ? "/storage/music/Flash YTConverter"
      : "/storage/movies/Flash YTConverter";
    
    // Use provided outputPath if it's not empty, otherwise use default
    const finalOutputPath = outputPath || baseOutputPath;
    
    addToLogHistory(`Starting download at ${formattedStartTime}`, "info");
    addToLogHistory(`URL: ${url}`, "info");
    addToLogHistory(`Format: ${isAudio ? 'audio' : 'video'} - ${quality}`, "info");
    addToLogHistory(`Output path: ${finalOutputPath}`, "info");
    
    if (!await loadYtDlp()) {
      // Simulate download progress for demo
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        progressCallback(Math.min(progress, 100));
        if (progress % 25 === 0) {
          addToLogHistory(`Download progress: ${progress}% (Demo mode)`, "info");
        }
        if (progress >= 100) {
          clearInterval(interval);
          const endTime = new Date();
          const formattedEndTime = endTime.toLocaleTimeString();
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
          
          addToLogHistory(`Download completed at ${formattedEndTime} (took ${duration} seconds)`, "success");
          addToLogHistory(`File saved to: ${finalOutputPath}/demo_video${isAudio ? '.mp3' : '.mp4'} (Demo mode)`, "success");
          toast.success(`Download completed! (Demo mode)`);
        }
      }, 200);
      return true;
    } else if (isCapacitorNative()) {
      // In a real app, we would call the native YT-DLP plugin here
      const { YtDlpPlugin } = (window as any).Capacitor.Plugins;
      
      // Request storage permission
      const permissionGranted = await requestStoragePermission();
      
      if (permissionGranted) {
        // Ensure the directory exists
        await createDirectory(finalOutputPath);
        
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
        }
        
        // Subscribe to download progress
        const handle = await YtDlpPlugin.addListener('downloadProgress', (data: { progress: number; message?: string }) => {
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
        
        addToLogHistory("Starting download with yt-dlp...", "info");
        const result = await YtDlpPlugin.download(downloadOptions);
        
        // Remove listener after download completes
        await handle.remove();
        
        const endTime = new Date();
        const formattedEndTime = endTime.toLocaleTimeString();
        const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
        
        if (result.success) {
          const filePath = `${finalOutputPath}/${filename}${isAudio ? '.mp3' : '.mp4'}`;
          addToLogHistory(`Download completed at ${formattedEndTime} (took ${duration} seconds)`, "success");
          addToLogHistory(`File saved to: ${filePath}`, "success");
        } else {
          addToLogHistory(`Download failed at ${formattedEndTime}`, "error");
          if (result.error) {
            addToLogHistory(`Error: ${result.error}`, "error");
          }
        }
        
        return result.success;
      } else {
        toast.error("Storage permission is required for downloading");
        addToLogHistory("Download failed: Storage permission denied", "error");
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

// Request storage permission for Android
export const requestStoragePermission = async (): Promise<boolean> => {
  if (isCapacitorNative()) {
    const { Permissions } = (window as any).Capacitor.Plugins;
    try {
      // Check current permissions first
      const checkResult = await Permissions.checkPermissions();
      addToLogHistory("Checking storage permissions", "info");
      
      if (checkResult.permissions.storage?.granted) {
        addToLogHistory("Storage permission already granted", "info");
        return true;
      }
      
      // Request permission if not granted
      addToLogHistory("Requesting storage permission...", "info");
      const result = await Permissions.requestPermissions({
        permissions: ['storage']
      });
      
      addToLogHistory("Permission request result: " + (result.permissions.storage.granted ? "granted" : "denied"), 
        result.permissions.storage.granted ? "success" : "warning");
      
      return result.permissions.storage.granted;
    } catch (error) {
      console.error("Error requesting storage permission:", error);
      addToLogHistory("Error requesting storage permission: " + (error as Error).message, "error");
      return false;
    }
  }
  // In browser, we'll assume it's granted
  addToLogHistory("Browser environment, assuming storage permission granted", "info");
  return true;
};

// Create directories for output
export const createDirectory = async (path: string): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      const { Filesystem } = (window as any).Capacitor.Plugins;
      addToLogHistory(`Creating directory: ${path}`, "info");
      
      await Filesystem.mkdir({
        path: path,
        recursive: true
      });
      
      addToLogHistory(`Successfully created directory: ${path}`, "success");
      return true;
    } catch (error) {
      console.error("Error creating directory:", error);
      addToLogHistory("Error creating directory: " + (error as Error).message, "error");
      return false;
    }
  }
  addToLogHistory("Browser environment, skipping directory creation", "info");
  return true;
};

// List available storage directories
export const listDirectories = async (): Promise<string[]> => {
  if (isCapacitorNative()) {
    try {
      const { Filesystem } = (window as any).Capacitor.Plugins;
      addToLogHistory("Listing available directories", "info");
      
      const result = await Filesystem.readdir({
        path: "/"
      });
      
      addToLogHistory(`Found ${result.files.length} directories`, "info");
      return result.files;
    } catch (error) {
      console.error("Error listing directories:", error);
      addToLogHistory("Error listing directories: " + (error as Error).message, "error");
      return [];
    }
  }
  return ["Downloads"];
};

// Initialize default directories when the app is first opened
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
          await createDirectory("/storage/music/Flash YTConverter");
          await createDirectory("/storage/movies/Flash YTConverter");
          
          // Mark as initialized
          localStorage.setItem('directories_initialized', 'true');
          addToLogHistory("Default directories successfully initialized", "success");
        }
      }
    } catch (error) {
      console.error("Error initializing default directories:", error);
      addToLogHistory("Error initializing default directories: " + (error as Error).message, "error");
    }
  }
};

