import { Button } from "./ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b border-foreground/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-foreground" />
            <span className="font-sans text-foreground font-light tracking-wide">
            Flow Habits AI
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              About
            </a>
            <a href="#services" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              Services
            </a>
            <a href="#stories" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              Stories
            </a>
            <a href="#journal" className="font-sans text-sm text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase">
              Journal
            </a>
          </div>
          
          <Button 
            className="bg-foreground/10 hover:bg-foreground/20 text-foreground backdrop-blur-sm border border-foreground/20 rounded-full px-6 font-sans tracking-wide uppercase text-sm transition-all duration-300"
          >
            Book a Session
            <span className="ml-2">•</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;