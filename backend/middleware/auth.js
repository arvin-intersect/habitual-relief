// backend/middleware/auth.js
import { Clerk } from '@clerk/clerk-sdk-node';
import '../config/env.js'; // Ensure env vars are loaded

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export async function authenticateClerk(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("DEBUG AUTH: --- START AUTHENTICATION ---");
    console.log("DEBUG AUTH: Raw Authorization header:", authHeader ? authHeader.substring(0, 100) + '...' : 'None');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("DEBUG AUTH: No Bearer token found or header malformed.");
      return res.status(401).json({ error: 'Unauthorized: No token provided or malformed header' });
    }

    const token = authHeader.split(' ')[1];
    console.log("DEBUG AUTH: Token extracted (first 20 chars):", token.substring(0, 20) + '...');

    // Verify the token - this returns the decoded session claims
    const verifiedToken = await clerk.verifyToken(token);

    console.log("DEBUG AUTH: Clerk verification attempted.");
    console.log("DEBUG AUTH: Verified token object:", JSON.stringify(verifiedToken, null, 2));

    // The verified token contains the session claims, including 'sub' which is the userId
    if (!verifiedToken || !verifiedToken.sub) {
      console.log("DEBUG AUTH: Token verification FAILED: No sub (userId) in verified token.");
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // 'sub' claim contains the userId
    req.userId = verifiedToken.sub;
    console.log("DEBUG AUTH: Token verification SUCCESS for userId:", req.userId);
    console.log("DEBUG AUTH: --- END AUTHENTICATION (SUCCESS) ---");
    next();
  } catch (error) {
    console.error('DEBUG AUTH: Clerk authentication error in middleware (CATCH BLOCK):', error.message);
    console.error('DEBUG AUTH: Full error:', error);
    console.log("DEBUG AUTH: --- END AUTHENTICATION (FAILED) ---");
    return res.status(401).json({ error: 'Unauthorized: Token verification failed', details: error.message });
  }
}