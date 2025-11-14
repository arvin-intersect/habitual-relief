import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ScreenTimeCalculator from "@/components/ScreenTimeCalculator";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ScreenTimeCalculator />
      <Features />
    </div>
  );
};

export default Index;