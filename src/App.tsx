
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Games from "./pages/Games";
import CreateQuiz from "./pages/CreateQuiz";
import Leaderboards from "./pages/Leaderboards";
import Profile from "./pages/Profile";
import PlayGame from "./pages/PlayGame";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// We would normally use an environment variable here, but for simplicity
// in this demo we're hardcoding a publishable key
const PUBLISHABLE_KEY = "pk_test_Y2xlcmsuZGV2LnF1aXp0b3BpYS50ZXN0LjEyMzQ1";

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    clerkJSVersion="5.56.0-snapshot.v20250312225817"
    signInUrl="/login"
    signUpUrl="/login"
    afterSignInUrl="/"
    afterSignUpUrl="/"
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<Games />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/play/:gameId" element={<PlayGame />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
