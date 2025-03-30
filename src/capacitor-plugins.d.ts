
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
