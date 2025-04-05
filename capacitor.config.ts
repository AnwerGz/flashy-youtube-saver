
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8d37f687d2ea4dae993038530fe6ba3d',
  appName: 'flashy-youtube-saver',
  webDir: 'dist',
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
      // Point to the official binary path
      binaryPath: "src/utils/bin/yt-dlp"
    },
    FFmpegPlugin: {
      // Point to the official binary path
      binaryPath: "src/utils/bin/ffmpeg"
    }
  },
  android: {
    // Make sure we're using a compatible Gradle version
    minSdkVersion: 22,
    // This will work with JDK 21
    buildToolsVersion: "33.0.2",
    gradleVersion: "8.0.0",
    // Add permission descriptions for better Android 13+ support
    permissionRequestDescription: {
      "android.permission.READ_MEDIA_AUDIO": "Access to save audio files",
      "android.permission.READ_MEDIA_VIDEO": "Access to save video files",
      "android.permission.READ_EXTERNAL_STORAGE": "Access to save files",
      "android.permission.WRITE_EXTERNAL_STORAGE": "Access to save files"
    }
  }
};

export default config;
