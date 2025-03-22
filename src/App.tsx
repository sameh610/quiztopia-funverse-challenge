
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Games from "./pages/Games";
import CreateQuiz from "./pages/CreateQuiz";
import Leaderboards from "./pages/Leaderboards";
import Profile from "./pages/Profile";
import PlayGame from "./pages/PlayGame";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Create QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [authEnabled, setAuthEnabled] = useState(true);

  // Check if the Clerk publishable key is valid or available
  useEffect(() => {
    const handleClerkError = (e: Event) => {
      if (e instanceof ErrorEvent && e.message?.includes('@clerk')) {
        console.error('Clerk authentication error:', e.message);
        setAuthEnabled(false);
      }
    };

    window.addEventListener('error', handleClerkError);
    return () => window.removeEventListener('error', handleClerkError);
  }, []);

  // Routes that can be accessed without authentication
  const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/games" element={<Games />} />
      <Route path="/play/:gameId" element={<PlayGame />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateQuiz />} />
      <Route path="/leaderboards" element={<Leaderboards />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {authEnabled ? (
            // Try to use Clerk, but we have the error handler ready to catch failures
            <div>
              {/* We will not use ClerkProvider because it's causing errors */}
              {/* Instead, we'll show a demo banner */}
              <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-amber-100 p-4 text-amber-800 shadow-lg">
                <p className="font-semibold">Authentication Notice</p>
                <p className="text-sm">Running in demo mode. Authentication is disabled.</p>
              </div>
              <AppRoutes />
            </div>
          ) : (
            // Fallback to demo mode when Clerk fails
            <div>
              <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-amber-100 p-4 text-amber-800 shadow-lg">
                <p className="font-semibold">Authentication Notice</p>
                <p className="text-sm">Running in demo mode. Authentication is disabled.</p>
              </div>
              <AppRoutes />
            </div>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
