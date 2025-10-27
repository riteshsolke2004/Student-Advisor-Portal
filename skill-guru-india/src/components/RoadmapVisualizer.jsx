import React from 'react';
import { Clock, Users, TrendingUp, MapPin, DollarSign } from 'lucide-react';
import NodeCard from './NodeCard';


const RoadmapVisualizer = ({ roadmapData, onNodeClick, selectedNode }) => {
  if (!roadmapData) return null;

  const { metadata, career_insights, roadmap } = roadmapData;
  const phases = roadmap?.phases || [];

  const phaseColors = {
    'phase-1': 'from-blue-500 to-blue-600',
    'phase-2': 'from-green-500 to-green-600', 
    'phase-3': 'from-yellow-500 to-yellow-600',
    'phase-4': 'from-red-500 to-red-600'
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Roadmap Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {metadata?.title || "Your Learning Roadmap"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {metadata?.description}
          </p>
        </div>

        {/* Roadmap Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-blue-900">Duration</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">{metadata?.total_duration}</p>
            <p className="text-sm text-blue-600">{metadata?.estimated_hours} hours</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-green-900">Modules</span>
            </div>
            <p className="text-2xl font-bold text-green-800">{metadata?.total_nodes}</p>
            <p className="text-sm text-green-600">{phases.length} phases</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-purple-900">Level</span>
            </div>
            <p className="text-2xl font-bold text-purple-800 capitalize">{metadata?.difficulty}</p>
            <p className="text-sm text-purple-600">Comprehensive path</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-orange-600" />
              <span className="font-semibold text-orange-900">Salary</span>
            </div>
            <p className="text-2xl font-bold text-orange-800">{career_insights?.avg_salary}</p>
            <p className="text-sm text-orange-600">Expected range</p>
          </div>
        </div>

        {/* Career Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Career Opportunities
            </h4>
            <div className="flex flex-wrap gap-2">
              {career_insights?.job_roles?.map((role, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              Top Hiring Cities
            </h4>
            <div className="flex flex-wrap gap-2">
              {career_insights?.hiring_cities?.map((city, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <div key={phase.phase_id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Phase Header */}
            <div className={`bg-gradient-to-r ${phaseColors[phase.phase_id] || 'from-gray-500 to-gray-600'} px-8 py-6`}>
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Phase {phaseIndex + 1}: {phase.phase_name}
                  </h3>
                  <p className="text-lg opacity-90 mb-2">{phase.phase_description}</p>
                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {phase.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {phase.nodes?.length || 0} modules
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold opacity-20">
                    {String(phaseIndex + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            {/* Nodes Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phase.nodes?.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    onClick={() => onNodeClick(node)}
                    isSelected={selectedNode?.id === node.id}
                    phaseColor={phase.color || '#6b7280'}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapVisualizer;
