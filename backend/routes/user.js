// backend/routes/user.js

import '../config/env.js'; // Ensure env vars are loaded
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { authenticateClerk } from '../middleware/auth.js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Helper to update user's total points in a separate 'users' table
async function updateUserPoints(userId, pointsToAdd) {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('total_points')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no row found
      throw fetchError;
    }

    let newPoints = pointsToAdd;
    if (existingUser) {
      newPoints += existingUser.total_points;
    }

    const { data, error } = await supabase
      .from('users')
      .upsert({ id: userId, total_points: newPoints, last_activity_at: new Date().toISOString() }, { onConflict: 'id' })
      .select();

    if (error) throw error;
    console.log(`Updated user ${userId} points to ${newPoints}`);
    return data;
  } catch (error) {
    console.error('Error updating user points:', error);
    throw error;
  }
}

// GET /api/user/analyses - Fetch all analyses for the logged-in user
router.get('/analyses', authenticateClerk, async (req, res) => {
  try {
    const { userId } = req;
    console.log(`Fetching analyses for user: ${userId}`);

    const { data, error } = await supabase
      .from('stress_prediction_logs')
      .select('*')
      .eq('user_id', userId)
      .order('api_response_timestamp', { ascending: false });

    if (error) {
      console.error('Supabase fetch analyses error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch user analyses', message: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in /api/user/analyses:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// GET /api/user/points - Fetch total points for the logged-in user
router.get('/points', authenticateClerk, async (req, res) => {
    try {
        const { userId } = req;
        console.log(`Fetching points for user: ${userId}`);

        const { data, error } = await supabase
            .from('users')
            .select('total_points')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no row found"
            console.error('Supabase fetch points error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch user points', message: error.message });
        }

        res.json({ success: true, points: data ? data.total_points : 0 });
    } catch (error) {
        console.error('Error in /api/user/points:', error);
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
});


// POST /api/user/task-complete - Update task completion status and user points
router.post('/task-complete', authenticateClerk, async (req, res) => {
  try {
    const { userId } = req;
    const { log_id, task_index, completed, points } = req.body;

    if (!log_id || task_index === undefined || typeof completed !== 'boolean' || typeof points !== 'number') {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log(`Updating task ${task_index} for log ${log_id} for user ${userId}. Completed: ${completed}, Points: ${points}`);

    // Fetch the existing log entry
    const { data: logEntry, error: fetchError } = await supabase
      .from('stress_prediction_logs')
      .select('tasks_completed_status, points_earned_for_analysis')
      .eq('id', log_id)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching log entry:', fetchError);
      return res.status(404).json({ success: false, error: 'Log entry not found or not owned by user' });
    }

    const currentStatuses = logEntry.tasks_completed_status;
    const currentAnalysisPoints = logEntry.points_earned_for_analysis;

    if (task_index < 0 || task_index >= currentStatuses.length) {
      return res.status(400).json({ success: false, error: 'Invalid task index' });
    }

    const newStatuses = [...currentStatuses];
    const oldCompletionStatus = newStatuses[task_index];
    newStatuses[task_index] = completed;

    let pointsChange = 0;
    let newAnalysisPoints = currentAnalysisPoints;

    if (completed && !oldCompletionStatus) { // Task was marked complete for the first time
      pointsChange = points;
      newAnalysisPoints += points;
      console.log(`Added ${points} to analysis points and user total.`);
    } else if (!completed && oldCompletionStatus) { // Task was unmarked
      pointsChange = -points;
      newAnalysisPoints -= points;
      console.log(`Removed ${points} from analysis points and user total.`);
    }


    // Update the log entry in Supabase
    const { data: updatedLog, error: updateError } = await supabase
      .from('stress_prediction_logs')
      .update({
        tasks_completed_status: newStatuses,
        points_earned_for_analysis: newAnalysisPoints
      })
      .eq('id', log_id)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update task error:', updateError);
      return res.status(500).json({ success: false, error: 'Failed to update task status', message: updateError.message });
    }

    // Update user's total points in 'users' table
    if (pointsChange !== 0) {
      await updateUserPoints(userId, pointsChange);
    }

    res.json({ success: true, data: updatedLog, newTotalPoints: newAnalysisPoints }); // Return new points for this analysis
  } catch (error) {
    console.error('Error in /api/user/task-complete:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// GET /api/user/leaderboard - Fetch leaderboard data (mock friends for now)
router.get('/leaderboard', authenticateClerk, async (req, res) => {
  try {
    const { userId } = req; // Current user

    const { data: topUsers, error } = await supabase
      .from('users')
      .select('id, total_points')
      .order('total_points', { ascending: false })
      .limit(10); // Fetch top 10 users

    if (error) {
      console.error('Supabase leaderboard fetch error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch leaderboard', message: error.message });
    }

    // Mock some friends if there aren't many users or to enrich the list
    const mockFriends = [
      { id: 'mock_friend_1', total_points: Math.floor(Math.random() * 500) + 100, username: 'ZenMasterJess' },
      { id: 'mock_friend_2', total_points: Math.floor(Math.random() * 500) + 100, username: 'DigitalDetoxDan' },
      { id: 'mock_friend_3', total_points: Math.floor(Math.random() * 500) + 100, username: 'HabitHeroKim' },
      { id: 'mock_friend_4', total_points: Math.floor(Math.random() * 500) + 100, username: 'FocusFred' },
    ];

    const leaderboard = topUsers.map(u => ({
      id: u.id,
      total_points: u.total_points,
      username: u.id === userId ? 'You' : `User_${u.id.substring(0, 4)}` // Use Clerk API to get actual usernames later
    }));

    // Add mock friends, ensuring no duplicates with real users
    mockFriends.forEach(mock => {
      if (!leaderboard.some(user => user.id === mock.id)) {
        leaderboard.push(mock);
      }
    });

    // Sort again in case mock friends were added in the middle
    leaderboard.sort((a, b) => b.total_points - a.total_points);

    res.json({ success: true, data: leaderboard });

  } catch (error) {
    console.error('Error in /api/user/leaderboard:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});


export default router;