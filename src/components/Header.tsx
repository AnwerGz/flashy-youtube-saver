
import React, { useState } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, LanguageKey, languages } from '@/context/LanguageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-flash-900/90 backdrop-blur-sm border-b border-flash-200 dark:border-flash-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-0 rounded-full text-white">
            <img 
              src="https://raw.githubusercontent.com/DeJavi08/YTPlaylist-DW/refs/heads/program/thunder.png" 
              alt="Flash Converter" 
              className="h-10 w-10 rounded-xl"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-muted" : ""}
                >
                  {lang.nativeName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Toggle
            aria-label={t('dark_mode')}
            pressed={theme === 'dark'}
            onPressedChange={toggleTheme}
            size="sm"
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Toggle>
        </div>
      </div>
    </header>
  );
};

export default Header;
