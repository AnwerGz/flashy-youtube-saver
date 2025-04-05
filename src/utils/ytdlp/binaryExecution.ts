
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
import { isCapacitorNative, addToLogHistory } from './core';

// Definisikan path untuk file binary resmi
const BINARY_DIR = "utils/bin";
const YT_DLP_BINARY = "yt-dlp";
const FFMPEG_BINARY = "ffmpeg";

// Interface untuk hasil eksekusi
interface ExecResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}

// Salin file binary dari assets ke direktori pribadi aplikasi
export const copyBinaries = async (): Promise<boolean> => {
  if (!isCapacitorNative()) {
    // Di lingkungan browser, simulasikan keberhasilan
    addToLogHistory("Lingkungan browser, melewati penyalinan binary", "info");
    return true;
  }
  
  try {
    if (!Capacitor.isPluginAvailable('Filesystem')) {
      addToLogHistory("Plugin Filesystem tidak tersedia", "warning");
      return false;
    }
    
    const Filesystem = registerPlugin<FilesystemPlugin>('Filesystem');
    
    addToLogHistory("Memeriksa file binary di direktori aplikasi", "info");
    
    // Buat direktori tujuan
    try {
      await Filesystem.mkdir({
        path: BINARY_DIR,
        directory: 'APPLICATION',
        recursive: true
      });
    } catch (err) {
      // Abaikan error jika direktori sudah ada
      addToLogHistory("Direktori binary sudah ada atau tidak dapat dibuat", "info");
    }
    
    // Fungsi untuk menyalin binary dari assets ke direktori aplikasi
    const copyBinary = async (binaryName: string): Promise<boolean> => {
      try {
        // Periksa apakah binary sudah ada di direktori aplikasi
        try {
          const stat = await Filesystem.stat({
            path: `${BINARY_DIR}/${binaryName}`,
            directory: 'APPLICATION'
          });
          
          if (stat) {
            addToLogHistory(`${binaryName} sudah ada di direktori aplikasi`, "info");
            // Atur izin eksekusi
            await execCommand(`chmod +x ${BINARY_DIR}/${binaryName}`);
            return true;
          }
        } catch (statErr) {
          // File tidak ada, kita perlu menyalinnya
          addToLogHistory(`${binaryName} tidak ditemukan, akan disalin dari assets`, "info");
        }
        
        // Baca binary dari path resmi
        const asset = await Filesystem.readFile({
          path: `src/utils/bin/${binaryName}`,
          directory: 'APPLICATION'
        });
        
        // Tulis binary ke direktori aplikasi
        await Filesystem.writeFile({
          path: `${BINARY_DIR}/${binaryName}`,
          data: asset.data,
          directory: 'APPLICATION'
        });
        
        // Atur izin eksekusi
        await execCommand(`chmod +x ${BINARY_DIR}/${binaryName}`);
        
        addToLogHistory(`Berhasil menyalin ${binaryName} ke direktori aplikasi`, "success");
        return true;
      } catch (err) {
        addToLogHistory(`Gagal menyalin ${binaryName}: ${(err as Error).message}`, "error");
        return false;
      }
    };
    
    // Salin kedua binary
    const ytDlpCopied = await copyBinary(YT_DLP_BINARY);
    const ffmpegCopied = await copyBinary(FFMPEG_BINARY);
    
    return ytDlpCopied && ffmpegCopied;
  } catch (error) {
    addToLogHistory(`Gagal menyalin binary: ${(error as Error).message}`, "error");
    return false;
  }
};

// Eksekusi perintah shell
const execCommand = async (command: string): Promise<ExecResult> => {
  if (!isCapacitorNative()) {
    // Simulasi eksekusi di browser
    addToLogHistory(`[MOCK] Mengeksekusi perintah: ${command}`, "info");
    return { success: true, output: "Mock execution successful", exitCode: 0 };
  }
  
  try {
    // Periksa apakah kita memiliki plugin Shell yang tersedia
    if (!Capacitor.isPluginAvailable('Shell')) {
      addToLogHistory("Plugin Shell tidak tersedia", "error");
      return { success: false, error: "Plugin Shell tidak tersedia" };
    }
    
    const Shell = registerPlugin<ShellPlugin>('Shell');
    addToLogHistory(`Mengeksekusi perintah: ${command}`, "info");
    
    const result = await Shell.execute({ command });
    
    if (result.exitCode === 0) {
      addToLogHistory("Perintah berhasil dieksekusi", "success");
      return { 
        success: true, 
        output: result.output, 
        exitCode: result.exitCode 
      };
    } else {
      addToLogHistory(`Perintah gagal dengan kode keluar ${result.exitCode}`, "error");
      return { 
        success: false, 
        error: result.error || `Perintah gagal dengan kode keluar ${result.exitCode}`,
        output: result.output,
        exitCode: result.exitCode 
      };
    }
  } catch (error) {
    addToLogHistory(`Gagal mengeksekusi perintah: ${(error as Error).message}`, "error");
    return { success: false, error: (error as Error).message };
  }
};

// Eksekusi yt-dlp dengan argumen
export const execYtDlp = async (args: string[]): Promise<ExecResult> => {
  if (!isCapacitorNative()) {
    // Simulasi eksekusi di browser
    addToLogHistory(`[MOCK] Mengeksekusi yt-dlp dengan argumen: ${args.join(' ')}`, "info");
    return { success: true, output: "Mock yt-dlp execution successful", exitCode: 0 };
  }
  
  try {
    const binaryPath = `${BINARY_DIR}/${YT_DLP_BINARY}`;
    const command = `${binaryPath} ${args.join(' ')}`;
    
    return await execCommand(command);
  } catch (error) {
    addToLogHistory(`Gagal mengeksekusi yt-dlp: ${(error as Error).message}`, "error");
    return { success: false, error: (error as Error).message };
  }
};

// Eksekusi ffmpeg dengan argumen
export const execFFmpeg = async (args: string[]): Promise<ExecResult> => {
  if (!isCapacitorNative()) {
    // Simulasi eksekusi di browser
    addToLogHistory(`[MOCK] Mengeksekusi ffmpeg dengan argumen: ${args.join(' ')}`, "info");
    return { success: true, output: "Mock ffmpeg execution successful", exitCode: 0 };
  }
  
  try {
    const binaryPath = `${BINARY_DIR}/${FFMPEG_BINARY}`;
    const command = `${binaryPath} ${args.join(' ')}`;
    
    return await execCommand(command);
  } catch (error) {
    addToLogHistory(`Gagal mengeksekusi ffmpeg: ${(error as Error).message}`, "error");
    return { success: false, error: (error as Error).message };
  }
};
