
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { getVideoInfo } from '@/utils/ytdlp';
import { useLanguage } from '@/context/LanguageContext';

interface DownloadFormProps {
  onLinkSubmit: (url: string, videoInfo: any) => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onLinkSubmit }) => {
  const { t } = useLanguage();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl) {
      toast.error(t('enter_url'));
      return;
    }

    const isValidYoutubeUrl = youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be');
    
    if (!isValidYoutubeUrl) {
      toast.error(t('invalid_url'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Get video info from yt-dlp
      const videoInfo = await getVideoInfo(youtubeUrl);
      
      if (videoInfo) {
        onLinkSubmit(youtubeUrl, videoInfo);
      } else {
        toast.error(t('video_info_failed'));
      }
    } catch (error) {
      console.error("Error fetching video info:", error);
      toast.error(t('video_info_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder={t('paste_link')}
            className="pl-9 py-6 bg-white border-flash-200 focus-visible:ring-flash-500 dark:bg-flash-950 dark:border-flash-800"
          />
        </div>
        <Button 
          type="submit" 
          className="bg-flash-500 hover:bg-flash-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('processing')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{t('analyze')}</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DownloadForm;
