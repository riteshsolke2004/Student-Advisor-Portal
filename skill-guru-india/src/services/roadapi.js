// Fix the double slash issue and add proper error handling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://career-roadmap-278398219986.asia-south1.run.app';

export const generateRoadmap = async (sessionId, query, reset = false) => {
  try {
    // Remove the double slash - it should be '/chat' not '//chat'
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials
      body: JSON.stringify({
        session_id: sessionId,
        query: query,
        reset: reset
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    
    // Better error messages for debugging
    if (error.message.includes('CORS')) {
      throw new Error('CORS error - Backend not accessible from frontend');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error - Check if backend is running');
    }
    
    throw error;
  }
};

export const getSessionInfo = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Session API Error:', error);
    throw error;
  }
};

export const resetSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        session_id: sessionId,
        query: '',
        reset: true
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Reset API Error:', error);
    throw error;
  }
};
