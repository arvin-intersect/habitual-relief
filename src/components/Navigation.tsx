import { Button } from "./ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b border-foreground/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-foreground" />
            <span className="font-sans text-foreground font-light tracking-wide">
            Flow Habits AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              About
            </a>
            <Link to="/journal" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              Journal
            </Link>
            <Link to="/leaderboard" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              Leaderboard
            </Link>
            <a href="#contact" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              Contact
            </a>
          </div>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                className="bg-foreground/10 hover:bg-foreground/20 text-foreground backdrop-blur-sm border border-foreground/20 rounded-full px-6 font-sans tracking-wide uppercase text-sm transition-all duration-300"
              >
                Sign In
                <span className="ml-2">•</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;