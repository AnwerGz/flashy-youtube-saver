
import type { PluginListenerHandle } from '@capacitor/core';

// Definisi tipe untuk plugin kustom Capacitor
declare module '@capacitor/core' {
  interface PluginsConfig {
    // Definisi konfigurasi plugin Anda di sini
    YtDlpPlugin?: {
      binaryPath?: string;
    };
    FFmpegPlugin?: {
      binaryPath?: string;
    };
    Permissions?: {
      requestPermissions?: string[];
    };
    BinaryInstaller?: {
      sourcePaths?: {
        ytdlp: string;
        ffmpeg: string;
      };
    };
  }

  interface PermissionState {
    // Status izin
    granted: 'granted';
    denied: 'denied';
    prompt: 'prompt';
    promptWithRationale: 'prompt-with-rationale';
  }

  interface PermissionType {
    // Izin standar
    storage: 'storage';
    
    // Izin Android 13+
    'android.permission.READ_MEDIA_AUDIO': 'android.permission.READ_MEDIA_AUDIO';
    'android.permission.READ_MEDIA_VIDEO': 'android.permission.READ_MEDIA_VIDEO';
    'android.permission.READ_MEDIA_IMAGES': 'android.permission.READ_MEDIA_IMAGES';
    'android.permission.READ_EXTERNAL_STORAGE': 'android.permission.READ_EXTERNAL_STORAGE';
    'android.permission.WRITE_EXTERNAL_STORAGE': 'android.permission.WRITE_EXTERNAL_STORAGE';
  }
}

// Interface untuk Plugin YT-DLP
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

// Interface untuk Plugin FFmpeg
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

// Interface untuk Plugin Shell
interface ShellPlugin {
  execute(options: {
    command: string;
  }): Promise<{
    output: string;
    error?: string;
    exitCode: number;
  }>;
}

// Interface untuk Plugin Filesystem
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

// Interface untuk Plugin Permissions
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

// Interface untuk Binary Installer Plugin
interface BinaryInstallerPlugin {
  copyBinaries(): Promise<{ success: boolean; message?: string }>;
  isInstalled(): Promise<{ installed: boolean }>;
}

// Menambahkan deklarasi plugin kustom ke dalam modul
declare module '@capacitor/core' {
  interface RegisteredPlugins {
    YtDlpPlugin: YtDlpPluginPlugin;
    FFmpegPlugin: FFmpegPluginPlugin;
    Shell: ShellPlugin;
    Filesystem: FilesystemPlugin;
    Permissions: PermissionsPlugin;
    BinaryInstaller: BinaryInstallerPlugin;
  }
}
