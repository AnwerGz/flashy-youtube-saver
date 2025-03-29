
import React, { useState } from 'react';
import Header from '@/components/Header';
import DownloadForm from '@/components/DownloadForm';
import VideoPreview from '@/components/VideoPreview';
import DownloadOptions from '@/components/DownloadOptions';
import Footer from '@/components/Footer';
import { Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Define video info type
interface VideoInfo {
  type: 'video' | 'playlist';
  title: string;
  thumbnail: string;
  duration?: string;
  videoCount?: number;
}

const Index = () => {
  const { t } = useLanguage();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleLinkSubmit = (url: string) => {
    // In a real app, this would make an API call to get video info
    // For this demo, we'll simulate the response
    
    // Check if it's a playlist (contains "list=" in the URL)
    const isPlaylist = url.includes('list=');
    
    if (isPlaylist) {
      setVideoInfo({
        type: 'playlist',
        title: 'Sample YouTube Playlist - Best Songs Collection',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        videoCount: 25
      });
    } else {
      setVideoInfo({
        type: 'video',
        title: 'Sample YouTube Video - Amazing Content',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:45'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-flash-50 to-white dark:from-flash-900 dark:to-flash-950">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="bg-flash-500 p-3 rounded-full inline-flex text-white">
              <Zap className="h-8 w-8 animate-flash" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-flash-800 dark:text-flash-300">
            {t('app_name')}
          </h1>
          <p className="text-lg text-flash-700 dark:text-flash-400 max-w-xl mx-auto">
            {t('paste_link')}
          </p>
        </div>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <DownloadForm onLinkSubmit={handleLinkSubmit} />
          
          {videoInfo && (
            <div className="space-y-6 animate-fade-in">
              <VideoPreview videoInfo={videoInfo} />
              <DownloadOptions isVisible={!!videoInfo} isPlaylist={videoInfo?.type === 'playlist'} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
