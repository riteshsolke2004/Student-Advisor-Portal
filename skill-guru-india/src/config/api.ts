const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const chatAPI = {
  enhancedChat: `${API_BASE_URL}/api/chat/enhanced`,
  voiceChat: `${API_BASE_URL}/api/chat/voice`,
  status: `${API_BASE_URL}/api/chat/status`,
  audio: (filename: string) => `${API_BASE_URL}/api/chat/audio/${filename}`
};