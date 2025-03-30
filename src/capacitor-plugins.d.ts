
// Type definitions for Capacitor custom plugins
interface PluginListenerHandle {
  remove: () => Promise<void>;
}

interface PermissionStatus {
  storage: {
    granted: boolean;
  };
}

declare module '@capacitor/core' {
  interface PluginRegistry {
    YtDlpPlugin: YtDlpPluginPlugin;
    FFmpegPlugin: FFmpegPluginPlugin;
    Permissions: PermissionsPlugin;
    Filesystem: FilesystemPlugin;
  }
}

// Permissions Plugin interface
interface PermissionsPlugin {
  requestPermissions(options: { permissions: string[] }): Promise<{ permissions: PermissionStatus }>;
  checkPermissions(): Promise<{ permissions: PermissionStatus }>;
}

// Filesystem Plugin interface
interface FilesystemPlugin {
  mkdir(options: { path: string; recursive: boolean }): Promise<void>;
  getUri(options: { path: string }): Promise<{ uri: string }>;
  readdir(options: { path: string }): Promise<{ files: string[] }>;
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
  }): Promise<{ success: boolean, path: string }>;
  addListener(
    eventName: 'downloadProgress',
    listenerFunc: (data: { progress: number }) => void
  ): Promise<PluginListenerHandle>;
}

// FFmpeg Plugin interface
interface FFmpegPluginPlugin {
  convert(options: {
    inputPath: string,
    outputPath: string,
    format: string,
    quality: string
  }): Promise<{ success: boolean, path: string }>;
  addListener(
    eventName: 'conversionProgress',
    listenerFunc: (data: { progress: number }) => void
  ): Promise<PluginListenerHandle>;
}
