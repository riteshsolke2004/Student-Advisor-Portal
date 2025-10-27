import React from 'react';
import { Clock, Star, BookOpen, Code, Award, ChevronRight } from 'lucide-react';

const NodeCard = ({ node, onClick, isSelected, phaseColor }) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  const typeIcons = {
    required: <Star className="w-4 h-4" />,
    optional: <BookOpen className="w-4 h-4" />,
    milestone: <Award className="w-4 h-4" />,
    project: <Code className="w-4 h-4" />
  };

  const typeColors = {
    required: 'text-red-600 bg-red-50',
    optional: 'text-blue-600 bg-blue-50',
    milestone: 'text-purple-600 bg-purple-50',
    project: 'text-green-600 bg-green-50'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1
        ${isSelected 
          ? 'border-blue-500 shadow-xl transform -translate-y-1 ring-4 ring-blue-100' 
          : 'border-gray-200 hover:border-blue-300 shadow-lg'
        }
      `}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${typeColors[node.type] || 'text-gray-600 bg-gray-50'}`}>
            {typeIcons[node.type] || <BookOpen className="w-4 h-4" />}
          </div>
          <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${isSelected ? 'rotate-90 text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
        </div>

        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
          {node.title || 'Untitled Node'}
        </h4>
        
        <div className="text-gray-600 text-sm mb-4 overflow-hidden">
          <div className="line-clamp-2">
            {node.description || 'No description available'}
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[node.difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {node.difficulty || 'Unknown'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {node.duration || 'Unknown'}
          </span>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {node.skills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {skill}
              </span>
            ))}
            {node.skills?.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                +{node.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Resources Count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {node.resources?.length || 0} resources
          </span>
          <span className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            {node.projects?.length || 0} projects
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="h-1 bg-gray-100">
        <div 
          className={`h-full transition-all duration-300 ${isSelected ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'}`}
          style={{ width: isSelected ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
};

export default NodeCard;
