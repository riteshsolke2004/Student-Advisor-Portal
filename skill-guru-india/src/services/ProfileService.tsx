// services/profileService.ts
export interface UserProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  careerInfo: {
    currentRole: string;
    industry: string;
    expectedSalary: string;
    preferredLocation: string;
  };
  academicBackground: {
    educationLevel: string;
    fieldOfStudy: string;
    yearsOfExperience: string;
    interests: string[];
  };
}

const API_BASE_URL = "http://127.0.0.1:8000";

export const profileService = {
  // Get user profile
  async getUserProfile(userEmail: string): Promise<UserProfile | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile doesn't exist
        }
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Update user profile  
  async updateUserProfile(userEmail: string, profileData: UserProfile): Promise<UserProfile> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/${userEmail}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile: profileData })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Create user profile
  async createUserProfile(userEmail: string, profileData: UserProfile): Promise<UserProfile> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userEmail,
          personalInfo: profileData.personalInfo,
          careerInfo: profileData.careerInfo,
          academicBackground: profileData.academicBackground
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create profile');
      }
      
      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  // Check if profile exists
  async checkProfileExists(userEmail: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/profile/${userEmail}/exists`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  }
};
