
# Android BinaryInstaller Plugin Implementation Guide

This guide provides instructions on implementing the BinaryInstaller plugin for Capacitor on Android.

## Plugin Structure

Create the following files in your Android project:

### 1. Plugin Definition

```java
// com/dejavi/flash/plugins/BinaryInstallerPlugin.java
package com.dejavi.flash.plugins;

import android.content.Context;
import android.content.res.AssetManager;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "BinaryInstaller")
public class BinaryInstallerPlugin extends Plugin {
    private static final String TAG = "BinaryInstaller";
    
    private static final String YTDLP_BINARY_SOURCE = "public/assets/utils/bin/yt-dlp";
    private static final String FFMPEG_BINARY_SOURCE = "public/assets/utils/bin/ffmpeg";
    
    private static final String YTDLP_BINARY_NAME = "yt-dlp";
    private static final String FFMPEG_BINARY_NAME = "ffmpeg";

    @PluginMethod
    public void copyBinaries(PluginCall call) {
        try {
            Context context = getContext();
            File filesDir = context.getFilesDir();
            
            // Copy yt-dlp binary
            boolean ytdlpSuccess = copyAssetToFiles(context, YTDLP_BINARY_SOURCE, YTDLP_BINARY_NAME);
            
            // Copy ffmpeg binary
            boolean ffmpegSuccess = copyAssetToFiles(context, FFMPEG_BINARY_SOURCE, FFMPEG_BINARY_NAME);
            
            // Make both binaries executable
            boolean executableSuccess = makeExecutable(filesDir.getAbsolutePath() + "/" + YTDLP_BINARY_NAME) && 
                                       makeExecutable(filesDir.getAbsolutePath() + "/" + FFMPEG_BINARY_NAME);
            
            JSObject ret = new JSObject();
            if (ytdlpSuccess && ffmpegSuccess && executableSuccess) {
                ret.put("success", true);
                ret.put("message", "Binary files successfully copied and made executable");
            } else {
                ret.put("success", false);
                ret.put("message", "Failed to copy or make executable binary files");
            }
            
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error copying binaries", e);
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Error: " + e.getMessage());
            call.resolve(ret);
        }
    }
    
    @PluginMethod
    public void isInstalled(PluginCall call) {
        Context context = getContext();
        File filesDir = context.getFilesDir();
        
        File ytdlpFile = new File(filesDir, YTDLP_BINARY_NAME);
        File ffmpegFile = new File(filesDir, FFMPEG_BINARY_NAME);
        
        boolean installed = ytdlpFile.exists() && ytdlpFile.canExecute() && 
                           ffmpegFile.exists() && ffmpegFile.canExecute();
        
        JSObject ret = new JSObject();
        ret.put("installed", installed);
        call.resolve(ret);
    }
    
    private boolean copyAssetToFiles(Context context, String assetPath, String fileName) {
        AssetManager assetManager = context.getAssets();
        File outFile = new File(context.getFilesDir(), fileName);
        
        try (InputStream in = assetManager.open(assetPath);
             OutputStream out = new FileOutputStream(outFile)) {
            
            Log.d(TAG, "Copying " + assetPath + " to " + outFile.getAbsolutePath());
            
            byte[] buffer = new byte[8192];
            int read;
            
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            
            out.flush();
            return true;
        } catch (IOException e) {
            Log.e(TAG, "Failed to copy asset", e);
            return false;
        }
    }
    
    private boolean makeExecutable(String filePath) {
        try {
            Process process = Runtime.getRuntime().exec("chmod +x " + filePath);
            int exitCode = process.waitFor();
            Log.d(TAG, "chmod +x " + filePath + " exitCode: " + exitCode);
            return exitCode == 0;
        } catch (Exception e) {
            Log.e(TAG, "Failed to make executable: " + filePath, e);
            return false;
        }
    }
}
```

### 2. Update `MainActivity.java`

Add the new plugin to your MainActivity's initialization:

```java
// Example modification to MainActivity.java
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Add your plugins here
      add(BinaryInstallerPlugin.class);
    }});
  }
}
```

### 3. Register the Plugin

**Option 1**: Update `android/capacitor.settings.gradle`:
```groovy
// Example capacitor.settings.gradle
include ':capacitor-binary-installer'
project(':capacitor-binary-installer').projectDir = new File('../node_modules/@capacitor/binary-installer/android')
```

**Option 2**: Update `android/app/build.gradle`:
```groovy
dependencies {
    implementation project(':capacitor-android')
    // Add other dependencies as needed
}
```

## How it Works

1. The plugin accesses the Android AssetManager to read binary files from the assets folder.
2. It copies the binaries to the app's private files directory using FileOutputStream.
3. It makes the binaries executable using `Runtime.getRuntime().exec("chmod +x ...")`.
4. JavaScript can call these methods via the Capacitor bridge.

## Testing the Plugin

1. Build your Android app.
2. Test the plugin functionality via JavaScript:
```javascript
import { Capacitor, registerPlugin } from '@capacitor/core';
const BinaryInstaller = registerPlugin('BinaryInstaller');

// Check if binaries are installed
const checkResult = await BinaryInstaller.isInstalled();
console.log('Binaries installed:', checkResult.installed);

// Copy binaries if needed
if (!checkResult.installed) {
  const result = await BinaryInstaller.copyBinaries();
  console.log('Copy result:', result);
}
```

## Troubleshooting

1. If binaries aren't found in assets, check that they're correctly placed in:
   - `android/app/src/main/assets/public/assets/utils/bin/`

2. If permission errors occur, ensure:
   - The app has proper permissions
   - The chmod command is executing successfully

3. For debugging:
   - Check Logcat for messages tagged with "BinaryInstaller"
   - Verify file paths in both assets and destination directory
