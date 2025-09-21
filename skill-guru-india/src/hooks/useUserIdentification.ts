// src/hooks/useUserIdentification.ts
import { useState, useCallback } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  currentRole: string;
  interests: string[];
  educationLevel: string;
  fieldOfStudy: string;
  yearsOfExperience: string;
  created_at: any;
}

interface UserIdentificationResult {
  exists: boolean;
  user_id?: string;
  profile?: UserProfile;
  message: string;
}

interface UseUserIdentificationReturn {
  identifyUser: (email: string) => Promise<UserIdentificationResult | null>;
  getUserProfile: (userId: string) => Promise<any | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useUserIdentification = (): UseUserIdentificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update this URL to match your deployed backend
  const API_BASE_URL = 'https://chatbot-app-278398219986.us-central1.run.app/auth';

  const identifyUser = useCallback(async (email: string): Promise<UserIdentificationResult | null> => {
    if (!email.trim() || !email.includes('@')) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: UserIdentificationResult = await response.json();
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to identify user';
      setError(errorMessage);
      console.error('User identification failed:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  const getUserProfile = useCallback(async (userId: string): Promise<any | null> => {
    if (!userId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user profile';
      setError(errorMessage);
      console.error('Get user profile failed:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    identifyUser,
    getUserProfile,
    isLoading,
    error,
    clearError
  };
};
