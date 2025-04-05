
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dejavi.flash',
  appName: 'Flash YTConverter',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Remove localhost URL and use the bundled web assets
    // This ensures the app works offline
    iosScheme: 'capacitor'
  },
  plugins: {
    Permissions: {
      requestPermissions: [
        'storage',
        'android.permission.READ_MEDIA_AUDIO',
        'android.permission.READ_MEDIA_VIDEO',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE'
      ]
    },
    YtDlpPlugin: {
      // Point to the correct relative path to binaries in the app's assets
      binaryPath: "assets/bin/yt-dlp"
    },
    FFmpegPlugin: {
      // Point to the correct relative path to binaries in the app's assets
      binaryPath: "assets/bin/ffmpeg"
    },
    BinaryInstaller: {
      // Source paths in assets
      sourcePaths: {
        ytdlp: "public/assets/utils/bin/yt-dlp",
        ffmpeg: "public/assets/utils/bin/ffmpeg"
      }
    }
  },
  android: {
    // Ensure we're using a version of Gradle that's compatible
    minSdkVersion: 22,
    // This will work with JDK 21
    buildToolsVersion: "33.0.2",
    gradleVersion: "8.0.0",
    // Add permission descriptions for better Android 13+ support
    permissionRequestDescription: {
      "android.permission.READ_MEDIA_AUDIO": "Akses untuk menyimpan file audio",
      "android.permission.READ_MEDIA_VIDEO": "Akses untuk menyimpan file video",
      "android.permission.READ_EXTERNAL_STORAGE": "Akses untuk menyimpan file",
      "android.permission.WRITE_EXTERNAL_STORAGE": "Akses untuk menyimpan file"
    }
  }
};

export default config;
