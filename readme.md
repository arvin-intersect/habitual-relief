# 🚀 Flow Habits AI: Habitual Relief Frontend 🚀

![Status](https://img.shields.io/badge/Status-Hackathon%20Project-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB.svg?style=flat&logo=react&logoColor=white)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript&logoColor=white)
![Build](https://img.shields.io/badge/Build-Vite-646CFF.svg?style=flat&logo=vite&logoColor=white)
![Styling](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)
![UI](https://img.shields.io/badge/UI-shadcn%2Fui-000000.svg?style=flat&logo=shadcn%2Fui&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-Clerk-6B46EF.svg?style=flat&logo=clerk&logoColor=white)
![Backend](https://img.shields.io/badge/Backend%20(Proxy)-Node.js-339933.svg?style=flat&logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Express.js-000000.svg?style=flat&logo=express&logoColor=white)

## ✨ Project Overview

This repository houses the frontend application for **Flow Habits AI: Habitual Relief**, developed by **Arvin Subramanian** for the **Bits Hackathon**. It serves as the user's primary interface to interact with our digital well-being platform.

The application allows users to analyze their screen time habits (via screenshot upload with Gemini Vision OCR or manual input), receive AI-powered stress level predictions, and get personalized, gamified recommendations to improve their digital well-being. It integrates seamlessly with our dedicated Python ML backend for predictions and a local Node.js backend (within this repository) for authentication, data processing, and persistence.

**Theme:** Health Tech and Wellbeing

## 💡 What is this? (Architecture & Role)

This project is more than just a frontend; it's a full-stack client-side application that orchestrates interactions between the user, a local Node.js backend (acting as a proxy/BFF - Backend For Frontend), and a separate Python ML backend.

### Key Components:

#### React Frontend:
- Built with **React**, **TypeScript**, and **Vite** for a modern, fast user experience.
- Styled with **Tailwind CSS** and rich UI components from **shadcn/ui**.
- Manages user authentication and sessions using **Clerk**.
- Provides pages for:
  - **Homepage (`/`)**: Introduction, key features, and the interactive "Screen Time Calculator" (upload or manual entry).
  - **Journal (`/journal`)**: A personalized log of past analyses, stress predictions, and task completion status.
  - **Leaderboard (`/leaderboard`)**: A gamified view of user points, fostering engagement and healthy competition.

#### Node.js Express Backend (within this repository):
Located in the `backend/` directory, this is a lightweight proxy server.

- **Authentication**: Integrates with Clerk for secure user authentication and token verification.
- **Image Analysis**: Leverages Google Gemini AI (Flash Vision) to perform Optical Character Recognition (OCR) on uploaded screen time screenshots, extracting relevant numerical data.
- **ML Backend Integration**: Forwards the extracted (or manually entered) data to the separate Python ML backend (`arvin-intersect-hackathon-api`) for stress prediction and recommendation generation.
- **Data Persistence**: Stores user analysis logs, task completion statuses, and overall user points in **Supabase** (PostgreSQL).
- **API Endpoints**: Exposes specific API routes (`/api/analyze/image`, `/api/analyze/manual`, `/api/user/analyses`, `/api/user/task-complete`, `/api/user/leaderboard`, `/api/user/points`) for the frontend to consume.

### Overall Data Flow:
```
User (Frontend) ➡️ Node.js Backend ➡️ (Gemini for OCR / Python ML Backend for prediction) ➡️ Supabase (Database) ➡️ Node.js Backend ➡️ Frontend
```

This architecture allows for a clear separation of concerns, leveraging Node.js for rapid API integration and I/O-bound tasks (like external API calls), while dedicating the Python backend to its core strength: machine learning.

## ✨ Features

- **Interactive Homepage**: Engaging hero section, highlights app features, and presents the core "Screen Time Calculator".
- **User Authentication**: Secure sign-up and sign-in powered by Clerk, ensuring personalized user experiences.
- **Screen Time Analysis**:
  - **Image Upload (AI-powered)**: Upload screenshots of your device's screen time summary. Our Node.js backend uses Gemini Flash Vision to extract relevant data.
  - **Manual Data Entry**: Alternative input method for users who prefer to enter their digital habit data directly.
- **Personalized Wellness Plans**: Displays predicted stress levels (Low, Medium, High) along with tailored messages, actionable tasks, key insights, and gamification elements (points, levels, badges, streaks) from the ML backend.
- **Task Management**: Users can mark recommended tasks as complete (or unmark them), earning/losing points that contribute to their overall score.
- **Personal Journal**: A dedicated page (`/journal`) to review all past stress analyses and track the completion status of assigned tasks over time.
- **Gamified Leaderboard**: A competitive page (`/leaderboard`) showcasing top users by points, encouraging engagement and healthy digital habits.
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components for a seamless experience across various devices.
- **Robust Error Handling**: Provides user-friendly toast notifications for successful actions or failures, with fallback mechanisms (e.g., to manual entry if image OCR fails).

## 🛠️ Tech Stack

### Frontend:
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM
- **State Management/Data Fetching**: React Query (TanStack Query)
- **Authentication**: Clerk (frontend SDK)

### Node.js Backend (within this repo):
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Orchestration**: Axios
- **Environment Management**: Dotenv
- **CORS Handling**: cors middleware
- **External APIs**:
  - Google Gemini AI (for image OCR)
  - Supabase (for database persistence and user points)
  - Flow Habits AI ML Backend (separate Python Flask API)
- **Authentication**: Clerk (Node.js SDK for webhook verification)

## 📂 Directory Structure

```
arvin-intersect-habitual-relief/
├── backend/                    # Node.js Express server (proxy for ML backend and external services)
│   ├── server.js               # Main Express app
│   ├── config/                 # Environment variables configuration
│   │   └── env.js
│   ├── middleware/             # Authentication middleware
│   │   └── auth.js
│   └── routes/                 # API routes for analysis and user data
│       ├── analyze.js
│       └── user.js
├── public/                     # Static assets (images, robots.txt)
│   ├── robots.txt
│   └── images/
│       └── hero-background.jpg
├── src/                        # React application source code
│   ├── App.css
│   ├── App.tsx                 # Main React component, router setup
│   ├── index.css               # Global Tailwind CSS directives
│   ├── main.tsx                # Entry point for React app
│   ├── vite-env.d.ts
│   ├── components/             # Reusable UI components
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── NavLink.tsx
│   │   ├── ScreenTimeCalculator.tsx # Core feature component
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                    # Utility functions and Clerk helpers
│   │   ├── clerk-utils.ts
│   │   └── utils.ts
│   └── pages/                  # Top-level page components
│       ├── Index.tsx
│       ├── Journal.tsx
│       ├── Leaderboard.tsx
│       └── NotFound.tsx
├── components.json             # shadcn/ui configuration
├── eslint.config.js            # ESLint configuration
├── index.html                  # Main HTML file
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.app.json           # TypeScript configuration for app
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.node.json          # TypeScript configuration for Node.js files
└── vite.config.ts              # Vite configuration
```

## 🚀 Getting Started

Follow these instructions to set up and run the Flow Habits AI frontend application locally.

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18 or higher) and **npm** (or yarn/pnpm)
- **Git**
- A running instance of the **Flow Habits AI ML Backend**. This frontend requires the ML backend to be operational to get stress predictions and recommendations. Please refer to its separate repository for setup instructions.
- **Clerk Account**: For user authentication
- **Google Cloud Project / Gemini API Key**: For image OCR
- **Supabase Project**: For database persistence

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/arvin-intersect-habitual-relief.git
cd arvin-intersect-habitual-relief
```

### 2. Install Dependencies

Install the Node.js dependencies for both the frontend and the local Express backend:

```bash
npm install
# or yarn install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory of this project (next to `package.json`). This file will hold environment variables for both the React frontend (prefixed with `VITE_`) and the Node.js Express backend.

**`.env` example:**

```env
# --- Frontend (Vite) Variables ---
# Your Clerk Public Key (e.g., pk_test_...)
VITE_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY" 
# URL of your local Node.js backend (server.js)
VITE_BACKEND_URL="http://localhost:3001" 

# --- Node.js Backend Variables (used by backend/server.js) ---
# Your Google Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
# Your Supabase Project URL (e.g., https://xyzcompany.supabase.co)
SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
# Your Supabase Service Role Key (NOT the anon key)
SUPABASE_SERVICE_KEY="YOUR_SUPABASE_SERVICE_KEY" 
# URL of your Python ML backend (e.g., http://localhost:5000)
ML_BACKEND_URL="http://localhost:5000" 
# Your Clerk Secret Key (e.g., sk_test_...)
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY" 
# Port for the Node.js backend (default: 3001)
PORT=3001
```

**Important Notes for Environment Variables:**

- Ensure your `ML_BACKEND_URL` points to where your `arvin-intersect-hackathon-api` (Python Flask app) is running. By default, it's `http://localhost:5000`.
- The `SUPABASE_SERVICE_KEY` (also known as the anon key if read from client-side config, but for Node.js backend should be the service_role key with full access) is crucial for the Node.js backend to interact with your Supabase tables.
- The Node.js backend includes a validation step (`backend/config/env.js`) to ensure all required variables are set.

### 4. Setup Supabase Database

You'll need to create a table in your Supabase project to store user analysis logs and another for user points.

#### `stress_prediction_logs` Table Schema (SQL):

```sql
CREATE TABLE stress_prediction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    api_response_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    technology_usage_hours REAL,
    social_media_usage_hours REAL,
    gaming_hours REAL,
    screen_time_hours REAL,
    sleep_hours REAL,
    physical_activity_hours REAL,
    predicted_stress_level TEXT,
    prediction_confidence REAL,
    prediction_probabilities JSONB,
    recommendation_message TEXT,
    recommendation_stress_level TEXT,
    recommendation_insights JSONB,
    recommendation_tasks JSONB,
    recommendation_gamification JSONB,
    tasks_completed_status BOOLEAN[], -- Array to track completion status of tasks
    points_earned_for_analysis INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE stress_prediction_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see and update their own logs
CREATE POLICY "Users can view and update their own logs" ON stress_prediction_logs
  FOR ALL
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own logs
CREATE POLICY "Users can insert their own logs" ON stress_prediction_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### `users` Table Schema (SQL):

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Clerk user ID
    total_points INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own points
CREATE POLICY "Users can view their own points" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy to allow users to update their own points
CREATE POLICY "Users can update their own points" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy to allow users to insert their own entry if it doesn't exist
CREATE POLICY "Users can insert their own entry" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Note:** For hackathon speed, you might initially disable RLS or rely on the `user_id` explicitly passed from Clerk being stored directly in the `user_id` column. The provided policies assume `auth.uid()` is populated, which needs a Supabase-Clerk JWT setup beyond this README's scope for full RLS. For this project, the Node.js backend enforces `userId` is present from Clerk middleware before interacting with Supabase.

### 5. Run the Node.js Express Backend

First, ensure your Python ML backend is running (typically on `http://localhost:5000`).

Then, start the local Node.js Express backend:

```bash
npm run backend:start
# or yarn backend:start
```

You should see console output indicating the backend is running and environment variables are loaded.

### 6. Run the React Frontend

In a separate terminal, start the React development server:

```bash
npm run dev
# or yarn dev
```

The frontend application will typically open in your browser at `http://localhost:8080`.

## 🌐 Key Frontend Routes

- **`/`** (Homepage): The main landing page with project overview, features, and the "Screen Time Calculator".
- **`/journal`** (Journal): Requires user authentication. Displays a chronological log of all past screen time analyses and task completion.
- **`/leaderboard`** (Leaderboard): Requires user authentication. Shows a global ranking of users based on total points earned.
- **`*`** (Not Found): A generic 404 page for invalid routes.

## 🏃‍♀️ How to Use

1. **Access the Application**: Open your browser and navigate to `http://localhost:8080`.

2. **Sign In**: Click "Sign In" in the navigation bar. You'll be redirected to Clerk's authentication flow. Create an account or sign in with an existing one.

3. **Analyze Your Screen Time**:
   - Scroll down to the "Discover Your Wellness Path" section.
   - **Option 1: Upload Screenshot**: Click the "Upload Screen Time Screenshot" area. Select a screenshot from your device's screen time usage (e.g., from an iPhone's "Screen Time" settings). The app will use AI to extract data and provide a personalized plan.
   - **Option 2: Manual Entry**: If you don't have a screenshot or prefer manual input, click "Enter Data Manually" and fill in the fields for your digital usage, sleep, and physical activity hours.

4. **Review Your Wellness Plan**: After analysis, you'll see:
   - Your predicted stress level (Low, Medium, High).
   - A personalized message and insights about your habits.
   - Wellness Tasks with points and descriptions.
   - Gamification details (current level, badge, streak, points).

5. **Complete Tasks & Earn Points**:
   - On the results page, click on a task to open a dialog.
   - For uncompleted tasks, you can "Mark Complete" (optionally with proof/notes). For completed tasks, you can "Confirm Unmark."
   - Your points and task status will update in real-time.

6. **Explore Your Journal**: Navigate to the `/journal` page to see a history of all your analyses. Each entry expands to show the detailed wellness plan and task completion status.

7. **Check the Leaderboard**: Visit the `/leaderboard` page to see how your points compare to other users and climb the ranks!

8. **Start a New Analysis**: After reviewing your plan, click "Start New Analysis" to go back to the calculator and get fresh recommendations based on updated habits.

## 📈 Future Enhancements

- **Native App Integration**: Directly integrate with device APIs (e.g., Apple HealthKit, Android Digital Wellbeing) to automatically fetch screen time and activity data, removing the need for manual uploads.
- **Real-time Gamification Updates**: Implement WebSockets or similar for instant updates to leaderboards and point tallies across clients.
- **More Advanced Task & Recommendation Engine**: Incorporate user preferences, historical behavior, and external factors (weather, events) for even more dynamic suggestions.
- **User Profile & Customization**: Allow users to set wellness goals, track specific habits, and personalize their app experience.
- **Progress Visualizations**: Add charts and graphs to the Journal for a visual representation of long-term habit improvement.
- **Notifications & Reminders**: Integrate push notifications to remind users of tasks or insights.

All pieces of The code is publicy available - https://github.com/arvin-intersect/habitual-relief
