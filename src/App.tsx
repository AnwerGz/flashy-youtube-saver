
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExportGuide from "./pages/ExportGuide";
import LogHistory from "./pages/LogHistory";
import { initializeDefaultDirectories, initializeBinaries } from "./utils/ytdlp";
import { useLogHistory } from "./pages/LogHistory";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable network-based refetching to support offline mode
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false
    }
  }
});

// Create a wrapper component to use hooks
const AppContent = () => {
  const { addLog } = useLogHistory();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize default directories and binaries when app starts
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDefaultDirectories();
        await initializeBinaries();
        setIsInitialized(true);
        addLog("Application successfully initialized", 'success');
      } catch (error) {
        console.error("Initialization error:", error);
        addLog(`Initialization error: ${(error as Error).message}`, 'error');
        toast.error("Error initializing app. Some features may not work correctly.");
        // Still mark as initialized to allow app to proceed
        setIsInitialized(true);
      }
    };
    
    initialize();
  }, [addLog]);
  
  if (!isInitialized) {
    // Show simple loading screen while initializing
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-flash-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-flash-700 dark:text-flash-300">Initializing application...</p>
        </div>
      </div>
    );
  }
  
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/logs" element={<LogHistory />} />
        <Route path="/export-guide" element={<ExportGuide />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
