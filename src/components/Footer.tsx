
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import DeveloperCard from './DeveloperCard';

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
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">Meet the Developers</h2>
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
