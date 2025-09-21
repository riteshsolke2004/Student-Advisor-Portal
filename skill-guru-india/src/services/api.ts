// src/services/api.ts
import axios from 'axios';

// FORCE CLOUD RUN URL - This ensures it always uses your deployed service
const CLOUD_RUN_URL = 'https://mentor-app-278398219986.us-central1.run.app';

// Environment configuration
const getApiConfig = () => {
  // Get Vite environment variables
  const apiUrl = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;
  
  // For debugging - log all environment variables
  console.log('Environment Debug:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD
  });
  
  // Use explicit Cloud Run URL if environment variable is not set
  const baseURL = apiUrl || CLOUD_RUN_URL;
  
  console.log('API Configuration:', {
    apiUrl,
    baseURL,
    isDev,
    mode,
    usingFallback: !apiUrl
  });
  
  return { baseURL };
};

const { baseURL } = getApiConfig();

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making request to: ${config.baseURL}${config.url}`);
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error - Backend unreachable:', baseURL);
    }
    
    return Promise.reject(error);
  }
);

// Mentor API service functions
export const mentorAPI = {
  testConnection: async () => {
    try {
      console.log('🔍 Testing connection to:', baseURL);
      const response = await apiClient.get('/');
      console.log('✅ Connection test successful');
      return response.data;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
  },

  sendMessage: async (message: string) => {
    try {
      console.log('💬 Sending message to:', `${baseURL}/chat`);
      const response = await apiClient.post('/chat', { message });
      console.log('✅ Message sent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Chat API Error:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      console.log('🏥 Health check to:', `${baseURL}/health`);
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  }
};

export default apiClient;
