import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal"; // Import new Journal page
import Leaderboard from "./pages/Leaderboard"; // Import new Leaderboard page

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key from .env.local");
}

const queryClient = new QueryClient();

// Custom component to handle Clerk's redirect
const ClerkRoutes = () => {
  // useNavigate is used internally by React Router components.
  // Clerk components like RedirectToSignIn will often use window.location.assign or
  // integrate directly with BrowserRouter.
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/journal" element={
        <>
          <SignedIn>
            <Journal />
          </SignedIn>
          <SignedOut>
            {/* RedirectToSignIn will handle navigation on its own with BrowserRouter */}
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />
      <Route path="/leaderboard" element={
        <>
          <SignedIn>
            <Leaderboard />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY} // Corrected typo here
    // Removed the 'navigate' prop as it's not a valid prop for ClerkProvider
    // Clerk components will generally work correctly with BrowserRouter's context.
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClerkRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;