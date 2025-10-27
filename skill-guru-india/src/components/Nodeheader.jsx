import React from 'react';
import { RefreshCw, Github, BookOpen } from 'lucide-react';

const Header = ({ onReset, hasRoadmap }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dynamic Roadmap</h1>
              <p className="text-sm text-gray-600">AI-Powered Learning Paths</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasRoadmap && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Roadmap
              </button>
            )}
            
            <a
              href="https://github.com/yourusername/dynamic-roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
