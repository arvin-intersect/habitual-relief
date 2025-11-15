import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useClerkToken } from '@/lib/clerk-utils';
import { useUser } from '@clerk/clerk-react';
import { Loader2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils'; // Assuming you have cn utility

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface LeaderboardEntry {
  id: string;
  total_points: number;
  username: string; // Could fetch from Clerk or mock
}

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const getAuthToken = useClerkToken();
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Could not get authentication token.");

      const response = await fetch(`${BACKEND_URL}/api/user/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch leaderboard');
      }

      const result = await response.json();
      if (result.success) {
        setLeaderboardData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch leaderboard');
      }
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load leaderboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-slate-700">Loading user data...</div>;
  }

  if (!isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-slate-700">Please sign in to view the Leaderboard.</div>;
  }

  const currentUserRank = leaderboardData.findIndex(entry => entry.id === user?.id) + 1;

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen bg-gradient-to-b from-background to-orange-50/30">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-block">
          <span className="text-4xl mb-4 block">🏆</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif font-light text-slate-900">
          Global Habit Leaderboard
        </h2>
        <p className="text-lg md:text-xl font-sans text-slate-600 max-w-2xl mx-auto">
          See how you stack up against other habit builders!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="ml-4 text-xl text-slate-700">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {leaderboardData.map((entry, index) => (
            <Card
              key={entry.id}
              className={cn(
                "p-4 flex items-center gap-4 rounded-2xl shadow-md border-2",
                entry.id === user?.id
                  ? 'bg-gradient-to-r from-orange-100 to-pink-100 border-orange-300 transform scale-[1.02] transition-transform duration-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="w-10 text-center font-bold text-xl text-slate-700">
                {index + 1}
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}`} alt={entry.username} />
                <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className={cn("font-semibold text-lg", entry.id === user?.id ? "text-orange-700" : "text-slate-900")}>
                  {entry.id === user?.id ? `${user.username || user.firstName || 'You'} (You)` : entry.username}
                </p>
              </div>
              <div className="font-bold text-xl text-purple-600 flex items-center gap-1">
                {entry.total_points} <span className="text-base text-purple-400">pts</span>
              </div>
            </Card>
          ))}
          {currentUserRank > 10 && ( // Show current user if they are not in the top 10
            <Card className="p-4 flex items-center gap-4 rounded-2xl shadow-md border-2 bg-gradient-to-r from-orange-100 to-pink-100 border-orange-300 transform scale-[1.02] transition-transform duration-200 mt-8">
                <div className="w-10 text-center font-bold text-xl text-slate-700">
                    ...
                </div>
                <div className="w-10 text-center font-bold text-xl text-slate-700">
                    {currentUserRank}
                </div>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || user?.firstName}`} alt={user?.username || user?.firstName} />
                    <AvatarFallback>{user?.username?.substring(0,2).toUpperCase() || user?.firstName?.substring(0,2).toUpperCase() || 'Me'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-lg text-orange-700">
                        {user?.username || user?.firstName || 'You'} (You)
                    </p>
                </div>
                <div className="font-bold text-xl text-purple-600 flex items-center gap-1">
                    {leaderboardData.find(entry => entry.id === user?.id)?.total_points} <span className="text-base text-purple-400">pts</span>
                </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;