// backend/config/env.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory (one level up from config)
dotenv.config({ path: join(__dirname, '..', '.env') });

// Validate required environment variables
const requiredEnvVars = [
  'GEMINI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'ML_BACKEND_URL',
  'CLERK_SECRET_KEY' // Added Clerk secret key
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n📝 Please create a .env file in the backend directory with these variables.\n');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('📌 Backend Configuration:');
console.log(`   - GEMINI_API_KEY: ${process.env.GEMINI_API_KEY.substring(0, 5)}... (truncated)`);
console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL.substring(0, 30)}... (truncated)`);
console.log(`   - ML_BACKEND_URL: ${process.env.ML_BACKEND_URL}`);
console.log(`   - CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY.substring(0, 5)}... (truncated)`);
console.log(`   - PORT: ${process.env.PORT || 3001}`);
console.log('');