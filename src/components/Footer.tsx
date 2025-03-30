
import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import DeveloperCard from './DeveloperCard';

// Developer data
const developers = [
  {
    name: "DeJavi",
    photo: "https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/master/src/dejavi.jpg",
    githubUrl: "https://github.com/DeJavi08/"
  },
  {
    name: "D38R15",
    photo: "https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/master/src/wokabi.jpg",
    githubUrl: "https://github.com/Hamzah82"
  },
  {
    name: "DevilGun",
    photo: "https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/master/src/electrogaming.png",
    githubUrl: "https://github.com/WeebCoderr"
  }
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-flash-900 border-t border-flash-200 dark:border-flash-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-flash-800 dark:text-flash-300">About Flash Converter</h3>
            <p className="text-flash-600 dark:text-flash-400 mb-4">
              Flash Converter is a powerful tool that allows you to download YouTube videos and playlists in either MP3 or MP4 format with customizable quality settings. Perfect for creating your offline media library quickly and easily.
            </p>
            <p className="text-flash-600 dark:text-flash-400">
              Our application uses optimized algorithms to provide the fastest download speeds while maintaining the highest possible quality for your media files.
            </p>
          </div>

          {/* Column 2 - How to Use */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-flash-800 dark:text-flash-300">How To Use</h3>
            <ol className="space-y-2 text-flash-600 dark:text-flash-400">
              <li className="flex gap-2">
                <span className="font-bold text-flash-500">1.</span>
                <p>Paste a YouTube video or playlist URL into the input field</p>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-flash-500">2.</span>
                <p>Check the video preview to confirm your selection</p>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-flash-500">3.</span>
                <p>Choose between MP3 (audio) or MP4 (video) format</p>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-flash-500">4.</span>
                <p>Select your preferred quality settings</p>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-flash-500">5.</span>
                <p>Choose your output folder location</p>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-flash-500">6.</span>
                <p>Click download and enjoy your offline content!</p>
              </li>
            </ol>
          </div>

          {/* Column 3 - Key Features */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-flash-800 dark:text-flash-300">Key Features</h3>
            <div className="space-y-3">
              <div className="bg-flash-50 dark:bg-flash-800/50 p-3 rounded-md">
                <p className="text-flash-700 dark:text-flash-300">High-quality MP3 & MP4 downloads with adjustable quality</p>
              </div>
              <div className="bg-flash-50 dark:bg-flash-800/50 p-3 rounded-md">
                <p className="text-flash-700 dark:text-flash-300">Batch download entire YouTube playlists at once</p>
              </div>
              <div className="bg-flash-50 dark:bg-flash-800/50 p-3 rounded-md">
                <p className="text-flash-700 dark:text-flash-300">Preview thumbnails before downloading videos</p>
              </div>
              <div className="bg-flash-50 dark:bg-flash-800/50 p-3 rounded-md">
                <p className="text-flash-700 dark:text-flash-300">Flexible output location selection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Section with Carousel */}
        <div className="mt-12">
          <h3 className="text-lg font-bold mb-4 text-flash-800 dark:text-flash-300 text-center">Meet the Developers</h3>
          <div className="relative px-12">
            <Carousel className="w-full max-w-3xl mx-auto">
              <CarouselContent>
                {developers.map((developer, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <DeveloperCard developer={developer} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Footer bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="text-flash-600 dark:text-flash-400 mb-4 md:mb-0">© 2025 Flash Converter. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/DeJavi08/Flash-YTDW" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-flash-600 hover:text-flash-800 dark:text-flash-400 dark:hover:text-flash-300"
            >
              <Github className="h-5 w-5 mr-1" />
              <span>Github</span>
            </a>
            <a 
              href="https://saweria.co/DeJavi08" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-flash-600 hover:text-flash-800 dark:text-flash-400 dark:hover:text-flash-300"
            >
              <span>Support the Developers</span>
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
