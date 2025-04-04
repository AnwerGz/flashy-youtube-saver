
import { VideoInfo } from './types';

// Mock responses for demo mode
export const getDemoVideoInfo = (url: string): VideoInfo => {
  const isPlaylist = url.includes('list=');
  
  if (isPlaylist) {
    return {
      id: 'playlist-id',
      title: 'Sample YouTube Playlist',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      formats: [],
      isPlaylist: true,
      playlistTitle: 'Sample YouTube Playlist',
      playlistCount: 25,
      playlistItems: Array(25).fill(null).map((_, i) => ({
        id: `video-${i}`,
        title: `Sample Video ${i + 1}`,
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '3:45',
        formats: [],
        isPlaylist: false
      }))
    };
  } else {
    return {
      id: 'video-id',
      title: 'Sample YouTube Video',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '3:45',
      formats: [
        {
          formatId: 'audio-1',
          extension: 'mp3',
          audioQuality: '128kbps',
          type: 'audio',
          quality: '128kbps'
        },
        {
          formatId: 'audio-2',
          extension: 'mp3',
          audioQuality: '192kbps',
          type: 'audio',
          quality: '192kbps'
        },
        {
          formatId: 'audio-3',
          extension: 'mp3',
          audioQuality: '256kbps',
          type: 'audio',
          quality: '256kbps'
        },
        {
          formatId: 'audio-4',
          extension: 'mp3',
          audioQuality: '320kbps',
          type: 'audio',
          quality: '320kbps'
        },
        {
          formatId: 'video-1',
          extension: 'mp4',
          resolution: '360p',
          type: 'video',
          quality: '360p'
        },
        {
          formatId: 'video-2',
          extension: 'mp4',
          resolution: '480p',
          type: 'video',
          quality: '480p'
        },
        {
          formatId: 'video-3',
          extension: 'mp4',
          resolution: '720p',
          type: 'video',
          quality: '720p'
        },
        {
          formatId: 'video-4',
          extension: 'mp4',
          resolution: '1080p',
          type: 'video',
          quality: '1080p'
        }
      ],
      isPlaylist: false
    };
  }
};

// Simulate download progress
export const simulateDownload = (
  startTime: Date, 
  progressCallback: (progress: number) => void,
  isAudio: boolean,
  finalOutputPath: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      progressCallback(Math.min(progress, 100));
      if (progress % 25 === 0) {
        addToLogHistory(`Download progress: ${progress}% (Demo mode)`, "info");
      }
      if (progress >= 100) {
        clearInterval(interval);
        const endTime = new Date();
        const formattedEndTime = endTime.toLocaleTimeString();
        const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
        
        addToLogHistory(`Download completed at ${formattedEndTime} (took ${duration} seconds)`, "success");
        addToLogHistory(`File saved to: ${finalOutputPath}/demo_video${isAudio ? '.mp3' : '.mp4'} (Demo mode)`, "success");
        toast.success(`Download completed! (Demo mode)`);
        resolve(true);
      }
    }, 200);
  });
};

// Import from core for demos
import { addToLogHistory } from './core';
import { toast } from "sonner";
