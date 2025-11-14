import Hero from "@/components/Hero";
import ScreenTimeCalculator from "@/components/ScreenTimeCalculator";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <ScreenTimeCalculator />
    </div>
  );
};

export default Index;