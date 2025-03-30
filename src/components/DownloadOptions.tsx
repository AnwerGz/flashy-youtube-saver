
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { Folder, Info } from "lucide-react";

// Fix the type of props
interface DownloadOptionsProps {
  isVisible: boolean;
  isPlaylist: boolean;
  url: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ isVisible, isPlaylist, url }) => {
  const { t } = useLanguage();
  const [format, setFormat] = useState<string>('mp3');
  const [quality, setQuality] = useState<string>('medium');
  const [outputPath, setOutputPath] = useState<string>('');

  const handleFormatChange = (value: string) => {
    setFormat(value);
  };

  const handleQualityChange = (value: string) => {
    setQuality(value);
  };

  const handleSelectFolder = async () => {
    try {
      // Check if we're on a mobile platform
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        // Request permission for storage access
        const { Filesystem } = await import('@capacitor/filesystem');
        const { Permissions } = await import('@capacitor/core');
        
        // Request storage permission on Android
        const { value } = await Permissions.query({
          name: 'storage'
        });
        
        if (value === 'denied') {
          const permResult = await Permissions.request({
            name: 'storage'
          });
          
          if (permResult.state !== 'granted') {
            toast({
              title: "Permission denied",
              description: "Storage permission is required to select a download location",
              variant: "destructive"
            });
            return;
          }
        }
        
        // Use Capacitor's file picker
        // On Android, this typically opens the system file picker
        const result = await Filesystem.requestPermissions();
        if (result.publicStorage) {
          // Set to Downloads folder as default
          setOutputPath('/storage/emulated/0/Download');
          toast({
            title: "Folder selected",
            description: "Files will be saved to your Downloads folder"
          });
        }
      } else {
        // Web platform - use browser's directory picker API
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
      toast({
        title: "Download started",
        description: `Downloading ${isPlaylist ? 'playlist' : 'video'} in ${format.toUpperCase()} format`
      });

      // Simulate download process
      setTimeout(() => {
        toast({
          title: "Download complete",
          description: `Your ${isPlaylist ? 'playlist' : 'video'} has been saved to ${outputPath}`,
        });
      }, 3000);
    } catch (error) {
      console.error('Error during download:', error);
      toast({
        title: "Download failed",
        description: "An error occurred during the download process",
        variant: "destructive"
      });
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

        {/* Quality Selection */}
        <div className="space-y-2">
          <Label>{t('quality')}</Label>
          <Select value={quality} onValueChange={handleQualityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{t('low')}</SelectItem>
              <SelectItem value="medium">{t('medium')}</SelectItem>
              <SelectItem value="high">{t('high')}</SelectItem>
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

        {/* Download Button */}
        <Button
          variant="default"
          className="w-full flash-gradient hover:opacity-90 transition-opacity"
          onClick={handleDownload}
        >
          {t('download')}
        </Button>
      </div>
    </div>
  );
};

export default DownloadOptions;
