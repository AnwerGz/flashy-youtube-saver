
import React from 'react';
import { Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-flash-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-flash-500 p-2 rounded-full text-white">
            <Zap className="h-6 w-6 animate-flash" />
          </div>
          <div className="font-bold text-2xl text-flash-600 tracking-tight">
            Flash <span className="text-flash-800">Converter</span>
          </div>
        </div>
        <div className="text-sm font-medium text-flash-700">
          YouTube MP3/MP4 Downloader
        </div>
      </div>
    </header>
  );
};

export default Header;
