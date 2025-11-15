// src/lib/clerk-utils.ts
import { useAuth } from '@clerk/clerk-react';

export const useClerkToken = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const getAuthToken = async (): Promise<string | null> => {
    if (!isLoaded || !isSignedIn) {
      return null;
    }
    
    return await getToken(); 
  };

  return getAuthToken;
};