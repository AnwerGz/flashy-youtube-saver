
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadFormProps {
  onLinkSubmit: (url: string) => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onLinkSubmit }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    const isValidYoutubeUrl = youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be');
    
    if (!isValidYoutubeUrl) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate getting video info (in a real app, this would call an API)
    setTimeout(() => {
      onLinkSubmit(youtubeUrl);
      setIsLoading(false);
    }, 1000);
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
            placeholder="Paste YouTube URL here (video or playlist)"
            className="pl-9 py-6 bg-white border-flash-200 focus-visible:ring-flash-500"
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
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Analyze</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DownloadForm;
