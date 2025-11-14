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
    
    // Simulate upload and analysis
    setTimeout(() => {
      setUploading(false);
      setAnalyzed(true);
      toast({
        title: "Analysis Complete!",
        description: "Your personalized habits are ready.",
      });
    }, 2000);
  };

  return (
    <section id="calculator" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Get Your Personalized Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a screenshot of your screen time and receive instant habit recommendations
            </p>
          </div>

          <Card className="p-8 md:p-12 shadow-medium border-2 border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="space-y-8">
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    {uploading ? (
                      <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    ) : analyzed ? (
                      <CheckCircle2 className="w-16 h-16 text-primary" />
                    ) : (
                      <Upload className="w-16 h-16 text-primary" />
                    )}
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {uploading ? "Analyzing..." : analyzed ? "Analysis Complete!" : "Upload Screen Time Screenshot"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {!analyzed && "Click to browse or drag and drop"}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {analyzed && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Your Recommended Habits</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Morning Mindfulness",
                          time: "5 minutes",
                          description: "Start your day with breathing exercises before checking your phone"
                        },
                        {
                          title: "Digital Sunset",
                          time: "1 hour before bed",
                          description: "Create a phone-free evening routine to improve sleep quality"
                        },
                        {
                          title: "Focus Sessions",
                          time: "25 minutes",
                          description: "Use the Pomodoro technique with phone in another room"
                        }
                      ].map((habit, index) => (
                        <div key={index} className="bg-card rounded-lg p-4 border border-border/50 hover:shadow-soft transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-foreground">{habit.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                            </div>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                              {habit.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-xl shadow-medium hover:shadow-soft transition-all duration-300"
                    onClick={() => setAnalyzed(false)}
                  >
                    Analyze Another Screenshot
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