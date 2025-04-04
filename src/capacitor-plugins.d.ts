
import { PluginListenerHandle, PermissionState } from '@capacitor/core';

// Type definitions for Capacitor custom plugins
interface PluginCallResult {
  [key: string]: any;
}

interface PermissionStatus {
  storage: PermissionState;
  [key: string]: PermissionState;
}

declare module '@capacitor/core' {
  interface PermissionType {
    // Standard permission
    storage: PermissionState;
    
    // Android 13+ permissions
    'android.permission.READ_MEDIA_AUDIO': PermissionState;
    'android.permission.READ_MEDIA_VIDEO': PermissionState;
    'android.permission.READ_MEDIA_IMAGES': PermissionState;
    'android.permission.READ_EXTERNAL_STORAGE': PermissionState;
    'android.permission.WRITE_EXTERNAL_STORAGE': PermissionState;
  }
  
  interface PluginRegistry {
    YtDlpPlugin: YtDlpPluginPlugin;
    FFmpegPlugin: FFmpegPluginPlugin;
  }
}

// YT-DLP Plugin interface
interface YtDlpPluginPlugin {
  getVideoInfo(options: { url: string }): Promise<{ info: any }>;
  download(options: {
    url: string,
    format: string,
    outputPath: string,
    quality: string,
    isAudio: boolean
  }): Promise<{ success: boolean, path?: string, error?: string }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (data: { progress: number, message?: string }) => void
  ): Promise<PluginListenerHandle>;
}

// FFmpeg Plugin interface
interface FFmpegPluginPlugin {
  convert(options: {
    inputPath: string,
    outputPath: string,
    format: string,
    quality: string
  }): Promise<{ success: boolean, path?: string, error?: string }>;
  addListener(
    eventName: 'conversionProgress',
    listenerFunc: (data: { progress: number }) => void
  ): Promise<PluginListenerHandle>;
}
