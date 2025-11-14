import { Brain, Heart, Zap, Shield } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "AI-powered insights from your screen time patterns to identify stress triggers"
  },
  {
    icon: Heart,
    title: "Personalized Habits",
    description: "Custom wellness routines tailored to your lifestyle and usage patterns"
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get actionable recommendations within seconds of uploading your data"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays private and secure. We never store your screenshots"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Why Choose Habitude
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Science-backed approach to digital wellness
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 border-2 border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-medium hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
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