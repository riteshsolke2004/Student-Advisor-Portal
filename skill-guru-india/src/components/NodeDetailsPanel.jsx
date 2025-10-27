import React from 'react';
import { X, Clock, Star, BookOpen, Play, ExternalLink, Github, Award } from 'lucide-react';
import { extractVideoId } from '../utils/helpers';

// Define difficultyColors outside components so they can be shared
const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200'
};

const NodeDetailsPanel = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="pr-16">
          <h2 className="text-3xl font-bold mb-2">{node.title}</h2>
          <p className="text-lg opacity-90 mb-4">{node.description}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30">
              {node.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {node.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {node.type}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Skills Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Skills You'll Learn
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {node.skills?.map((skill, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <span className="text-blue-800 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        {node.resources && node.resources.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-red-500" />
              Learning Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {node.resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {node.projects && node.projects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Hands-on Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {node.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Completion Criteria */}
        {node.completion_criteria && node.completion_criteria.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              Completion Criteria
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <ul className="space-y-2">
                {node.completion_criteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-green-800">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceCard = ({ resource }) => {
  const isVideo = resource.type === 'video' || resource.url?.includes('youtube');
  const videoId = isVideo ? extractVideoId(resource.url) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Fixed Thumbnail for videos */}
      {thumbnailUrl && (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <img 
            src={thumbnailUrl} 
            alt={resource.name || 'Video thumbnail'}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOTg5OEE2Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjU2NTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WaWRlbyBOb3QgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 shadow-lg">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 flex-1 overflow-hidden">
            <div className="line-clamp-2">
              {resource.name || 'Untitled Resource'}
            </div>
          </h4>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
            isVideo 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isVideo ? 'Video' : 'Course'}
          </span>
        </div>
        
        <div className="text-gray-600 text-sm mb-3 overflow-hidden">
          <div className="line-clamp-2">
            {resource.description || 'No description available'}
          </div>
        </div>
        
        {resource.channel && (
          <p className="text-xs text-gray-500 mb-3">
            By {resource.channel}
          </p>
        )}
        
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          {isVideo ? 'Watch Video' : 'View Course'}
        </a>
      </div>
    </div>
  );
};


const ProjectCard = ({ project }) => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex-1">
          {project.name || 'Untitled Project'}
        </h4>
        {project.github_ready && (
          <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <Github className="w-3 h-3" />
            Portfolio
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        {project.description || 'No description available'}
      </p>
      
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span className={`px-2 py-1 rounded ${
          difficultyColors[project.difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}>
          {project.difficulty || 'Unknown'}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {project.duration || 'Unknown'}
        </span>
      </div>
      
      {project.skills && project.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
          {project.skills.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              +{project.skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeDetailsPanel;
