import { Upload, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Transform Your Screen Time Into Wellness</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Your Path to
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Digital Balance
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your screen time data and discover personalized habits to reduce stress, 
            improve focus, and reclaim your wellbeing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium hover:shadow-soft transition-all duration-300 px-8 py-6 text-lg rounded-xl"
              onClick={scrollToCalculator}
            >
              <Upload className="w-5 h-5 mr-2" />
              Analyze My Screen Time
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary/20 hover:bg-primary/5 px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;