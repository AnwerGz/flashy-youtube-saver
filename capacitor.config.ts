
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dejavi.flash',
  appName: 'Flash YTConverter',
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
      // Arahkan ke path binary resmi
      binaryPath: "src/utils/bin/yt-dlp"
    },
    FFmpegPlugin: {
      // Arahkan ke path binary resmi
      binaryPath: "src/utils/bin/ffmpeg"
    }
  },
  android: {
    // Pastikan kita menggunakan versi Gradle yang kompatibel
    minSdkVersion: 22,
    // Ini akan berfungsi dengan JDK 21
    buildToolsVersion: "33.0.2",
    gradleVersion: "8.0.0",
    // Tambahkan deskripsi izin untuk dukungan Android 13+ yang lebih baik
    permissionRequestDescription: {
      "android.permission.READ_MEDIA_AUDIO": "Akses untuk menyimpan file audio",
      "android.permission.READ_MEDIA_VIDEO": "Akses untuk menyimpan file video",
      "android.permission.READ_EXTERNAL_STORAGE": "Akses untuk menyimpan file",
      "android.permission.WRITE_EXTERNAL_STORAGE": "Akses untuk menyimpan file"
    }
  }
};

export default config;
