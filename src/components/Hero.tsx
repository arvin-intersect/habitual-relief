// src/components/Hero.tsx
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-background-image bg-cover bg-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-6 relative z-10 pt-24 flex flex-col justify-between min-h-[calc(100vh-theme(spacing.24))] pb-16"> 
        
        {/* Top Left - Screen Time Stat */}
        <div className="self-start mt-8 ml-4 md:ml-0 max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-2xl">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-serif font-light text-slate-800">8.37</span>
              <span className="text-base font-sans tracking-wider uppercase text-slate-600">/ 10</span>
            </div>
            <p className="text-sm font-sans leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900 block mb-1">UAE leads globally in screen time usage</span>
              Especially Gen Z and millennials, averaging <span className="font-semibold text-slate-900">4h 34m daily</span> on smartphones—seeking more mindful digital balance and healthier habits.
            </p>
          </div>
        </div>

        {/* Bottom Right - CTA Section */}
        <div className="self-end mr-4 mb-8 md:mr-0">
          <div className="flex flex-col items-end text-right space-y-5">
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white drop-shadow-lg">
              Get a grip of your health
            </h2>
            <Button 
              onClick={scrollToCalculator}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border-2 border-white/50 rounded-full px-10 py-7 font-sans tracking-wide uppercase text-sm transition-all duration-500 shadow-2xl hover:shadow-white/20 hover:scale-105"
            >
              Discover a New You
              <span className="ml-2 text-lg">→</span>
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
