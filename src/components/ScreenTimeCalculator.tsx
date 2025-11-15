import { useState } from "react";
import { Upload, Loader2, CheckCircle2, Edit3, Trophy, Target, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useUser } from "@clerk/clerk-react"; // Import useUser hook
import { useClerkToken } from "@/lib/clerk-utils"; // Import token helper

interface ScreenTimeData {
  technology_hours: number;
  social_media_hours: number;
  gaming_hours: number;
  screen_time_hours: number;
  sleep_hours: number;
  physical_activity_hours: number;
}

interface PredictionResponse {
  log_id?: string; // Add log_id to track the entry in Supabase
  input_data: ScreenTimeData;
  prediction: {
    stress_level: string; // "low", "medium", "high"
    confidence: number; // For backend/logging, not displayed
    probabilities: {
      "0": number;
      "1": number;
      "2": number;
    };
  };
  recommendations: {
    message: string;
    stress_level: string;
    insights: Array<{
      type: string;
      message: string;
      action: string;
    }>;
    tasks: Array<{
      task: string;
      description: string;
      duration: string;
      points: number;
    }>;
    gamification: {
      current_level: string;
      next_level: string;
      points_needed: number;
      streak: number;
      badge: string;
      challenge: string;
    };
  };
  timestamp: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const ScreenTimeCalculator = () => {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]); // Changed to boolean array matching task count
  const { toast } = useToast();
  const { user, isLoaded, isSignedIn } = useUser(); // Get Clerk user details
  const getAuthToken = useClerkToken(); // Get the token function

  const [manualData, setManualData] = useState<ScreenTimeData>({
    technology_hours: 0,
    social_media_hours: 0,
    gaming_hours: 0,
    screen_time_hours: 0,
    sleep_hours: 7,
    physical_activity_hours: 0.5,
  });

  // Handle image upload and analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload your screen time.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setAnalyzing(true);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Could not get authentication token.");

      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(",")[1]); // Remove data:image/...;base64, prefix
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      // Send to backend API
      const response = await fetch(`${BACKEND_URL}/api/analyze/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send Clerk token
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: file.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze image');
      }

      const result = await response.json();

      if (result.success) {
        setPredictionResult(result.data);
        setCompletedTasks(new Array(result.data.recommendations.tasks.length).fill(false)); // Initialize task statuses
        toast({
          title: "✨ Analysis Complete!",
          description: "Your personalized wellness plan is ready.",
        });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze the image. Please try manual entry.",
        variant: "destructive",
      });
      setShowManualEntry(true);
    } finally {
      setUploading(false);
      setAnalyzing(false);
      e.target.value = ''; // Clear file input
    }
  };

  // Handle manual data submission
  const handleManualSubmit = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enter data manually.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    const allFieldsFilled = Object.values(manualData).every(val => typeof val === 'number' && !isNaN(val));
    if (!allFieldsFilled) {
      toast({
        title: "Invalid Input",
        description: "Please ensure all fields are filled with valid numbers.",
        variant: "destructive",
      });
      setAnalyzing(false);
      return;
    }

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Could not get authentication token.");

      const response = await fetch(`${BACKEND_URL}/api/analyze/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send Clerk token
        },
        body: JSON.stringify(manualData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze data');
      }

      const result = await response.json();

      if (result.success) {
        setPredictionResult(result.data);
        setCompletedTasks(new Array(result.data.recommendations.tasks.length).fill(false)); // Initialize task statuses
        setShowManualEntry(false);
        toast({
          title: "✨ Analysis Complete!",
          description: "Your personalized wellness plan is ready.",
        });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Manual submission error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (index: number) => {
    if (!predictionResult?.log_id) {
      toast({ title: "Error", description: "Log ID not found for task update.", variant: "destructive" });
      return;
    }

    const currentStatus = completedTasks[index];
    const taskPoints = predictionResult.recommendations.tasks[index].points;

    // Optimistically update UI
    const newCompleted = [...completedTasks];
    newCompleted[index] = !currentStatus;
    setCompletedTasks(newCompleted);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Could not get authentication token.");

      const response = await fetch(`${BACKEND_URL}/api/user/task-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          log_id: predictionResult.log_id,
          task_index: index,
          completed: !currentStatus, // Send the new status
          points: taskPoints,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task status');
      }

      const result = await response.json();
      if (result.success) {
        toast({
          title: !currentStatus ? `🎉 +${taskPoints} points!` : `🗑️ -${taskPoints} points`,
          description: !currentStatus ? "Great job! Keep building your streak." : "Task completion reverted.",
        });
        // Optionally update the predictionResult's points_earned_for_analysis
        if (predictionResult) {
            setPredictionResult({
                ...predictionResult,
                // Assuming backend returns new total points for this analysis
                // This might need adjustment based on your backend response structure
                // For simplicity, we can assume points in predictionResult are not live updated here.
            });
        }
      } else {
        throw new Error(result.error || 'Task update failed');
      }
    } catch (error: any) {
      console.error('Task completion update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update task status. Please try again.",
        variant: "destructive",
      });
      // Revert UI on error
      const revertedCompleted = [...completedTasks];
      revertedCompleted[index] = currentStatus;
      setCompletedTasks(revertedCompleted);
    }
  };

  // Reset for new analysis
  const startNewAnalysis = () => {
    setPredictionResult(null);
    setCompletedTasks([]);
    setShowManualEntry(false);
    setManualData({
      technology_hours: 0,
      social_media_hours: 0,
      gaming_hours: 0,
      screen_time_hours: 0,
      sleep_hours: 7,
      physical_activity_hours: 0.5,
    });
  };

  // Get stress level color
  const getStressColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <section id="calculator" className="py-24 relative bg-gradient-to-b from-background to-orange-50/30">
      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block">
              <span className="text-4xl mb-4 block">📊</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-slate-900">
              Discover Your Wellness Path
            </h2>
            <p className="text-lg md:text-xl font-sans text-slate-600 max-w-2xl mx-auto">
              Upload your screen time data or enter it manually to receive personalized stress insights and wellness recommendations.
            </p>
          </div>

          {!predictionResult ? (
            <Card className="p-8 md:p-12 shadow-2xl border-2 border-slate-200 bg-white rounded-3xl">
              {!showManualEntry ? (
                <div className="space-y-8">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-slate-400 transition-all duration-300 bg-slate-50/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={uploading || analyzing || !isSignedIn} // Disable if not signed in
                    />
                    <label htmlFor="file-upload" className={`cursor-pointer ${!isSignedIn ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex flex-col items-center gap-6">
                        {uploading || analyzing ? (
                          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                            <Upload className="w-10 h-10 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-2xl font-bold text-slate-900 mb-2">
                            {uploading || analyzing ? "Analyzing your patterns..." : "Upload Screen Time Screenshot"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {!isSignedIn ? "Please sign in to upload" : "Drop your screenshot here or click to browse"}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Manual Entry Option */}
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-4">Don't have a screenshot?</p>
                    <Button
                      onClick={() => setShowManualEntry(true)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 rounded-full px-8 py-6 font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
                      disabled={analyzing || !isSignedIn}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Enter Data Manually</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Manual Entry Form */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Enter Your Data</h3>
                    <Button
                      onClick={() => setShowManualEntry(false)}
                      variant="ghost"
                      className="text-slate-600"
                      disabled={analyzing}
                    >
                      ← Back to Upload
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tech_hours" className="text-sm font-semibold text-slate-700">
                        Technology Usage (hours/day)
                      </Label>
                      <Input
                        id="tech_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={manualData.technology_hours}
                        onChange={(e) => setManualData({ ...manualData, technology_hours: parseFloat(e.target.value) || 0 })}
                        className="rounded-xl border-2 border-slate-300 py-6"
                        placeholder="e.g., 8"
                        disabled={analyzing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="social_hours" className="text-sm font-semibold text-slate-700">
                        Social Media (hours/day)
                      </Label>
                      <Input
                        id="social_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={manualData.social_media_hours}
                        onChange={(e) => setManualData({ ...manualData, social_media_hours: parseFloat(e.target.value) || 0 })}
                        className="rounded-xl border-2 border-slate-300 py-6"
                        placeholder="e.g., 2"
                        disabled={analyzing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gaming_hours" className="text-sm font-semibold text-slate-700">
                        Gaming (hours/day)
                      </Label>
                      <Input
                        id="gaming_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={manualData.gaming_hours}
                        onChange={(e) => setManualData({ ...manualData, gaming_hours: parseFloat(e.target.value) || 0 })}
                        className="rounded-xl border-2 border-slate-300 py-6"
                        placeholder="e.g., 1"
                        disabled={analyzing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screen_hours" className="text-sm font-semibold text-slate-700">
                        Total Screen Time (hours/day)
                      </Label>
                      <Input
                        id="screen_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={manualData.screen_time_hours}
                        onChange={(e) => setManualData({ ...manualData, screen_time_hours: parseFloat(e.target.value) || 0 })}
                        className="rounded-xl border-2 border-slate-300 py-6"
                        placeholder="e.g., 10"
                        disabled={analyzing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sleep_hours" className="text-sm font-semibold text-slate-700">
                        Sleep (hours/night)
                      </Label>
                      <Input
                        id="sleep_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={manualData.sleep_hours}
                        onChange={(e) => setManualData({ ...manualData, sleep_hours: parseFloat(e.target.value) || 0 })}
                        className="rounded-xl border-2 border-slate-300 py-6"
                        placeholder="e.g., 7"
                        disabled={analyzing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity_hours" className="text-sm font-semibold text-slate-700">
                        Physical Activity (hours/day)
                      </Label>
                      <Input
                        id="activity_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={manualData.physical_activity_hours}
                        onChange={(e) => setManualData({ ...manualData, physical_activity_hours: parseFloat(e.target.value) || 0 })}
                        className="rounded-xl border-2 border-slate-300 py-6"
                        placeholder="e.g., 0.5"
                        disabled={analyzing}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleManualSubmit}
                    disabled={analyzing || !isSignedIn}
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white border-0 rounded-full px-10 py-7 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Get My Wellness Plan
                        <span className="ml-2">→</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Stress Level Card */}
              <Card className="p-8 bg-white border-2 border-slate-200 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your Stress Level</p>
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-bold px-6 py-3 rounded-full border-2 ${getStressColor(predictionResult.prediction.stress_level)}`}>
                        {predictionResult.prediction.stress_level}
                      </span>
                      {/* Confidence Level removed from frontend display as requested */}
                    </div>
                  </div>
                  <div className="text-3xl">{predictionResult.recommendations.stress_level}</div>
                </div>
                <p className="mt-6 text-lg text-slate-700">{predictionResult.recommendations.message}</p>
              </Card>

              {/* Gamification Card */}
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <Trophy className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Your Progress</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
                    <div className="text-3xl mb-2">{predictionResult.recommendations.gamification.badge}</div>
                    <p className="text-sm text-slate-600">Current Badge</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-purple-600">{predictionResult.recommendations.gamification.streak}</span>
                      <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-sm text-slate-600">Day Streak</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
                    <div className="flex items-baseline gap-2">
                      {/* Points to next level for this analysis, based on tasks */}
                      <span className="text-3xl font-bold text-purple-600">{predictionResult.recommendations.gamification.points_needed}</span>
                      <Target className="w-6 h-6 text-purple-500" />
                    </div>
                    <p className="text-sm text-slate-600">Points to Next Level</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-xl border-2 border-purple-200">
                  <p className="text-sm text-slate-600 mb-1">Current Level</p>
                  <p className="text-xl font-bold text-purple-600">{predictionResult.recommendations.gamification.current_level}</p>
                  <p className="text-sm text-slate-500 mt-2">Next: {predictionResult.recommendations.gamification.next_level}</p>
                </div>
              </Card>

              {/* Insights */}
              {predictionResult.recommendations.insights.length > 0 && (
                <Card className="p-8 bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">💡 Key Insights</h3>
                  <div className="space-y-4">
                    {predictionResult.recommendations.insights.map((insight, index) => (
                      <div key={index} className="bg-white rounded-2xl p-6 border-2 border-blue-200">
                        <p className="text-slate-700 mb-2">{insight.message}</p>
                        <p className="text-sm font-semibold text-blue-600">→ {insight.action}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Tasks */}
              <Card className="p-8 bg-white border-2 border-slate-200 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">🎯 Your Wellness Tasks</h3>
                <p className="text-slate-600 mb-6">{predictionResult.recommendations.gamification.challenge}</p>
                <div className="space-y-4">
                  {predictionResult.recommendations.tasks.map((task, index) => (
                    <div
                      key={index}
                      onClick={() => toggleTaskCompletion(index)}
                      className={`rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                        completedTasks[index]
                          ? 'bg-green-50 border-green-300 opacity-75'
                          : 'bg-orange-50 border-orange-200 hover:border-orange-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                                {task.task.match(/^[^\p{L}\p{N}\s]/u) ? task.task.substring(0, task.task.indexOf(' ')) : "📝"}
                            </span>
                            <h4 className="font-bold text-lg text-slate-900">
                                {task.task.match(/^[^\p{L}\p{N}\s]/u) ? task.task.substring(task.task.indexOf(' ') + 1) : task.task}
                            </h4>
                            {completedTasks[index] && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 ml-auto" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500">⏱️ {task.duration}</span>
                            <span className="font-semibold text-orange-600">+{task.points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Points */}
                <div className="mt-8 p-6 bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Potential Points</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {predictionResult.recommendations.tasks.reduce((sum, task) => sum + task.points, 0)} pts
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Completed</p>
                      <p className="text-3xl font-bold text-green-600">
                        {completedTasks.reduce((sum, isCompleted, index) =>
                          isCompleted ? sum + (predictionResult.recommendations.tasks[index]?.points || 0) : sum, 0
                        )} pts
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* New Analysis Button */}
              <Button
                onClick={startNewAnalysis}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 rounded-full px-10 py-7 font-semibold text-lg transition-all duration-300"
              >
                Start New Analysis
                <span className="ml-2">↻</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScreenTimeCalculator;