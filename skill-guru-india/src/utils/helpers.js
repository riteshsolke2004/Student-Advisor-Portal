export const generateSessionId = () => {
  return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const extractVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

export const formatDuration = (duration) => {
  if (!duration) return 'Unknown';
  return duration.replace(/(\d+)-(\d+)\s*(\w+)/, '$1-$2 $3');
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};
