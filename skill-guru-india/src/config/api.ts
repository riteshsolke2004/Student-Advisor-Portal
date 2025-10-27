const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fastapi-backend-fixed-278398219986.asia-south1.run.app';

export const chatAPI = {
  enhancedChat: `${API_BASE_URL}/api/chat/enhanced`,
  voiceChat: `${API_BASE_URL}/api/chat/voice`,
  status: `${API_BASE_URL}/api/chat/status`,
  audio: (filename: string) => `${API_BASE_URL}/api/chat/audio/${filename}`
};