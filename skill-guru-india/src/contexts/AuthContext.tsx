// src/contexts/AuthContext.tsx - Complete updated version
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced session restore with token validation
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Validate token with backend
          const isValidToken = await validateToken(token);
          
          if (isValidToken) {
            // Token is valid, restore session
            setUser({ ...userData, token });
            console.log("Session restored successfully");
          } else {
            // Token is invalid, clear storage
            console.log("Token validation failed, clearing session");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userPreferences');
          }
        } else {
          console.log("No saved session found");
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userPreferences');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to prevent flash and allow components to mount
    const timer = setTimeout(restoreSession, 100);
    return () => clearTimeout(timer);
  }, []);

  // Function to validate token with backend
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('https://chatbot-app-278398219986.us-central1.run.app/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      } else if (response.status === 401) {
        // Token expired or invalid
        console.log("Token expired or invalid");
        return false;
      } else {
        // Other error, assume token is still valid but there's a network issue
        console.log(`Token validation returned ${response.status}, assuming valid`);
        return true;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // Network error, assume token is still valid to avoid unnecessary logouts
      return true;
    }
  };

  const login = (userData: User) => {
    console.log("Login called with:", userData);
    
    // Set user state
    setUser(userData);
    
    // Save to localStorage
    const userToSave = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      firstName: userData.firstName,
      lastName: userData.lastName
    };
    
    localStorage.setItem('user', JSON.stringify(userToSave));
    
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    console.log("User logged in and saved to localStorage");
  };

  const logout = () => {
    console.log("Logout called");
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
    
    // Optional: Clear any other app-specific storage
    localStorage.removeItem('redirectAfterLogin');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update localStorage (excluding token)
      const userToSave = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      };
      
      localStorage.setItem('user', JSON.stringify(userToSave));
      console.log("User data updated");
    }
  };

  // Auto-refresh token periodically (optional)
  useEffect(() => {
    if (user && user.token) {
      const refreshInterval = setInterval(async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const isValid = await validateToken(token);
          if (!isValid) {
            console.log("Token became invalid, logging out");
            logout();
          }
        }
      }, 15 * 60 * 1000); // Check every 15 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
