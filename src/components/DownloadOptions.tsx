
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileAudio, FileVideo, FolderOpen, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DownloadOptionsProps {
  isVisible: boolean;
  isPlaylist: boolean;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ isVisible, isPlaylist }) => {
  const [selectedFormat, setSelectedFormat] = useState('mp3');
  const [outputPath, setOutputPath] = useState('Downloads/FlashConverter');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Quality settings
  const [mp3Quality, setMp3Quality] = useState("192");
  const [mp4Quality, setMp4Quality] = useState("720");
  const [mp3VBR, setMp3VBR] = useState(false);
  
  if (!isVisible) return null;

  const handleChooseLocation = () => {
    // In a real app, this would trigger a file system dialog
    // For this demo, we'll simulate it with a toast
    toast.success("Output folder selected: Downloads/FlashConverter");
    setOutputPath('Downloads/FlashConverter');
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download process
    const formatLabel = selectedFormat === 'mp3' 
      ? `MP3 (${mp3Quality}kbps${mp3VBR ? ' VBR' : ''})`
      : `MP4 (${mp4Quality}p)`;
      
    toast.info(`Starting download as ${formatLabel}...`);
    
    setTimeout(() => {
      toast.success(`Download completed! Saved to ${outputPath}`);
      setIsDownloading(false);
    }, 3000);
  };

  return (
    <Card className="border-flash-200 shadow-md w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">Download Options</h3>
        
        <Tabs defaultValue="mp3" onValueChange={setSelectedFormat} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="mp3" className="flex items-center gap-2 data-[state=active]:bg-flash-500 data-[state=active]:text-white">
              <FileAudio className="h-4 w-4" />
              <span>Audio (MP3)</span>
            </TabsTrigger>
            <TabsTrigger value="mp4" className="flex items-center gap-2 data-[state=active]:bg-flash-500 data-[state=active]:text-white">
              <FileVideo className="h-4 w-4" />
              <span>Video (MP4)</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mp3" className="mt-0 space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Extract audio from the video in MP3 format with high quality.
              {isPlaylist && " All videos in the playlist will be converted to MP3."}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Audio Quality</label>
                  <span className="text-sm font-medium">{mp3Quality} kbps</span>
                </div>
                <Select value={mp3Quality} onValueChange={setMp3Quality}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128 kbps</SelectItem>
                    <SelectItem value="192">192 kbps</SelectItem>
                    <SelectItem value="256">256 kbps</SelectItem>
                    <SelectItem value="320">320 kbps (Best)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Variable Bit Rate (VBR)</label>
                <Switch 
                  checked={mp3VBR} 
                  onCheckedChange={setMp3VBR} 
                  className="data-[state=checked]:bg-flash-500"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mp4" className="mt-0 space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Download video in MP4 format with selected quality.
              {isPlaylist && " All videos in the playlist will be downloaded as MP4."}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Video Quality</label>
                <span className="text-sm font-medium">{mp4Quality}p</span>
              </div>
              <Select value={mp4Quality} onValueChange={setMp4Quality}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="360">360p</SelectItem>
                  <SelectItem value="480">480p</SelectItem>
                  <SelectItem value="720">720p (HD)</SelectItem>
                  <SelectItem value="1080">1080p (Full HD)</SelectItem>
                  <SelectItem value="1440">1440p (2K)</SelectItem>
                  <SelectItem value="2160">2160p (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Output Location</label>
            <div className="flex items-center gap-2">
              <div className="flex-grow bg-muted p-2 rounded text-sm truncate">
                {outputPath}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleChooseLocation}
                className="border-flash-300 hover:bg-flash-50"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full bg-flash-500 hover:bg-flash-600 text-white mt-2"
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Downloading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Download {selectedFormat.toUpperCase()}</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadOptions;
