import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Heart, Download, PlayCircle, FolderOpen, ListMusic, ArrowDown, Zap } from 'lucide-react';
import DeveloperCard from './DeveloperCard';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
    <footer className="mt-8 pb-6 dark:bg-flash-900/50">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-flash-50 to-flash-100 dark:from-flash-800/30 dark:to-flash-800/20 p-6 rounded-xl border border-flash-200 dark:border-flash-700/50 mb-10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-flash-800 dark:text-flash-300 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-flash-500" />
                  {t('about_title')}
                </h2>
                <p className="text-sm text-flash-700 dark:text-flash-400 mb-4">
                  {t('about_description')}
                </p>
                <p className="text-sm text-flash-700 dark:text-flash-400">
                  {t('about_description_2')}
                </p>
              </div>
              
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-flash-800 dark:text-flash-300 flex items-center">
                  <ArrowDown className="h-5 w-5 mr-2 text-flash-500" />
                  {t('how_to_use_title')}
                </h2>
                <ol className="text-sm text-flash-700 dark:text-flash-400 space-y-3 list-decimal pl-5">
                  <li>{t('step_1')}</li>
                  <li>{t('step_2')}</li>
                  <li>{t('step_3')}</li>
                  <li>{t('step_4')}</li>
                  <li>{t('step_5')}</li>
                  <li>{t('step_6')}</li>
                </ol>
              </div>
              
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-4 text-flash-800 dark:text-flash-300 flex items-center">
                  <ListMusic className="h-5 w-5 mr-2 text-flash-500" />
                  {t('features_title')}
                </h2>
                <ul className="text-sm text-flash-700 dark:text-flash-400 space-y-3">
                  <li className="flex items-start">
                    <Download className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>{t('feature_1')}</span>
                  </li>
                  <li className="flex items-start">
                    <ListMusic className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>{t('feature_2')}</span>
                  </li>
                  <li className="flex items-start">
                    <PlayCircle className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>{t('feature_3')}</span>
                  </li>
                  <li className="flex items-start">
                    <FolderOpen className="h-4 w-4 text-flash-500 mr-2 mt-0.5" />
                    <span>{t('feature_4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-center text-flash-800 dark:text-flash-300">{t('meet_developers')}</h2>
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
              {t('support_developers')}
            </Button>
          </a>
          <p className="text-sm text-muted-foreground dark:text-flash-600 mt-4">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
