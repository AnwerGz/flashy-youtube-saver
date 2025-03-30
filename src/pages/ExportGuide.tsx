import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Info, FileCode, Package, Smartphone, Code, Download } from "lucide-react";

const ExportGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Exporting Flash Converter to Android</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>Required tools and software for building the Android app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-1 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Node.js and NPM</h3>
              <p className="text-sm text-muted-foreground">Install the latest LTS version from <a href="https://nodejs.org" className="text-blue-500 hover:underline">nodejs.org</a></p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-1 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Android Studio</h3>
              <p className="text-sm text-muted-foreground">Required to compile and build Android apps. Download from <a href="https://developer.android.com/studio" className="text-blue-500 hover:underline">developer.android.com</a></p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-1 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Java Development Kit (JDK)</h3>
              <p className="text-sm text-muted-foreground">JDK 17 or newer is required for Android development</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-1 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Git</h3>
              <p className="text-sm text-muted-foreground">For version control and cloning the repository</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="step-by-step">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="step-by-step">Step-by-Step Guide</TabsTrigger>
          <TabsTrigger value="plugins">Custom Plugins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="step-by-step" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-flash-500" />
                <CardTitle>Step 1: Set Up Capacitor</CardTitle>
              </div>
              <CardDescription>Initialize the Capacitor framework in your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">Install Capacitor dependencies:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npm install @capacitor/core @capacitor/android</code><br />
                    <code>npm install -D @capacitor/cli</code>
                  </div>
                </li>
                
                <li>
                  <p className="font-medium">Initialize Capacitor:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npx cap init FlashConverter com.flashconverter.app --web-dir=dist</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">This creates a capacitor.config.json file.</p>
                </li>
                
                <li>
                  <p className="font-medium">Update capacitor.config.json to include the following:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <pre>{`{
  "appId": "com.flashconverter.app",
  "appName": "Flash Converter",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "Permissions": {
      "requestPermissions": ["storage", "camera"]
    }
  }
}`}</pre>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-flash-500" />
                <CardTitle>Step 2: Create Custom Native Plugins</CardTitle>
              </div>
              <CardDescription>Implement YtDlpPlugin and FFmpegPlugin for Android</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-100 rounded-full p-1 mt-1">
                  <Info className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="text-sm text-muted-foreground">
                  This step requires advanced Java/Kotlin knowledge for Android development. You'll need to create native plugins that wrap yt-dlp and FFmpeg libraries for Android.
                </div>
              </div>
              
              <p className="mb-2">Create custom plugin directories:</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 mb-4 overflow-x-auto">
                <code>mkdir -p android/app/src/main/java/com/flashconverter/app/plugins</code>
              </div>
              
              <p className="text-sm">The detailed implementation of these plugins requires Android development expertise and is beyond the scope of this guide. However, you can find libraries like:</p>
              
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><a href="https://github.com/yausername/youtubedl-android" className="text-blue-500 hover:underline">youtubedl-android</a> - A wrapper for yt-dlp on Android</li>
                <li><a href="https://github.com/tanersener/mobile-ffmpeg" className="text-blue-500 hover:underline">mobile-ffmpeg</a> - FFmpeg for Android and iOS</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-flash-500" />
                <CardTitle>Step 3: Build and Package</CardTitle>
              </div>
              <CardDescription>Build the web app and prepare for Android</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">Build the web app:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npm run build</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">This creates a "dist" folder with your web app.</p>
                </li>
                
                <li>
                  <p className="font-medium">Add Android platform:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npx cap add android</code>
                  </div>
                </li>
                
                <li>
                  <p className="font-medium">Copy web assets to the Android project:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npx cap copy android</code>
                  </div>
                </li>
                
                <li>
                  <p className="font-medium">Update Android native code:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npx cap update android</code>
                  </div>
                </li>
                
                <li>
                  <p className="font-medium">Open the project in Android Studio:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <code>npx cap open android</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">This will launch Android Studio with your project.</p>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-flash-500" />
                <CardTitle>Step 4: Build and Run on Android</CardTitle>
              </div>
              <CardDescription>Compile and test on Android devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <p className="font-medium">In Android Studio:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Wait for the Gradle sync to complete</li>
                    <li>Update Android SDK if prompted</li>
                    <li>Ensure all dependencies are resolved</li>
                  </ul>
                </li>
                
                <li>
                  <p className="font-medium">Set up permissions in AndroidManifest.xml:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto">
                    <pre>{`<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">These permissions are necessary for downloading and storing files.</p>
                </li>
                
                <li>
                  <p className="font-medium">Test on an emulator or physical device:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Click the "Run" button (green triangle) in Android Studio</li>
                    <li>Select a virtual device or connect a physical device</li>
                    <li>Wait for the app to build and deploy</li>
                  </ul>
                </li>
                
                <li>
                  <p className="font-medium">Generate signed APK for distribution:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>From menu: Build → Generate Signed Bundle/APK</li>
                    <li>Choose "APK" and follow the wizard</li>
                    <li>Create a new key store if you don't have one</li>
                    <li>Select "release" build variant</li>
                    <li>Wait for the build process to complete</li>
                  </ul>
                </li>
              </ol>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mt-4 flex items-start gap-3">
                <div className="mt-1">
                  <Download className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">Your APK is ready!</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    The final APK will be located at:<br />
                    <code className="text-xs">android/app/build/outputs/apk/release/app-release.apk</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugins">
          <Card>
            <CardHeader>
              <CardTitle>Custom Plugins Implementation</CardTitle>
              <CardDescription>Technical details for integrating yt-dlp and FFmpeg in Android</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">YtDlpPlugin (Kotlin)</h3>
                <p className="text-sm mb-3">This plugin provides a bridge between your JavaScript code and the native yt-dlp library:</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-xs">
                  <pre>{`package com.flashconverter.app.plugins

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.yausername.youtubedl_android.YoutubeDL
import com.yausername.youtubedl_android.YoutubeDLRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File

@CapacitorPlugin(name = "YtDlpPlugin")
class YtDlpPlugin : Plugin() {
    private val TAG = "YtDlpPlugin"

    override fun load() {
        super.load()
        GlobalScope.launch(Dispatchers.IO) {
            try {
                YoutubeDL.init(context)
                Log.d(TAG, "YoutubeDL initialized")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to initialize YoutubeDL", e)
            }
        }
    }

    @PluginMethod
    fun getVideoInfo(call: PluginCall) {
        val url = call.getString("url") ?: run {
            call.reject("URL is required")
            return
        }

        GlobalScope.launch(Dispatchers.IO) {
            try {
                val request = YoutubeDLRequest(url)
                request.addOption("--dump-json")
                request.addOption("--no-playlist")

                val videoInfo = YoutubeDL.getInstance().getInfo(request)
                val jsonObject = JSONObject(videoInfo.json)
                
                val result = JSObject()
                result.put("info", JSObject(jsonObject.toString()))
                
                withContext(Dispatchers.Main) {
                    call.resolve(result)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error getting video info", e)
                withContext(Dispatchers.Main) {
                    call.reject("Failed to get video info", e)
                }
            }
        }
    }

    @PluginMethod
    fun download(call: PluginCall) {
        val url = call.getString("url") ?: run {
            call.reject("URL is required")
            return
        }
        val format = call.getString("format") ?: "mp4"
        val outputPath = call.getString("outputPath") ?: run {
            call.reject("Output path is required")
            return
        }
        val quality = call.getString("quality") ?: "best"
        val isAudio = call.getBoolean("isAudio") ?: false

        GlobalScope.launch(Dispatchers.IO) {
            try {
                val request = YoutubeDLRequest(url)
                
                // Configure output directory
                val outputDir = File(outputPath)
                if (!outputDir.exists()) {
                    outputDir.mkdirs()
                }
                request.addOption("-o", outputDir.absolutePath + "/%(title)s.%(ext)s")
                
                // Configure format options
                if (isAudio) {
                    request.addOption("-x")
                    request.addOption("--audio-format", "mp3")
                    request.addOption("--audio-quality", quality)
                } else {
                    request.addOption("-f", "bestvideo[height<=?$quality]+bestaudio/best")
                }
                
                // Set progress listener
                YoutubeDL.getInstance().setDownloadProgressCallback { progress, etaInSeconds ->
                    val progressData = JSObject()
                    progressData.put("progress", progress.toInt())
                    notifyListeners("downloadProgress", progressData)
                }
                
                // Execute download
                val result = YoutubeDL.getInstance().execute(request)
                
                withContext(Dispatchers.Main) {
                    if (result.exitCode == 0) {
                        val response = JSObject()
                        response.put("success", true)
                        response.put("path", outputDir.absolutePath)
                        call.resolve(response)
                    } else {
                        call.reject("Download failed with exit code: ${result.exitCode}")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error downloading", e)
                withContext(Dispatchers.Main) {
                    call.reject("Download failed", e)
                }
            }
        }
    }
}`}</pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">FFmpegPlugin (Kotlin)</h3>
                <p className="text-sm mb-3">This plugin handles media conversion using FFmpeg:</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-xs">
                  <pre>{`package com.flashconverter.app.plugins

import android.util.Log
import com.arthenica.mobileffmpeg.Config
import com.arthenica.mobileffmpeg.FFmpeg
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

@CapacitorPlugin(name = "FFmpegPlugin")
class FFmpegPlugin : Plugin() {
    private val TAG = "FFmpegPlugin"

    @PluginMethod
    fun convert(call: PluginCall) {
        val inputPath = call.getString("inputPath") ?: run {
            call.reject("Input path is required")
            return
        }
        val outputPath = call.getString("outputPath") ?: run {
            call.reject("Output path is required")
            return
        }
        val format = call.getString("format") ?: "mp3"
        val quality = call.getString("quality") ?: "192k"
        
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val outputDir = File(outputPath)
                if (!outputDir.exists()) {
                    outputDir.mkdirs()
                }
                
                val outputFile = File(outputDir, "converted_file.$format").absolutePath
                
                // Set up progress monitoring
                Config.enableStatisticsCallback { statistics ->
                    val timeInMilliseconds = statistics.time
                    val duration = 90000 // This would come from mediainfo in a real app
                    val progress = if (duration > 0) (timeInMilliseconds * 100 / duration) else 0
                    
                    val progressData = JSObject()
                    progressData.put("progress", progress)
                    notifyListeners("conversionProgress", progressData)
                }
                
                // Build FFmpeg command based on format
                val command = when (format) {
                    "mp3" -> {
                        // Audio conversion
                        val bitrate = quality.replace("k", "")
                        arrayOf("-i", inputPath, "-b:a", "${bitrate}k", outputFile)
                    }
                    "mp4" -> {
                        // Video conversion
                        val resolution = when (quality) {
                            "480" -> "640x480"
                            "720" -> "1280x720"
                            "1080" -> "1920x1080"
                            else -> "640x360"
                        }
                        arrayOf("-i", inputPath, "-s", resolution, "-c:a", "aac", "-c:v", "libx264", outputFile)
                    }
                    else -> {
                        // Default passthrough
                        arrayOf("-i", inputPath, outputFile)
                    }
                }
                
                // Execute FFmpeg command
                val returnCode = FFmpeg.execute(command)
                
                withContext(Dispatchers.Main) {
                    if (returnCode == 0) {
                        val result = JSObject()
                        result.put("success", true)
                        result.put("path", outputFile)
                        call.resolve(result)
                    } else {
                        call.reject("Conversion failed with code: $returnCode")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error during conversion", e)
                withContext(Dispatchers.Main) {
                    call.reject("Conversion failed", e)
                }
            }
        }
    }
}`}</pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Registering Plugins</h3>
                <p className="text-sm mb-3">Add these plugins to your MainActivity.java:</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-xs">
                  <pre>{`// MainActivity.java
package com.flashconverter.app;

import android.os.Bundle;
import com.flashconverter.app.plugins.YtDlpPlugin;
import com.flashconverter.app.plugins.FFmpegPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register plugins
        registerPlugin(YtDlpPlugin.class);
        registerPlugin(FFmpegPlugin.class);
    }
}`}</pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Adding Dependencies</h3>
                <p className="text-sm mb-3">Add these dependencies to your app/build.gradle file:</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-xs">
                  <pre>{`dependencies {
    // Existing dependencies...
    
    // yt-dlp Android wrapper
    implementation 'com.github.yausername.youtubedl-android:library:0.14.0'
    implementation 'com.github.yausername.youtubedl-android:ffmpeg:0.14.0'
    
    // Mobile FFmpeg
    implementation 'com.arthenica:mobile-ffmpeg-full:4.4'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'
}`}</pre>
                </div>
                <p className="text-sm mt-2 text-muted-foreground">Make sure to also add the jitpack repository to your project's build.gradle:</p>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 overflow-x-auto text-xs">
                  <pre>{`allprojects {
    repositories {
        // Existing repositories...
        maven { url 'https://jitpack.io' }
    }
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportGuide;
