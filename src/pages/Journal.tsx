import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useClerkToken } from '@/lib/clerk-utils';
import { useUser } from '@clerk/clerk-react';
import { Loader2, CheckCircle2, Circle, Flame, Target, Trophy } from 'lucide-react'; // ADDED Trophy here
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface LogEntry {
  id: string;
  user_id: string;
  api_response_timestamp: string;
  predicted_stress_level: string;
  recommendation_message: string;
  recommendation_stress_level: string;
  recommendation_insights: Array<{ type: string; message: string; action: string }>;
  recommendation_tasks: Array<{ task: string; description: string; duration: string; points: number }>;
  recommendation_gamification: {
    current_level: string;
    next_level: string;
    points_needed: number;
    streak: number;
    badge: string;
    challenge: string;
  };
  tasks_completed_status: boolean[]; // Array of booleans
  points_earned_for_analysis: number;
  // ... other fields you might have
}

const Journal = () => {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<LogEntry[]>([]);
  const [userTotalPoints, setUserTotalPoints] = useState(0);
  const { isLoaded, isSignedIn } = useUser();
  const getAuthToken = useClerkToken();
  const { toast } = useToast();

  // State for "proof" dialog
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [currentTaskToProve, setCurrentTaskToProve] = useState<{ logId: string; taskIndex: number; taskPoints: number; currentStatus: boolean } | null>(null);
  const [proofText, setProofText] = useState(''); // For text-based proof
  const [proofImage, setProofImage] = useState<File | null>(null); // For image-based proof
  const [submittingProof, setSubmittingProof] = useState(false);


  const fetchUserAnalyses = async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Could not get authentication token.");

      const response = await fetch(`${BACKEND_URL}/api/user/analyses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch analyses');
      }

      const result = await response.json();
      if (result.success) {
        setAnalyses(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch analyses');
      }
    } catch (error: any) {
      console.error('Error fetching user analyses:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load your journal entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    if (!isLoaded || !isSignedIn) {
      return;
    }
    try {
        const token = await getAuthToken();
        if (!token) throw new Error("Could not get authentication token.");

        const response = await fetch(`${BACKEND_URL}/api/user/points`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch points');
        }

        const result = await response.json();
        if (result.success) {
            setUserTotalPoints(result.points);
        } else {
            throw new Error(result.error || 'Failed to fetch points');
        }
    } catch (error: any) {
        console.error('Error fetching user points:', error);
        toast({
            title: "Error",
            description: error.message || "Failed to load your total points.",
            variant: "destructive",
        });
    }
  };


  useEffect(() => {
    fetchUserAnalyses();
    fetchUserPoints();
  }, [isLoaded, isSignedIn]); // Re-fetch when auth state changes

  const handleToggleTaskCompletion = async (logId: string, taskIndex: number, taskPoints: number, currentStatus: boolean) => {
    if (!isSignedIn) {
      toast({ title: "Authentication Required", description: "Please sign in to update tasks.", variant: "destructive" });
      return;
    }

    setSubmittingProof(true); // Indicate that a proof submission/task toggle is in progress

    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Could not get authentication token.");

      // For simplicity, for proof, we will just consider a text or confirmation.
      // Image upload would require multipart-form-data handling on backend, which is more complex.
      // For now, let's just confirm.
      if (!currentStatus) { // Only ask for proof if marking as complete
          // If you wanted image proof:
          // if (!proofText && !proofImage) {
          //   toast({ title: "Proof Required", description: "Please provide text or an image as proof.", variant: "destructive" });
          //   return;
          // }
      }

      const response = await fetch(`${BACKEND_URL}/api/user/task-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          log_id: logId,
          task_index: taskIndex,
          completed: !currentStatus, // Toggle status
          points: taskPoints,
          proof: proofText, // Send proof text if applicable
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
          description: !currentStatus ? "Task marked complete." : "Task completion reverted.",
        });
        fetchUserAnalyses(); // Re-fetch to update UI
        fetchUserPoints(); // Update total points
        setShowProofDialog(false);
        setProofText('');
        setProofImage(null);
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
    } finally {
      setSubmittingProof(false);
    }
  };

  const openProofDialog = (logId: string, taskIndex: number, taskPoints: number, currentStatus: boolean) => {
    setCurrentTaskToProve({ logId, taskIndex, taskPoints, currentStatus });
    setProofText(''); // Reset proof text
    setProofImage(null); // Reset proof image
    setShowProofDialog(true);
  };

  const getStressColorClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-slate-700">Loading user data...</div>;
  }

  if (!isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-slate-700">Please sign in to view your Journal.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen bg-gradient-to-b from-background to-orange-50/30">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-block">
          <span className="text-4xl mb-4 block">📔</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif font-light text-slate-900">
          Your Digital Wellness Journal
        </h2>
        <p className="text-lg md:text-xl font-sans text-slate-600 max-w-2xl mx-auto">
          Track your progress, revisit past analyses, and celebrate your habit-building journey.
        </p>
      </div>

      {/* User Points Display */}
      <Card className="p-6 mb-12 bg-white border-2 border-slate-200 rounded-3xl shadow-xl max-w-md mx-auto">
          <div className="flex items-center justify-center gap-4">
              <Trophy className="w-8 h-8 text-purple-600" />
              <div>
                  <p className="text-lg text-slate-600">Total Points Earned</p>
                  <p className="text-4xl font-bold text-slate-900">{userTotalPoints} pts</p>
              </div>
          </div>
      </Card>


      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="ml-4 text-xl text-slate-700">Loading your journal entries...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-slate-600 mb-4">No analysis entries found yet!</p>
          <p className="text-md text-slate-500">
            Go to the <a href="/" className="text-blue-600 underline">home page</a> to upload your first screen time data.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="p-8 bg-white border-2 border-slate-200 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600">Analysis Date</p>
                  <h3 className="text-2xl font-bold text-slate-900">{format(new Date(analysis.api_response_timestamp), 'PPP')}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-slate-600">Predicted Stress</p>
                  <span className={`text-xl font-bold px-4 py-2 rounded-full border-2 ${getStressColorClass(analysis.predicted_stress_level)}`}>
                    {analysis.predicted_stress_level}
                  </span>
                </div>
              </div>

              <p className="text-lg text-slate-700 mb-6">{analysis.recommendation_message}</p>

              {/* Tasks Accordion */}
              {analysis.recommendation_tasks.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tasks" className="border-t border-slate-200">
                    <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline py-4">
                      Your Habits for this period ({analysis.points_earned_for_analysis} pts earned)
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-0">
                      <div className="space-y-4">
                        {analysis.recommendation_tasks.map((task, index) => (
                          <div
                            key={index}
                            className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                              analysis.tasks_completed_status[index]
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
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-slate-500">⏱️ {task.duration}</span>
                                  <span className="font-semibold text-orange-600">+{task.points} points</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openProofDialog(analysis.id, index, task.points, analysis.tasks_completed_status[index])}
                                className={`flex-shrink-0 ${
                                  analysis.tasks_completed_status[index]
                                    ? 'bg-green-200 text-green-800 hover:bg-green-300 border-green-400'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                                }`}
                              >
                                {analysis.tasks_completed_status[index] ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Circle className="h-4 w-4 mr-2" />}
                                {analysis.tasks_completed_status[index] ? 'Completed' : 'Mark Complete'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTaskToProve?.currentStatus ? "Unmark Task" : "Mark Task Complete"}</DialogTitle>
            <DialogDescription>
              {currentTaskToProve?.currentStatus
                ? "Are you sure you want to unmark this task? Your points will be adjusted."
                : "Confirm you've completed this task. You will earn points for completing it."}
            </DialogDescription>
          </DialogHeader>
          {!currentTaskToProve?.currentStatus && (
            <div className="space-y-4">
              <Label htmlFor="proof-text">Optional: Add a note or description of your proof (e.g., "meditated for 5 mins")</Label>
              <Input
                id="proof-text"
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="I just completed my mindful melody session!"
              />
              {/* Optional: Image proof upload - requires backend update to handle multipart/form-data */}
              {/* <Label htmlFor="proof-image">Optional: Upload an image proof</Label>
              <Input
                id="proof-image"
                type="file"
                accept="image/*"
                onChange={(e) => setProofImage(e.target.files ? e.target.files[0] : null)}
              /> */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProofDialog(false)} disabled={submittingProof}>Cancel</Button>
            <Button
              onClick={() => currentTaskToProve && handleToggleTaskCompletion(
                currentTaskToProve.logId,
                currentTaskToProve.taskIndex,
                currentTaskToProve.taskPoints,
                currentTaskToProve.currentStatus
              )}
              disabled={submittingProof}
            >
              {submittingProof ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {currentTaskToProve?.currentStatus ? "Confirm Unmark" : "Confirm Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Journal;