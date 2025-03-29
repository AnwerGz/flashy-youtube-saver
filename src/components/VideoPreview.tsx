
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ListMusic, Youtube } from 'lucide-react';

interface VideoPreviewProps {
  videoInfo: {
    type: 'video' | 'playlist';
    title: string;
    thumbnail: string;
    duration?: string;
    videoCount?: number;
  } | null;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoInfo }) => {
  if (!videoInfo) return null;

  return (
    <Card className="w-full overflow-hidden border-flash-200 shadow-md">
      <CardContent className="p-0">
        {videoInfo.type === 'video' ? (
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0">
              <img 
                src={videoInfo.thumbnail} 
                alt={videoInfo.title}
                className="w-full h-full object-cover"
              />
              {videoInfo.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{videoInfo.duration}</span>
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-sm text-flash-600 font-medium flex items-center gap-1 mb-1">
                  <Youtube className="h-4 w-4" />
                  <span>YouTube Video</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{videoInfo.title}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Ready to download. Choose your format below.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0">
              <img 
                src={videoInfo.thumbnail} 
                alt={videoInfo.title}
                className="w-full h-full object-cover"
              />
              {videoInfo.videoCount && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded flex items-center gap-1">
                  <ListMusic className="h-3 w-3" />
                  <span>{videoInfo.videoCount} videos</span>
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col justify-between">
              <div>
                <div className="text-sm text-flash-600 font-medium flex items-center gap-1 mb-1">
                  <ListMusic className="h-4 w-4" />
                  <span>YouTube Playlist</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{videoInfo.title}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {videoInfo.videoCount} videos in this playlist. All videos will be processed.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPreview;
