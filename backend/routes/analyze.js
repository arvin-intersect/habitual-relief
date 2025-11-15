// backend/routes/analyze.js

// Import config to ensure env vars are loaded and validated
import '../config/env.js';

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { authenticateClerk } from '../middleware/auth.js'; // Import auth middleware

const router = express.Router();

// Initialize services with environment variables (they're now guaranteed to be loaded)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Extract screen time data from image using Gemini
async function extractDataFromImage(base64Image, mimeType) {
  try {
    // User requested "gemini-2.5-flash-lite"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `Analyze this screen time screenshot and extract the following information in JSON format:
{
  "technology_hours": <total hours spent on technology/productivity apps>,
  "social_media_hours": <hours on social media apps like Instagram, TikTok, Facebook, etc.>,
  "gaming_hours": <hours on gaming apps>,
  "screen_time_hours": <total screen time in hours>,
  "sleep_hours": <if sleep data is visible, otherwise estimate 7>,
  "physical_activity_hours": <if activity data is visible, otherwise estimate 0.5>
}

Extract exact numbers from the image. If any value is not visible, provide a reasonable estimate.
Return ONLY valid JSON, no other text.`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      { text: prompt },
    ]);

    const response = result.response.text();
    console.log('Gemini raw response:', response);

    // Regex to robustly find the JSON object even if there's surrounding text
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response. Raw response: " + response);
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    console.log('Extracted data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw error;
  }
}

// Get prediction from ML service
async function getPrediction(data) {
  try {
    console.log('Sending to ML backend:', data);
    const response = await axios.post(`${process.env.ML_BACKEND_URL}/predict`, data);
    console.log('ML backend response:', response.data);
    return response.data;
  } catch (error) {
    console.error("ML prediction error:", error.response?.data || error.message);
    throw error;
  }
}

// Log to Supabase - now includes user_id
async function logToSupabase(user_id, inputData, predictionResponse) {
  try {
    const logEntry = {
      user_id: user_id, // Store Clerk user ID
      api_response_timestamp: predictionResponse.timestamp,
      technology_usage_hours: inputData.technology_hours,
      social_media_usage_hours: inputData.social_media_hours,
      gaming_hours: inputData.gaming_hours,
      screen_time_hours: inputData.screen_time_hours,
      sleep_hours: inputData.sleep_hours,
      physical_activity_hours: inputData.physical_activity_hours,
      predicted_stress_level: predictionResponse.prediction.stress_level,
      prediction_confidence: predictionResponse.prediction.confidence, // Keep for backend logs
      prediction_probabilities: predictionResponse.prediction.probabilities, // Keep for backend logs
      recommendation_message: predictionResponse.recommendations.message,
      recommendation_stress_level: predictionResponse.recommendations.stress_level,
      recommendation_insights: predictionResponse.recommendations.insights,
      recommendation_tasks: predictionResponse.recommendations.tasks,
      recommendation_gamification: predictionResponse.recommendations.gamification,
      // Add initial task completion status as array (Supabase JS client handles JSONB conversion)
      tasks_completed_status: predictionResponse.recommendations.tasks.map(() => false),
      points_earned_for_analysis: 0 // Initial points for this analysis
    };

    console.log('💾 Logging to Supabase...');
    console.log('Logging to Supabase:', JSON.stringify(logEntry, null, 2));

    const { data: insertedLog, error: insertError } = await supabase
      .from('stress_prediction_logs')
      .insert([logEntry])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Supabase insert error:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
      console.error('Error details:', insertError.details);
      console.error('Error hint:', insertError.hint);
      throw new Error(`Failed to create log entry in Supabase: ${insertError.message} (${insertError.code})`);
    }

    console.log('✅ Successfully logged to Supabase with ID:', insertedLog.id);
    return insertedLog;

  } catch (error) {
    console.error("Supabase logging error:", error);
    throw error;
  }
}

// POST /api/analyze/image - Analyze screen time from image (authenticated)
router.post('/image', authenticateClerk, async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    const { userId } = req; // Get userId from auth middleware

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log(`📸 Processing image upload for user: ${userId}`);

    // Step 1: Extract data from image using Gemini
    console.log('🤖 Extracting data with Gemini...');
    const extractedData = await extractDataFromImage(image, mimeType);

    // Step 2: Get prediction from ML backend
    console.log('🔮 Getting prediction from ML backend...');
    const predictionResponse = await getPrediction(extractedData);

    // Step 3: Log to Supabase
    const newLog = await logToSupabase(userId, extractedData, predictionResponse);
    if (!newLog) throw new Error("Failed to create log entry in Supabase.");

    // Step 4: Return result to frontend, including the log_id for tracking
    console.log('✅ Image analysis complete!');
    res.json({
      success: true,
      data: { ...predictionResponse, log_id: newLog.id }, // Pass log_id back
    });
  } catch (error) {
    console.error('❌ Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
      message: error.message
    });
  }
});

// POST /api/analyze/manual - Analyze manual input (authenticated)
router.post('/manual', authenticateClerk, async (req, res) => {
  try {
    const inputData = req.body;
    const { userId } = req; // Get userId from auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log(`📝 Processing manual input for user: ${userId}`, inputData);

    // Validate input
    const requiredFields = [
      'technology_hours',
      'social_media_hours',
      'gaming_hours',
      'screen_time_hours',
      'sleep_hours',
      'physical_activity_hours',
    ];

    for (const field of requiredFields) {
      if (inputData[field] === undefined || inputData[field] === null || isNaN(parseFloat(inputData[field]))) {
        return res.status(400).json({ error: `Missing or invalid field: ${field}` });
      }
    }

    // Step 1: Get prediction from ML backend
    console.log('🔮 Getting prediction from ML backend...');
    const predictionResponse = await getPrediction(inputData);

    // Step 2: Log to Supabase
    const newLog = await logToSupabase(userId, inputData, predictionResponse);
    if (!newLog) throw new Error("Failed to create log entry in Supabase.");

    // Step 3: Return result to frontend, including the log_id for tracking
    console.log('✅ Manual analysis complete!');
    res.json({
      success: true,
      data: { ...predictionResponse, log_id: newLog.id }, // Pass log_id back
    });
  } catch (error) {
    console.error('❌ Manual analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze data',
      message: error.message
    });
  }
});

export default router;