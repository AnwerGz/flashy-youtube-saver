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
      
      // Check if the plugin is registered
      const pluginsAvailable = (window as any).Capacitor?.Plugins || {};
      if (!pluginsAvailable.YtDlpPlugin) {
        console.log("YtDlpPlugin not available, running in demo mode");
        addToLogHistory("YtDlp plugin not detected. Running in demo mode.", "warning");
        toast.warning("Running in demo mode");
        return false;
      }
      
      return true;
    } else {
      // Browser environment - not fully supported
      console.log("Running in browser environment");
      toast.warning("Full functionality requires the mobile app");
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

// Create directories for output
export const createDirectory = async (path: string): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      const pluginsAvailable = (window as any).Capacitor?.Plugins || {};
      if (!pluginsAvailable.Filesystem) {
        addToLogHistory("Filesystem plugin not available. Using demo mode.", "warning");
        return true; // Return true in demo mode
      }
      
      const { Filesystem } = pluginsAvailable;
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
      const pluginsAvailable = (window as any).Capacitor?.Plugins || {};
      if (!pluginsAvailable.Filesystem) {
        addToLogHistory("Filesystem plugin not available. Using demo mode.", "warning");
        return ["Downloads", "Movies", "Music"]; // Return demo directories
      }
      
      const { Filesystem } = pluginsAvailable;
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
