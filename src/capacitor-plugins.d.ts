
import type { PluginListenerHandle } from '@capacitor/core';

// Type definitions for Capacitor custom plugins
declare module '@capacitor/core' {
  interface PluginsConfig {
    // Define your plugin configurations here
    YtDlpPlugin?: {
      binaryPath?: string;
    };
    FFmpegPlugin?: {
      binaryPath?: string;
    };
    Permissions?: {
      requestPermissions?: string[];
    };
  }

  interface PermissionState {
    // Permission states
    granted: 'granted';
    denied: 'denied';
    prompt: 'prompt';
    promptWithRationale: 'prompt-with-rationale';
  }

  interface PermissionType {
    // Standard permission
    storage: 'storage';
    
    // Android 13+ permissions
    'android.permission.READ_MEDIA_AUDIO': 'android.permission.READ_MEDIA_AUDIO';
    'android.permission.READ_MEDIA_VIDEO': 'android.permission.READ_MEDIA_VIDEO';
    'android.permission.READ_MEDIA_IMAGES': 'android.permission.READ_MEDIA_IMAGES';
    'android.permission.READ_EXTERNAL_STORAGE': 'android.permission.READ_EXTERNAL_STORAGE';
    'android.permission.WRITE_EXTERNAL_STORAGE': 'android.permission.WRITE_EXTERNAL_STORAGE';
  }
}

// YT-DLP Plugin interface
interface YtDlpPluginPlugin {
  getVideoInfo(options: { url: string }): Promise<{ info: any }>;
  download(options: {
    url: string;
    format: string;
    outputPath: string;
    quality: string;
    isAudio: boolean;
  }): Promise<{ success: boolean; path?: string; error?: string }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (data: { progress: number; message?: string }) => void
  ): Promise<PluginListenerHandle>;
}

// FFmpeg Plugin interface
interface FFmpegPluginPlugin {
  convert(options: {
    inputPath: string;
    outputPath: string;
    format: string;
    quality: string;
  }): Promise<{ success: boolean; path?: string; error?: string }>;
  addListener(
    eventName: 'conversionProgress',
    listenerFunc: (data: { progress: number }) => void
  ): Promise<PluginListenerHandle>;
}

// Shell Plugin interface
interface ShellPlugin {
  execute(options: {
    command: string;
  }): Promise<{
    output: string;
    error?: string;
    exitCode: number;
  }>;
}

// Filesystem Plugin interface
interface FilesystemPlugin {
  mkdir(options: {
    path: string;
    directory?: string;
    recursive?: boolean;
  }): Promise<void>;
  readdir(options: {
    path: string;
    directory?: string;
  }): Promise<{ files: string[] }>;
  readFile(options: {
    path: string;
    directory?: string;
    encoding?: string;
  }): Promise<{ data: string }>;
  writeFile(options: {
    path: string;
    data: string;
    directory?: string;
    encoding?: string;
  }): Promise<void>;
  stat(options: {
    path: string;
    directory?: string;
  }): Promise<{
    type: string;
    size: number;
    mtime: number;
    uri: string;
  }>;
}

// Permissions Plugin interface
interface PermissionsPlugin {
  query(options: {
    name: string;
  }): Promise<{
    state: string;
  }>;
  requestPermissions(options: {
    permissions: string[];
  }): Promise<{
    permissions: {
      [key: string]: {
        state: string;
      };
    };
  }>;
}

// Add custom plugin declarations to the module
declare module '@capacitor/core' {
  interface RegisteredPlugins {
    YtDlpPlugin: YtDlpPluginPlugin;
    FFmpegPlugin: FFmpegPluginPlugin;
    Shell: ShellPlugin;
    Filesystem: FilesystemPlugin;
    Permissions: PermissionsPlugin;
  }
}
