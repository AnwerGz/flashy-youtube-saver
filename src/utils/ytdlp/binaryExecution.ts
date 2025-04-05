
import { Capacitor, registerPlugin } from '@capacitor/core';
import { isCapacitorNative, addToLogHistory } from './core';

// Define paths for official binary files
const BINARY_DIR = "utils/bin";
const YT_DLP_BINARY = "yt-dlp";
const FFMPEG_BINARY = "ffmpeg";

// Interface for execution results
interface ExecResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}

// Copy binary files from assets to app's private directory
export const copyBinaries = async (): Promise<boolean> => {
  if (!isCapacitorNative()) {
    // In browser environment, simulate success
    addToLogHistory("Browser environment, skipping binary copying", "info");
    return true;
  }
  
  try {
    if (!Capacitor.isPluginAvailable('BinaryInstaller')) {
      addToLogHistory("BinaryInstaller plugin not available, falling back to Filesystem plugin", "warning");
      
      if (!Capacitor.isPluginAvailable('Filesystem')) {
        addToLogHistory("Filesystem plugin not available", "warning");
        return false;
      }
      
      const Filesystem = registerPlugin<FilesystemPlugin>('Filesystem');
      
      addToLogHistory("Checking binary files in app directory", "info");
      
      // Create destination directory
      try {
        await Filesystem.mkdir({
          path: BINARY_DIR,
          directory: 'APPLICATION',
          recursive: true
        });
      } catch (err) {
        // Ignore error if directory already exists
        addToLogHistory("Binary directory already exists or couldn't be created", "info");
      }
      
      // Function to copy binary from assets to app directory
      const copyBinary = async (binaryName: string): Promise<boolean> => {
        try {
          // Check if binary already exists in app directory
          try {
            const stat = await Filesystem.stat({
              path: `${BINARY_DIR}/${binaryName}`,
              directory: 'APPLICATION'
            });
            
            if (stat) {
              addToLogHistory(`${binaryName} already exists in app directory`, "info");
              // Set execution permissions
              await execCommand(`chmod +x ${BINARY_DIR}/${binaryName}`);
              return true;
            }
          } catch (statErr) {
            // File doesn't exist, we need to copy it
            addToLogHistory(`${binaryName} not found, will copy from assets`, "info");
          }
          
          // Read binary from official path
          const asset = await Filesystem.readFile({
            path: `src/utils/bin/${binaryName}`,
            directory: 'APPLICATION'
          });
          
          // Write binary to app directory
          await Filesystem.writeFile({
            path: `${BINARY_DIR}/${binaryName}`,
            data: asset.data,
            directory: 'APPLICATION'
          });
          
          // Set execution permissions
          await execCommand(`chmod +x ${BINARY_DIR}/${binaryName}`);
          
          addToLogHistory(`Successfully copied ${binaryName} to app directory`, "success");
          return true;
        } catch (err) {
          addToLogHistory(`Failed to copy ${binaryName}: ${(err as Error).message}`, "error");
          return false;
        }
      };
      
      // Copy both binaries
      const ytDlpCopied = await copyBinary(YT_DLP_BINARY);
      const ffmpegCopied = await copyBinary(FFMPEG_BINARY);
      
      return ytDlpCopied && ffmpegCopied;
    }
    
    // Use the dedicated BinaryInstaller plugin
    const BinaryInstaller = registerPlugin<BinaryInstallerPlugin>('BinaryInstaller');
    addToLogHistory("Using BinaryInstaller plugin to copy binaries", "info");
    
    const result = await BinaryInstaller.copyBinaries();
    
    if (result.success) {
      addToLogHistory("Binary files successfully copied with BinaryInstaller", "success");
      return true;
    } else {
      addToLogHistory(`Failed to copy binaries with BinaryInstaller: ${result.message}`, "error");
      return false;
    }
  } catch (error) {
    addToLogHistory(`Failed to copy binaries: ${(error as Error).message}`, "error");
    return false;
  }
};

// Execute shell command
const execCommand = async (command: string): Promise<ExecResult> => {
  if (!isCapacitorNative()) {
    // Simulate execution in browser
    addToLogHistory(`[MOCK] Executing command: ${command}`, "info");
    return { success: true, output: "Mock execution successful", exitCode: 0 };
  }
  
  try {
    // Check if we have the Shell plugin available
    if (!Capacitor.isPluginAvailable('Shell')) {
      addToLogHistory("Shell plugin not available", "error");
      return { success: false, error: "Shell plugin not available" };
    }
    
    const Shell = registerPlugin<ShellPlugin>('Shell');
    addToLogHistory(`Executing command: ${command}`, "info");
    
    const result = await Shell.execute({ command });
    
    if (result.exitCode === 0) {
      addToLogHistory("Command executed successfully", "success");
      return { 
        success: true, 
        output: result.output, 
        exitCode: result.exitCode 
      };
    } else {
      addToLogHistory(`Command failed with exit code ${result.exitCode}`, "error");
      return { 
        success: false, 
        error: result.error || `Command failed with exit code ${result.exitCode}`,
        output: result.output,
        exitCode: result.exitCode 
      };
    }
  } catch (error) {
    addToLogHistory(`Failed to execute command: ${(error as Error).message}`, "error");
    return { success: false, error: (error as Error).message };
  }
};

// Execute yt-dlp with arguments
export const execYtDlp = async (args: string[]): Promise<ExecResult> => {
  if (!isCapacitorNative()) {
    // Simulate execution in browser
    addToLogHistory(`[MOCK] Executing yt-dlp with arguments: ${args.join(' ')}`, "info");
    return { success: true, output: "Mock yt-dlp execution successful", exitCode: 0 };
  }
  
  try {
    const binaryPath = `${BINARY_DIR}/${YT_DLP_BINARY}`;
    const command = `${binaryPath} ${args.join(' ')}`;
    
    return await execCommand(command);
  } catch (error) {
    addToLogHistory(`Failed to execute yt-dlp: ${(error as Error).message}`, "error");
    return { success: false, error: (error as Error).message };
  }
};

// Execute ffmpeg with arguments
export const execFFmpeg = async (args: string[]): Promise<ExecResult> => {
  if (!isCapacitorNative()) {
    // Simulate execution in browser
    addToLogHistory(`[MOCK] Executing ffmpeg with arguments: ${args.join(' ')}`, "info");
    return { success: true, output: "Mock ffmpeg execution successful", exitCode: 0 };
  }
  
  try {
    const binaryPath = `${BINARY_DIR}/${FFMPEG_BINARY}`;
    const command = `${binaryPath} ${args.join(' ')}`;
    
    return await execCommand(command);
  } catch (error) {
    addToLogHistory(`Failed to execute ffmpeg: ${(error as Error).message}`, "error");
    return { success: false, error: (error as Error).message };
  }
};
