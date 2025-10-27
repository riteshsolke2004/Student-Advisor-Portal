import React, { useState } from 'react';
import { Send, Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import { generateRoadmap } from '../services/roadapi';

const RoadmapGenerator = ({ 
  sessionId, 
  onRoadmapGenerated, 
  isLoading, 
  setIsLoading,
  existingRoadmap 
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await generateRoadmap(sessionId, query);
      
      if (response.status === 'success') {
        onRoadmapGenerated(response.roadmap);
        setQuery('');
      } else {
        setError(response.message || 'Failed to generate roadmap');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Roadmap generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

const suggestions = [
  "Learn MERN stack (MongoDB, Express, React, Node.js) for full-stack web development",
  "Build and train AI models using Python, TensorFlow, and Scikit-Learn",
  "Deploy scalable applications on Google Cloud with Cloud Run and Firebase",
  "Automate web testing using Selenium and Cypress frameworks",
  "Master DevOps with Docker, Kubernetes, and CI/CD pipelines"
];


  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dynamic Career Roadmap
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {existingRoadmap 
            ? "Update your learning path with new skills and technologies"
            : "Create your personalized learning journey with AI-powered recommendations"
          }
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="query" className="block text-sm font-semibold text-gray-700 mb-3">
              {existingRoadmap ? "What would you like to add or modify?" : "Describe your learning goals"}
            </label>
            <div className="relative">
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={existingRoadmap 
                  ? "Add DevOps and cloud computing to my roadmap..."
                  : "I want to learn React, Node.js and become a full-stack developer..."
                }
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                rows="4"
                disabled={isLoading}
              />
              <div className="absolute bottom-4 right-4">
                <Sparkles className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                {existingRoadmap ? "Updating Roadmap..." : "Generating Roadmap... it may take upto few minutes"}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {existingRoadmap ? "Update Roadmap" : "Generate Roadmap"}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Suggestions */}
      {!existingRoadmap && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Try these examples:
          </h3>
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-gray-700 hover:text-blue-700 group"
                disabled={isLoading}
              >
                <span className="text-sm group-hover:font-medium">"{suggestion}"</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
