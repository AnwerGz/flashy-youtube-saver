
import React, { useState } from 'react';
import { Menu, Moon, Sun, Globe, HomeIcon, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Animation for hamburger menu icon
  const topBarClass = `transition-all duration-300 h-0.5 w-6 bg-current ${
    isSidebarOpen ? 'translate-y-1.5 rotate-45' : ''
  }`;
  const middleBarClass = `transition-all duration-300 h-0.5 w-6 bg-current my-1 ${
    isSidebarOpen ? 'opacity-0' : ''
  }`;
  const bottomBarClass = `transition-all duration-300 h-0.5 w-6 bg-current ${
    isSidebarOpen ? '-translate-y-1.5 -rotate-45' : ''
  }`;

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-flash-900/90 backdrop-blur-sm border-b border-flash-200 dark:border-flash-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 flex flex-col items-center justify-center"
                aria-label={t('menu')}
              >
                <div className={topBarClass}></div>
                <div className={middleBarClass}></div>
                <div className={bottomBarClass}></div>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-64 sm:max-w-sm">
              <SheetHeader className="pb-6">
                <SheetTitle>{t('app_name')}</SheetTitle>
                <SheetDescription>
                  {t('flash_converter_description')}
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 w-full text-left" 
                  onClick={() => {
                    navigate("/");
                    setIsSidebarOpen(false);
                  }}
                >
                  <HomeIcon className="h-5 w-5" />
                  {t('home')}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 w-full text-left" 
                  onClick={() => {
                    navigate("/logs");
                    setIsSidebarOpen(false);
                  }}
                >
                  <ClipboardList className="h-5 w-5" />
                  {t('logs')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-bold text-flash-800 dark:text-flash-300">
            {t('app_name')}
          </h1>
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
