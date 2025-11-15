// src/pages/Index.tsx
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ScreenTimeCalculator from "@/components/ScreenTimeCalculator";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ScreenTimeCalculator /> {/* Moved to second position */}
      <Features /> {/* Moved to third position */}
    </div>
  );
};

export default Index;
