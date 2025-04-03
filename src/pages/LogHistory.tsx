
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/context/LanguageContext';
import { Home, AlertCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// Create a LogContext to manage logs across the app
export const useLogHistory = () => {
  const storageKey = 'flash_converter_logs';
  
  const getLogs = (): LogEntry[] => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  };
  
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const logs = getLogs();
    const newLog: LogEntry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    logs.push(newLog);
    localStorage.setItem(storageKey, JSON.stringify(logs));
    return newLog;
  };
  
  const clearLogs = () => {
    localStorage.setItem(storageKey, JSON.stringify([]));
  };
  
  return {
    getLogs,
    addLog,
    clearLogs
  };
};

const LogHistory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getLogs, clearLogs } = useLogHistory();
  const logs = getLogs();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getLogColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-flash-50 to-white dark:from-flash-900 dark:to-flash-950">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-flash-800 dark:text-flash-300">
            {t('log_history')}
          </h1>
          <p className="text-lg text-flash-700 dark:text-flash-400 max-w-xl mx-auto">
            {t('download_history')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {logs.length > 0 ? (
            <>
              <div className="flex justify-between mb-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t('back_to_home')}
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={clearLogs}
                >
                  {t('clear_logs')}
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-black/10 dark:bg-black/30 backdrop-blur-sm">
                <ScrollArea className="h-[500px] w-full p-4">
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    {logs.map((log, index) => (
                      <div key={index} className={`mb-2 ${getLogColor(log.type)}`}>
                        <span className="opacity-75">[{formatTimestamp(log.timestamp)}]</span> {log.message}
                      </div>
                    ))}
                  </pre>
                </ScrollArea>
              </div>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('no_logs')}</AlertTitle>
              <AlertDescription>
                {t('no_downloads_yet')}. <Button variant="link" onClick={() => navigate('/')}>{t('go_to_home')}</Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogHistory;
