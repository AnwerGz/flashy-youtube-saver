
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Heart, Download, PlayCircle, FolderOpen, ListMusic } from 'lucide-react';
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

const features = [
  {
    icon: <Download className="h-8 w-8 text-flash-500" />,
    title: "MP3/MP4 Downloads",
    description: "Convert and download YouTube videos to MP3 or MP4 format"
  },
  {
    icon: <ListMusic className="h-8 w-8 text-flash-500" />,
    title: "Playlist Support",
    description: "Batch download entire YouTube playlists at once"
  },
  {
    icon: <PlayCircle className="h-8 w-8 text-flash-500" />,
    title: "Video Preview",
    description: "Preview thumbnails before downloading videos or playlists"
  },
  {
    icon: <FolderOpen className="h-8 w-8 text-flash-500" />,
    title: "Custom Output",
    description: "Choose your preferred download location"
  }
];

const Footer = () => {
  return (
    <footer className="mt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-flash-800">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-flash-200 hover:shadow-md transition-all hover:border-flash-400">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-flash-100 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-flash-700">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-center text-flash-800">Meet the Developers</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
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
