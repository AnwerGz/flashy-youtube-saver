import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Download, 
  Github, 
  Terminal, 
  Coffee,
  Code,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Steps, Step } from '@/components/ui/steps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExportGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flash-50 to-white dark:from-flash-900 dark:to-flash-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-flash-600 hover:text-flash-800 dark:text-flash-400 dark:hover:text-flash-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Converter
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-flash-800 dark:text-flash-300">
            Export Guide: Running Flash Converter on Android
          </h1>
          <p className="text-flash-600 dark:text-flash-400 mb-8">
            Follow this comprehensive guide to export Flash Converter as a native Android application 
            that you can install and use offline on any Android device.
          </p>
          
          <Tabs defaultValue="simple">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple Method</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Method</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="bg-flash-100 dark:bg-flash-800/30 p-4 rounded-full">
                      <Smartphone className="h-10 w-10 text-flash-500" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-center mb-6 text-flash-800 dark:text-flash-300">
                    Download Pre-built APK
                  </h2>
                  
                  <p className="text-flash-600 dark:text-flash-400 mb-4">
                    The easiest way to get Flash Converter on your Android device is to download our 
                    pre-built APK file. This method doesn't require any technical knowledge.
                  </p>
                  
                  <Steps>
                    <Step number={1} title="Download the APK">
                      <p>Visit our GitHub releases page and download the latest APK file to your Android device.</p>
                      <div className="mt-4">
                        <Button className="flex gap-2">
                          <Download className="h-4 w-4" />
                          Download latest APK
                        </Button>
                      </div>
                    </Step>
                    
                    <Step number={2} title="Enable Unknown Sources">
                      <p>Before installing, you need to allow installations from unknown sources:</p>
                      <ul className="list-disc list-inside space-y-2 mt-2 text-flash-600 dark:text-flash-400">
                        <li>Open your device Settings</li>
                        <li>Go to Security or Privacy settings</li>
                        <li>Enable "Unknown Sources" or "Install Unknown Apps"</li>
                      </ul>
                    </Step>
                    
                    <Step number={3} title="Install the App">
                      <p>Open the downloaded APK file and follow the installation prompts.</p>
                      <div className="bg-flash-50 dark:bg-flash-800/30 p-4 rounded-lg mt-3">
                        <p className="text-sm text-flash-700 dark:text-flash-300">
                          <strong>Note:</strong> If you see a security warning, it's because the app isn't from the Google Play Store. 
                          This is normal for directly downloaded APKs. Our app is safe to install.
                        </p>
                      </div>
                    </Step>
                    
                    <Step number={4} title="Start Using Flash Converter">
                      <p>Once installed, you can open Flash Converter and start downloading videos right away!</p>
                      <div className="flex gap-2 mt-4 items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <p className="text-flash-700 dark:text-flash-300 font-medium">All features work offline!</p>
                      </div>
                    </Step>
                  </Steps>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="bg-flash-100 dark:bg-flash-800/30 p-4 rounded-full">
                      <Code className="h-10 w-10 text-flash-500" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-center mb-6 text-flash-800 dark:text-flash-300">
                    Build from Source
                  </h2>
                  
                  <p className="text-flash-600 dark:text-flash-400 mb-4">
                    For developers or advanced users who want to customize the app, you can build Flash Converter 
                    from source code. This gives you full control over the application.
                  </p>
                  
                  <Steps>
                    <Step number={1} title="Prerequisites">
                      <p>Make sure you have the following installed:</p>
                      <ul className="list-disc list-inside space-y-2 mt-2 text-flash-600 dark:text-flash-400">
                        <li>Git</li>
                        <li>Node.js (v18+)</li>
                        <li>Android Studio</li>
                        <li>JDK 17+</li>
                      </ul>
                    </Step>
                    
                    <Step number={2} title="Clone the Repository">
                      <p className="mb-2">Open a terminal and clone our GitHub repository:</p>
                      <div className="bg-flash-800 text-flash-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        git clone https://github.com/yourusername/flash-converter.git
                        <br/>
                        cd flash-converter
                      </div>
                    </Step>
                    
                    <Step number={3} title="Install Dependencies">
                      <p className="mb-2">Install all required packages:</p>
                      <div className="bg-flash-800 text-flash-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        npm install
                        <br/>
                        npm install -g @capacitor/cli
                      </div>
                    </Step>
                    
                    <Step number={4} title="Build the Project">
                      <p className="mb-2">Build the React application:</p>
                      <div className="bg-flash-800 text-flash-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        npm run build
                      </div>
                    </Step>
                    
                    <Step number={5} title="Add Android Platform">
                      <p className="mb-2">Initialize Capacitor with Android:</p>
                      <div className="bg-flash-800 text-flash-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        npx cap add android
                        <br/>
                        npx cap sync
                      </div>
                    </Step>
                    
                    <Step number={6} title="Open in Android Studio">
                      <p className="mb-2">Open the project in Android Studio:</p>
                      <div className="bg-flash-800 text-flash-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        npx cap open android
                      </div>
                      <p className="mt-2">In Android Studio, you can customize the app further if needed.</p>
                    </Step>
                    
                    <Step number={7} title="Build and Export APK">
                      <p>From Android Studio:</p>
                      <ul className="list-disc list-inside space-y-2 mt-2 text-flash-600 dark:text-flash-400">
                        <li>Go to Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</li>
                        <li>When complete, click "locate" to find your APK file</li>
                        <li>Transfer this APK to your Android device to install</li>
                      </ul>
                    </Step>
                  </Steps>
                  
                  <div className="bg-flash-50 dark:bg-flash-800/30 p-4 rounded-lg mt-8">
                    <h3 className="font-bold text-flash-800 dark:text-flash-300 flex items-center gap-2">
                      <Coffee className="h-5 w-5" /> Developer Tips
                    </h3>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-flash-600 dark:text-flash-400">
                      <li>Add <code>android:usesCleartextTraffic="true"</code> to your AndroidManifest.xml if you face network issues</li>
                      <li>To debug on a connected device, run <code>npx cap run android</code></li>
                      <li>For file system access, the app needs proper permissions in the manifest</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-flash-800 dark:text-flash-300">
              Need Help?
            </h2>
            <p className="text-flash-600 dark:text-flash-400 mb-6 max-w-xl mx-auto">
              If you encounter any issues during the export process, check out our GitHub repository 
              for troubleshooting guides or open an issue for support.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="flex gap-2">
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
              <Button variant="default" className="flex gap-2">
                <Terminal className="h-4 w-4" />
                Troubleshooting Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportGuide;
