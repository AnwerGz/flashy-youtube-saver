
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Heart, Download, PlayCircle, FolderOpen, ListMusic, ArrowDown, Zap } from 'lucide-react';
import DeveloperCard from './DeveloperCard';
import { Card, CardContent } from '@/components/ui/card';

const developers = [
  {
    name: 'DeJavi',
    photo: 'https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/master/src/dejavi.jpg',
    githubUrl: 'https://github.com/DeJavi08/'
  },
  {
    name: 'D38R15',
    photo: 'https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/master/src/wokabi.jpg',
    githubUrl: 'https://github.com/Hamzah82'
  },
  {
    name: 'DevilGun',
    photo: 'https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/master/src/electrogaming.png',
    githubUrl: 'https://github.com/WeebCoderr'
  }
];

const Footer = () => {
  return (
    <footer className="mt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-flash-50 to-flash-100 p-6 rounded-xl border border-flash-200 mb-10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-flash-800 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-flash-500" />
                  About Flash Converter
                </h2>
                <p className="text-sm text-flash-700 mb-4">
                  Flash Converter is a powerful tool that allows you to download YouTube videos and playlists 
                  in either MP3 or MP4 format with customizable quality settings. Perfect for creating your offline 
                  media library quickly and easily.
                </p>
                <p className="text-sm text-flash-700">
                  Our application uses optimized algorithms to provide the fastest download speeds 
                  while maintaining the highest possible quality for your media files.
                </p>
              </div>
              
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-flash-800 flex items-center">
                  <ArrowDown className="h-5 w-5 mr-2 text-flash-500" />
                  How To Use
                </h2>
                <ol className="text-sm text-flash-700 space-y-3 list-decimal pl-5">
                  <li>Paste a YouTube video or playlist URL into the input field</li>
                  <li>Check the video preview to confirm your selection</li>
                  <li>Choose between MP3 (audio) or MP4 (video) format</li>
                  <li>Select your preferred quality settings</li>
                  <li>Choose your output folder location</li>
                  <li>Click download and enjoy your offline content!</li>
                </ol>
              </div>
              
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-flash-800 flex items-center">
                  <ListMusic className="h-5 w-5 mr-2 text-flash-500" />
                  Key Features
                </h2>
                <ul className="text-sm text-flash-700 space-y-3">
                  <li className="flex items-start">
                    <Download className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>High-quality MP3 & MP4 downloads with adjustable quality</span>
                  </li>
                  <li className="flex items-start">
                    <ListMusic className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>Batch download entire YouTube playlists at once</span>
                  </li>
                  <li className="flex items-start">
                    <PlayCircle className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>Preview thumbnails before downloading videos</span>
                  </li>
                  <li className="flex items-start">
                    <FolderOpen className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>Flexible output location selection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-center text-flash-800">Meet the Developers</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex justify-center space-x-4 pb-4">
              {developers.map((developer) => (
                <DeveloperCard key={developer.name} developer={developer} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        <div className="text-center">
          <a 
            href="https://saweria.co/DeJavi08"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-flash-500 hover:bg-flash-600 text-white">
              <Heart className="h-4 w-4 mr-2 text-white" />
              Support the Developers
            </Button>
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            © 2023 Flash Converter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
