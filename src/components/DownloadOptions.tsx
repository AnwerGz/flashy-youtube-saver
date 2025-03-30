
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileAudio, FileVideo, FolderOpen, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { downloadVideo, requestStoragePermission } from '@/utils/ytdlp';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DownloadOptionsProps {
  isVisible: boolean;
  isPlaylist: boolean;
  url: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ isVisible, isPlaylist, url }) => {
  const { t } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState('mp3');
  const [outputPath, setOutputPath] = useState('Downloads/FlashConverter');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Quality settings
  const [mp3Quality, setMp3Quality] = useState("192");
  const [mp4Quality, setMp4Quality] = useState("720");
  const [mp3VBR, setMp3VBR] = useState(false);
  
  if (!isVisible) return null;

  const handleChooseLocation = async () => {
    // Request storage permission for Android
    const permissionGranted = await requestStoragePermission();
    
    if (permissionGranted) {
      if (typeof (window as any).Capacitor !== 'undefined') {
        // In a real app, we would use Capacitor's Filesystem plugin to select a directory
        const { Filesystem } = (window as any).Capacitor.Plugins;
        try {
          // This would actually be implemented in the native plugin
          // For demo we'll just show a success message
          toast.success(t('folder_selected'));
          setOutputPath('Storage/Download/FlashConverter');
        } catch (error) {
          console.error("Error selecting folder:", error);
          toast.error(t('folder_error'));
        }
      } else {
        // Browser environment - just simulate it
        toast.success(t('folder_selected'));
        setOutputPath('Downloads/FlashConverter');
      }
    } else {
      toast.error(t('storage_permission_required'));
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const formatLabel = selectedFormat === 'mp3' 
      ? `MP3 (${mp3Quality}kbps${mp3VBR ? ' VBR' : ''})`
      : `MP4 (${mp4Quality}p)`;
      
    toast.info(t('starting_download', { format: formatLabel }));
    
    try {
      // Download using our ytdlp utility
      const success = await downloadVideo(
        url,
        selectedFormat,
        outputPath,
        selectedFormat === 'mp3' ? mp3Quality : mp4Quality,
        selectedFormat === 'mp3',
        (progress) => {
          setDownloadProgress(progress);
        }
      );
      
      if (success) {
        toast.success(t('download_completed', { path: outputPath }));
      } else {
        toast.error(t('download_failed'));
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(t('download_failed'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="border-flash-200 dark:border-flash-800 dark:bg-flash-900 shadow-md w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-4">{t('download_options')}</h3>
        
        <Tabs defaultValue="mp3" onValueChange={setSelectedFormat} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="mp3" className="flex items-center gap-2 data-[state=active]:bg-flash-500 data-[state=active]:text-white">
              <FileAudio className="h-4 w-4" />
              <span>{t('audio_format')}</span>
            </TabsTrigger>
            <TabsTrigger value="mp4" className="flex items-center gap-2 data-[state=active]:bg-flash-500 data-[state=active]:text-white">
              <FileVideo className="h-4 w-4" />
              <span>{t('video_format')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mp3" className="mt-0 space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              {t('mp3_description')}
              {isPlaylist && <span> {t('playlist_mp3_note')}</span>}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('audio_quality')}</label>
                  <span className="text-sm font-medium">{mp3Quality} kbps</span>
                </div>
                <Select value={mp3Quality} onValueChange={setMp3Quality}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('select_quality')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128 kbps</SelectItem>
                    <SelectItem value="192">192 kbps</SelectItem>
                    <SelectItem value="256">256 kbps</SelectItem>
                    <SelectItem value="320">320 kbps ({t('best')})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('variable_bitrate')}</label>
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
              {t('mp4_description')}
              {isPlaylist && <span> {t('playlist_mp4_note')}</span>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('video_quality')}</label>
                <span className="text-sm font-medium">{mp4Quality}p</span>
              </div>
              <Select value={mp4Quality} onValueChange={setMp4Quality}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('select_quality')} />
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
            <label className="text-sm font-medium mb-1 block">{t('output_location')}</label>
            <div className="flex items-center gap-2">
              <div className="flex-grow bg-muted p-2 rounded text-sm truncate dark:bg-flash-800">
                {outputPath}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-flash-300 hover:bg-flash-50 dark:border-flash-700 dark:hover:bg-flash-800"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {t('browse')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('storage_permission')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('storage_permission_description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleChooseLocation}>
                      {t('grant_permission')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {isDownloading && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('downloading')}</span>
                <span>{downloadProgress}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full bg-flash-500 hover:bg-flash-600 text-white mt-2"
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('downloading')}...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{t('download')} {selectedFormat.toUpperCase()}</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadOptions;
