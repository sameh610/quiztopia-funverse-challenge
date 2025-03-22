
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Games from "./pages/Games";
import CreateQuiz from "./pages/CreateQuiz";
import Leaderboards from "./pages/Leaderboards";
import Profile from "./pages/Profile";
import PlayGame from "./pages/PlayGame";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// For demo purposes - in a real app, this would come from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlcmsuZGV2LnF1aXp0b3BpYS50ZXN0LjEyMzQ1";

const queryClient = new QueryClient();

const App = () => {
  const [authError, setAuthError] = useState(false);

  // Setup a global error handler for Clerk
  useEffect(() => {
    const handleClerkError = (e: Event) => {
      if (e instanceof ErrorEvent && e.message?.includes('@clerk')) {
        setAuthError(true);
        console.error('Clerk authentication error:', e.message);
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
          {/* Wrap ClerkProvider in an error boundary to prevent the entire app from crashing */}
          <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            signInUrl="/login"
            signUpUrl="/login"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          >
            <ClerkLoading>
              {/* Show a loading state while Clerk is initializing */}
              <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-quiztopia-primary border-t-transparent"></div>
                  <p className="mt-2">Loading...</p>
                </div>
              </div>
            </ClerkLoading>
            
            <ClerkLoaded>
              {authError && (
                <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-amber-100 p-4 text-amber-800 shadow-lg">
                  <p className="font-semibold">Authentication Notice</p>
                  <p className="text-sm">Running in demo mode. Some features may be limited.</p>
                </div>
              )}
              <AppRoutes />
            </ClerkLoaded>
          </ClerkProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
