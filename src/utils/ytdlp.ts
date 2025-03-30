
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
      return false;
    }
  } catch (error) {
    console.error("Failed to load yt-dlp:", error);
    toast.error("Failed to initialize download engine");
    return false;
  }
};

// Extract video information using yt-dlp
export const getVideoInfo = async (url: string): Promise<VideoInfo | null> => {
  try {
    if (!await loadYtDlp()) {
      // Create a mock response for demo purposes
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
      const result = await YtDlpPlugin.getVideoInfo({ url });
      return result.info;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting video info:", error);
    toast.error("Failed to get video information");
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
    if (!await loadYtDlp()) {
      // Simulate download progress for demo
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        progressCallback(Math.min(progress, 100));
        if (progress >= 100) {
          clearInterval(interval);
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
        // Start download with the plugin
        const downloadOptions = {
          url,
          format,
          outputPath,
          quality,
          isAudio
        };
        
        // Subscribe to download progress
        const handle = await YtDlpPlugin.addListener('downloadProgress', (data: { progress: number }) => {
          progressCallback(data.progress);
        });
        
        const result = await YtDlpPlugin.download(downloadOptions);
        
        // Remove listener after download completes
        await handle.remove();
        
        return result.success;
      } else {
        toast.error("Storage permission is required for downloading");
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error downloading video:", error);
    toast.error("Download failed");
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
      if (checkResult.permissions.storage?.granted) {
        return true;
      }
      
      // Request permission if not granted
      console.log("Requesting storage permission...");
      const result = await Permissions.requestPermissions({
        permissions: ['storage']
      });
      
      console.log("Permission request result:", result);
      return result.permissions.storage.granted;
    } catch (error) {
      console.error("Error requesting storage permission:", error);
      return false;
    }
  }
  // In browser, we'll assume it's granted
  return true;
};

// Create directories for output
export const createDirectory = async (path: string): Promise<boolean> => {
  if (isCapacitorNative()) {
    try {
      const { Filesystem } = (window as any).Capacitor.Plugins;
      await Filesystem.mkdir({
        path: path,
        recursive: true
      });
      return true;
    } catch (error) {
      console.error("Error creating directory:", error);
      return false;
    }
  }
  return true;
};

// List available storage directories
export const listDirectories = async (): Promise<string[]> => {
  if (isCapacitorNative()) {
    try {
      const { Filesystem } = (window as any).Capacitor.Plugins;
      const result = await Filesystem.readdir({
        path: "/"
      });
      return result.files;
    } catch (error) {
      console.error("Error listing directories:", error);
      return [];
    }
  }
  return ["Downloads"];
};
