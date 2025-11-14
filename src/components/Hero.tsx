import { Button } from "./ui/button";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Wellness background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-foreground/10 backdrop-blur-md rounded-full border border-foreground/20">
            <span className="text-xs font-sans tracking-widest uppercase text-foreground/90">Balance</span>
            <div className="w-10 h-5 bg-foreground/20 rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-foreground rounded-full transition-all duration-300" />
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-foreground leading-tight tracking-tight">
            If only finding balance were<br />
            <span className="font-normal">as simple as flipping a switch.</span>
          </h1>
          
          {/* Subheading */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg md:text-xl font-sans font-light text-foreground/90">
              You're closer than you think.
            </p>
            <p className="text-lg md:text-xl font-sans font-light text-foreground/90">
              And every step you take makes it clearer.
            </p>
          </div>
          
          {/* CTA */}
          <div className="pt-8">
            <Button 
              onClick={scrollToCalculator}
              className="bg-foreground/15 hover:bg-foreground/25 text-foreground backdrop-blur-md border border-foreground/30 rounded-full px-10 py-7 font-sans tracking-wide uppercase text-sm transition-all duration-500 shadow-glass hover:shadow-soft"
            >
              Discover Your Path
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/50 to-transparent" />
    </section>
  );
};

export default Hero;