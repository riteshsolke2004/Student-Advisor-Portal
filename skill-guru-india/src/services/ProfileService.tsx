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
      console.log('📥 Fetching profile for:', userEmail);
      
      const response = await fetch(`${API_BASE_URL}/api/profile/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('📭 Profile not found');
          return null;
        }
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      console.log('✅ Profile loaded:', data);
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
      console.log('📤 Updating profile for:', userEmail, profileData);
      
      const response = await fetch(`${API_BASE_URL}/api/profile/${userEmail}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile: profileData })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update error:', errorText);
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      console.log('✅ Profile updated:', data);
      return data.profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // ✅ FIXED: Create user profile with correct structure
  async createUserProfile(userEmail: string, profileData: UserProfile): Promise<UserProfile> {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ Correct structure: pass profile data directly
      const requestBody = {
        user_id: userEmail,
        personalInfo: profileData.personalInfo,
        careerInfo: profileData.careerInfo,
        academicBackground: profileData.academicBackground
      };
      
      console.log('📤 Creating profile with data:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/api/profile/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create error:', errorText);
        throw new Error(`Failed to create profile: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Profile created successfully:', data);
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
        console.log(`Profile exists for ${userEmail}:`, data.exists);
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  }
};
