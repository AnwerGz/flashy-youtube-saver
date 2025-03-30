
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { Folder } from "lucide-react";
import { downloadVideo } from '@/utils/ytdlp';

interface DownloadOptionsProps {
  isVisible: boolean;
  isPlaylist: boolean;
  url: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ isVisible, isPlaylist, url }) => {
  const { t } = useLanguage();
  const [format, setFormat] = useState<string>('mp3');
  const [quality, setQuality] = useState<string>(format === 'mp3' ? '192kbps' : '720p');
  const [outputPath, setOutputPath] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleFormatChange = (value: string) => {
    setFormat(value);
    // Reset quality when format changes
    setQuality(value === 'mp3' ? '192kbps' : '720p');
  };

  const handleQualityChange = (value: string) => {
    setQuality(value);
  };

  const handleSelectFolder = async () => {
    try {
      // Check if Capacitor exists in the window object
      const isCapacitorAvailable = typeof (window as any).Capacitor !== 'undefined';
      
      if (isCapacitorAvailable) {
        // In a real app with Capacitor installed, we would use the native plugins
        toast({
          title: "Mobile functionality",
          description: "This would open a folder picker on mobile devices"
        });
        
        // For demonstration purposes, simulate selection of the Downloads folder
        setOutputPath('/storage/emulated/0/Download');
        toast({
          title: "Folder selected",
          description: "Files will be saved to your Downloads folder"
        });
      } else {
        // Web platform - use browser's directory picker API if available
        try {
          // @ts-ignore - The window.showDirectoryPicker is not in TypeScript's lib yet
          const dirHandle = await window.showDirectoryPicker();
          setOutputPath(dirHandle.name); // Just show the folder name for display
          toast({
            title: "Folder selected",
            description: `Files will be saved to ${dirHandle.name}`
          });
        } catch (error) {
          // User cancelled or browser doesn't support the API
          console.error('Error selecting folder:', error);
          
          // Fallback for browsers that don't support directory picker
          const fakeFolderName = "Downloads";
          setOutputPath(fakeFolderName);
          toast({
            title: "Folder selected (Demo)",
            description: `Files will be saved to ${fakeFolderName}`
          });
        }
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      toast({
        title: "Error selecting folder",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!outputPath) {
      toast({
        title: "Select a folder",
        description: "Please select an output folder first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      toast({
        title: "Download started",
        description: `Downloading ${isPlaylist ? 'playlist' : 'video'} in ${format.toUpperCase()} format at ${quality} quality`
      });

      // Start the download process with progress tracking
      const isAudio = format === 'mp3';
      const success = await downloadVideo(
        url,
        format,
        outputPath,
        quality,
        isAudio,
        (progress) => {
          setDownloadProgress(progress);
        }
      );

      if (success) {
        toast({
          title: "Download complete",
          description: `Your ${isPlaylist ? 'playlist' : 'video'} has been saved to ${outputPath}`,
        });
      } else {
        toast({
          title: "Download failed",
          description: "An error occurred during the download process",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during download:', error);
      toast({
        title: "Download failed",
        description: "An error occurred during the download process",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-flash-900/50 p-6 rounded-lg border border-flash-200 dark:border-flash-800 shadow-sm animate-fade-in">
      <h3 className="text-xl font-bold mb-4 text-flash-800 dark:text-flash-300">{t('choose_format')}</h3>
      
      <div className="space-y-6">
        {/* Format Selection */}
        <RadioGroup 
          defaultValue={format} 
          onValueChange={handleFormatChange}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mp3" id="mp3" />
            <Label htmlFor="mp3" className="cursor-pointer">{t('audio_format')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mp4" id="mp4" />
            <Label htmlFor="mp4" className="cursor-pointer">{t('video_format')}</Label>
          </div>
        </RadioGroup>

        {/* Quality Selection - different options based on format */}
        <div className="space-y-2">
          <Label>{format === 'mp3' ? 'Audio Quality' : 'Video Quality'}</Label>
          <Select value={quality} onValueChange={handleQualityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {format === 'mp3' ? (
                <>
                  <SelectItem value="128kbps">128 kbps</SelectItem>
                  <SelectItem value="192kbps">192 kbps</SelectItem>
                  <SelectItem value="256kbps">256 kbps</SelectItem>
                  <SelectItem value="320kbps">320 kbps</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="360p">360p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Output folder selection */}
        <div className="space-y-2">
          <Label>{t('select_folder')}</Label>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={handleSelectFolder}
            >
              <Folder className="mr-2 h-4 w-4" />
              {outputPath || "Choose folder..."}
            </Button>
          </div>
        </div>

        {/* Progress indicator shown when downloading */}
        {isDownloading && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Download Progress</Label>
              <span className="text-sm font-medium">{downloadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-flash-500" 
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <Button
          variant="default"
          className="w-full flash-gradient hover:opacity-90 transition-opacity"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('downloading')}</span>
            </div>
          ) : (
            t('download')
          )}
        </Button>
      </div>
    </div>
  );
};

export default DownloadOptions;
