import { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";

const ScreenTimeCalculator = () => {
  const [uploading, setUploading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    setTimeout(() => {
      setUploading(false);
      setAnalyzed(true);
      toast({
        title: "Analysis Complete",
        description: "Your personalized path is ready.",
      });
    }, 2000);
  };

  return (
    <section id="calculator" className="py-32 relative bg-gradient-sage">
      {/* Decorative line */}
      <div className="absolute left-20 top-0 bottom-0 w-px bg-foreground/10" />
      <div className="absolute left-24 top-0 bottom-0 w-px bg-foreground/5" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-7xl font-serif font-light text-foreground leading-tight">
              Your Personalized Journey
            </h2>
            <p className="text-lg md:text-xl font-sans font-light text-foreground/80 max-w-2xl mx-auto">
              Upload your screen time data and receive insights tailored to your digital wellbeing.
            </p>
          </div>

          <Card className="p-12 md:p-16 shadow-glass border border-foreground/20 bg-foreground/10 backdrop-blur-glass rounded-3xl">
            <div className="space-y-10">
              <div className="border-2 border-dashed border-foreground/30 rounded-2xl p-16 text-center hover:border-foreground/40 transition-all duration-500 bg-foreground/5 backdrop-blur-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-6">
                    {uploading ? (
                      <Loader2 className="w-20 h-20 text-foreground animate-spin" />
                    ) : analyzed ? (
                      <CheckCircle2 className="w-20 h-20 text-foreground" />
                    ) : (
                      <Upload className="w-20 h-20 text-foreground/70" />
                    )}
                    <div>
                      <p className="text-2xl font-serif text-foreground mb-2">
                        {uploading ? "Analyzing your patterns..." : analyzed ? "Journey mapped" : "Upload Screen Time"}
                      </p>
                      <p className="text-sm font-sans text-foreground/70">
                        {!analyzed && "Drop your screenshot here or click to browse"}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {analyzed && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-foreground/20">
                    <h3 className="text-3xl font-serif text-foreground mb-6">Your Path Forward</h3>
                    <div className="space-y-5">
                      {[
                        {
                          title: "Morning Mindfulness",
                          time: "5 min",
                          description: "Begin each day with intentional breathing before digital engagement"
                        },
                        {
                          title: "Digital Sunset Ritual",
                          time: "Evening",
                          description: "Create space for reflection as you transition away from screens"
                        },
                        {
                          title: "Focused Presence",
                          time: "Throughout",
                          description: "Practice sustained attention in phone-free environments"
                        }
                      ].map((habit, index) => (
                        <div key={index} className="bg-foreground/5 backdrop-blur-sm rounded-xl p-6 border border-foreground/10 hover:bg-foreground/10 transition-all duration-300">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-serif text-xl text-foreground mb-2">{habit.title}</h4>
                              <p className="text-sm font-sans text-foreground/70 leading-relaxed">{habit.description}</p>
                            </div>
                            <span className="text-xs font-sans text-foreground/60 bg-foreground/10 px-4 py-2 rounded-full whitespace-nowrap border border-foreground/10">
                              {habit.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-foreground/15 hover:bg-foreground/25 text-foreground backdrop-blur-md border border-foreground/30 rounded-full py-7 text-base font-sans tracking-wide uppercase transition-all duration-500 shadow-glass"
                    onClick={() => setAnalyzed(false)}
                  >
                    Begin Another Journey
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ScreenTimeCalculator;