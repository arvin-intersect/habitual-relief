// backend/server.js

// Load environment variables FIRST by importing the config file
import './config/env.js';

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import userRouter from './routes/user.js'; // New user routes

const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Parse JSON request bodies, with a limit for base64 images
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/user', userRouter); // Mount new user routes

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Ready to accept requests at http://localhost:${PORT}`);
});