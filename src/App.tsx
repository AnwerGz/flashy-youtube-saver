
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExportGuide from "./pages/ExportGuide";
import LogHistory from "./pages/LogHistory";
import { initializeDefaultDirectories } from "./utils/ytdlp";
import { useLogHistory } from "./pages/LogHistory";

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
  
  // Initialize default directories when app starts
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDefaultDirectories();
      } catch (error) {
        // Don't show the Capacitor Plugin error to the user
        // Just log it for debugging purposes
        addLog("Storage initialization: Using browser storage instead of native storage.", 'info');
        console.log("Storage initialization: Using browser storage. Native storage may not be available in this environment.");
      }
    };
    
    initialize();
  }, [addLog]);
  
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
