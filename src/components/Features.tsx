import { Brain, Heart, Zap, Shield } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Brain,
    title: "Thoughtful Analysis",
    description: "Deep understanding of your digital patterns and their impact on wellbeing"
  },
  {
    icon: Heart,
    title: "Personal Growth",
    description: "Tailored practices that honor your unique journey and rhythm"
  },
  {
    icon: Zap,
    title: "Immediate Clarity",
    description: "Actionable insights delivered the moment you need them most"
  },
  {
    icon: Shield,
    title: "Protected Space",
    description: "Your information remains private, secure, and entirely your own"
  }
];

const Features = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute right-20 top-0 bottom-0 w-px bg-foreground/10" />
      <div className="absolute right-24 top-0 bottom-0 w-px bg-foreground/5" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-5xl md:text-7xl font-serif font-light text-foreground">
            A Different Approach
          </h2>
          <p className="text-lg md:text-xl font-sans font-light text-foreground/70 max-w-2xl mx-auto">
            Rooted in compassion, guided by insight
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 border border-foreground/20 bg-foreground/5 backdrop-blur-sm hover:bg-foreground/10 transition-all duration-500 group rounded-2xl"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-foreground/20">
                  <feature.icon className="w-7 h-7 text-foreground/80" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;