import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Star, 
  Clock,
  BookOpen,
  ExternalLink,
  Target,
  Trophy,
  Zap,
  X,
  ChevronRight,
  Play,
  Award,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Rocket,
  Brain,
  Code,
  Plus,
  Route,
  MapPin,
  Compass,
  Flag,
  CheckSquare,
  BookmarkPlus,
  GraduationCap,
  Briefcase,
  FileText,
  Video,
  Download,
  Share2,
  Eye,
  Activity,
  ArrowDown,
  ChevronLeft,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Timer,
  PlayCircle,
  BookMarked,
  Gauge,
  Globe,
  TrendingDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings
} from "lucide-react";

// Enhanced Material Design 3 Components
interface M3CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "elevated" | "filled" | "outlined" | "glass";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  glow?: boolean;
}

const M3Card: React.FC<M3CardProps> = ({ 
  className = "", 
  children, 
  onClick, 
  variant = "elevated", 
  onMouseEnter,
  onMouseLeave,
  glow = false,
  ...props 
}) => {
  const variants = {
    elevated: "bg-white shadow-xl hover:shadow-2xl border-0 backdrop-blur-sm",
    filled: "bg-gradient-to-br from-slate-50 to-blue-50/50 shadow-lg hover:shadow-xl border border-slate-200/50",
    outlined: "bg-white/80 backdrop-blur-md border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-slate-300",
    glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/20"
  };

  return (
    <div 
      className={`rounded-3xl transition-all duration-500 ease-out ${onClick ? 'cursor-pointer' : ''} ${variants[variant]} ${
        glow ? 'ring-2 ring-blue-500/30 shadow-blue-500/20' : ''
      } ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

interface M3ButtonProps {
  variant?: "filled" | "outlined" | "text" | "fab" | "gradient" | "ghost";
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  onClick?: (e?: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const M3Button: React.FC<M3ButtonProps> = ({ 
  variant = "filled", 
  size = "default", 
  onClick, 
  children, 
  className = "", 
  icon, 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
  
  const variants = {
    filled: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 disabled:hover:shadow-xl disabled:hover:from-blue-600 disabled:hover:to-indigo-600",
    outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm disabled:hover:bg-white/80",
    text: "text-blue-600 hover:bg-blue-50/80 backdrop-blur-sm disabled:hover:bg-transparent",
    fab: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl rounded-full disabled:hover:shadow-2xl transform hover:scale-105",
    gradient: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-xl hover:shadow-2xl bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500",
    ghost: "text-slate-700 hover:bg-slate-100/80 backdrop-blur-sm border border-slate-200/50"
  };
  
  const sizes = {
    xs: "px-2 py-1.5 text-xs h-7 rounded-xl",
    sm: "px-3 py-2 text-sm h-9 rounded-2xl",
    default: "px-5 py-3 text-sm h-11 rounded-2xl",
    lg: "px-6 py-4 text-base h-13 rounded-2xl",
    xl: "px-8 py-5 text-lg h-16 rounded-3xl"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'flex items-center'}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

interface M3ChipProps {
  variant?: "filled" | "outlined" | "elevated" | "gradient";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  size?: "sm" | "default" | "lg";
}

const M3Chip: React.FC<M3ChipProps> = ({ 
  variant = "filled", 
  children, 
  className = "", 
  icon,
  size = "default",
  ...props 
}) => {
  const variants = {
    filled: "bg-blue-100/80 text-blue-800 border border-blue-200/50 backdrop-blur-sm",
    outlined: "border border-slate-300 text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-slate-50",
    elevated: "bg-white text-slate-700 shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium transition-all duration-300 hover:scale-105 ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

// Progress Ring Component
const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-slate-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-600 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-2xl font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
        {progress}%
      </span>
    </div>
  );
};

// TypeScript Interfaces (same as original)
interface Resource {
  name: string;
  url: string;
  type: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  duration?: string;
  position?: { x: number; y: number };
  connections?: string[];
  skills?: string[];
  resources?: Resource[];
  project_ideas?: string[];
  next_steps?: string[];
}

interface UserProfile {
  name: string;
  career_goal: string;
  experience_level: string;
  estimated_duration: string;
}

interface CareerOutlook {
  summary: string;
  average_salary_entry_level?: string;
  difficulty_level?: string;
  key_industries?: string[];
}

interface RoadmapStructure {
  title: string;
  description: string;
  nodes: RoadmapNode[];
}

interface RoadmapDataStructure {
  user_profile: UserProfile;
  career_outlook: CareerOutlook;
  roadmap: RoadmapStructure;
}

interface CareerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapData: {
    success?: boolean;
    user_email?: string;
    roadmap: RoadmapDataStructure;
  } | RoadmapDataStructure;
  careerTitle: string;
}

// Enhanced Roadmap Visualization Component
const RoadmapVisualization: React.FC<{ roadmapData: any }> = ({ roadmapData }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'compact'>('timeline');
  const [showFilters, setShowFilters] = useState(false);

  // Handle both data structures
  const roadmapContent = 'roadmap' in roadmapData ? roadmapData.roadmap : roadmapData;
  const { user_profile, career_outlook, roadmap } = roadmapContent;

  const progressPercentage = Math.round((completedNodes.size / (roadmap?.nodes?.length || 1)) * 100);

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const toggleCompletion = (nodeId: string) => {
    const newCompleted = new Set(completedNodes);
    if (completedNodes.has(nodeId)) {
      newCompleted.delete(nodeId);
    } else {
      newCompleted.add(nodeId);
    }
    setCompletedNodes(newCompleted);
  };

  const getNodeIcon = (node: RoadmapNode): React.ReactNode => {
    const isCompleted = completedNodes.has(node.id);
    const iconProps = { className: "w-5 h-5 md:w-6 md:h-6" };

    switch (node.type) {
      case 'start':
        return <Rocket {...iconProps} className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />;
      case 'success':
        return <Trophy {...iconProps} className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />;
      case 'milestone':
        return <Award {...iconProps} className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />;
      case 'required':
        return <Target {...iconProps} className="w-5 h-5 md:w-6 md:h-6 text-red-600" />;
      default:
        if (isCompleted) {
          return <CheckCircle {...iconProps} className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />;
        } else {
          return <Brain {...iconProps} className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />;
        }
    }
  };

  const getNodeColor = (node: RoadmapNode): string => {
    const isCompleted = completedNodes.has(node.id);
    if (isCompleted) return "from-emerald-500 to-teal-500";
    
    switch (node.type) {
      case 'start': return "from-emerald-500 to-green-500";
      case 'success': return "from-amber-500 to-orange-500";
      case 'milestone': return "from-purple-500 to-violet-500";
      case 'required': return "from-red-500 to-rose-500";
      default: return "from-blue-500 to-indigo-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Enhanced Header Stats */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {roadmap?.title || 'Your Learning Journey'}
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                {roadmap?.description || 'A comprehensive roadmap to achieve your career goals'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <M3Button
                variant={viewMode === 'timeline' ? 'filled' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                icon={<Route className="w-4 h-4" />}
              >
                Timeline
              </M3Button>
              
              <M3Button
                variant={viewMode === 'compact' ? 'filled' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compact')}
                icon={<BarChart3 className="w-4 h-4" />}
              >
                Compact
              </M3Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <M3Card variant="glass" className="p-6 text-center group hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-slate-600 mb-1">Duration</div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {user_profile?.estimated_duration || '12-18 months'}
              </div>
            </M3Card>

            <M3Card variant="glass" className="p-6 text-center group hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Route className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-slate-600 mb-1">Total Steps</div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {roadmap?.nodes?.length || 0}
              </div>
            </M3Card>

            <M3Card variant="glass" className="p-6 text-center group hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-slate-600 mb-1">Level</div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {user_profile?.experience_level || 'Beginner'}
              </div>
            </M3Card>

            <M3Card variant="glass" className="p-6 text-center group hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-slate-600 mb-1">Completed</div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                {completedNodes.size}/{roadmap?.nodes?.length || 0}
              </div>
            </M3Card>

            <M3Card variant="glass" className="p-6 text-center group hover:scale-105">
              <ProgressRing progress={progressPercentage} size={60} strokeWidth={6} />
            </M3Card>
          </div>
        </div>
      </div>

      {/* Main Roadmap Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {viewMode === 'timeline' ? (
          /* Timeline View */
          <div className="relative">
            {/* Central Progress Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-emerald-400 opacity-20 rounded-full" 
                 style={{ height: `${(roadmap?.nodes?.length || 0) * 240}px` }} />
            
            {/* Roadmap Steps */}
            <div className="space-y-12">
              {roadmap?.nodes?.map((node: RoadmapNode, index: number) => {
                const isCompleted = completedNodes.has(node.id);
                const isActive = index === activeStep;
                const isUnlocked = index === 0 || completedNodes.has(roadmap.nodes[index - 1]?.id) || isCompleted;
                
                return (
                  <div key={node.id} className="relative flex items-center">
                    
                    {/* Step Progress Indicator */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                      <button
                        onClick={() => handleStepClick(index)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-bold transition-all duration-700 transform hover:scale-110 shadow-2xl group ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-110' 
                            : isActive 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-125 animate-pulse' 
                            : isUnlocked 
                            ? 'bg-white border-4 border-blue-400 text-blue-600 hover:border-blue-500 hover:shadow-blue-500/30' 
                            : 'bg-slate-200 border-4 border-slate-300 text-slate-400'
                        }`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        disabled={!isUnlocked}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                        ) : (
                          <span className="text-lg md:text-xl">{index + 1}</span>
                        )}
                        
                        {/* Glow Effect */}
                        {(isActive || isCompleted) && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-30 animate-ping" />
                        )}
                      </button>
                    </div>

                    {/* Step Content Card */}
                    <div className={`w-full transition-all duration-700 ${
                      index % 2 === 0 ? 'pr-1/2 mr-12' : 'pl-1/2 ml-12'
                    }`}>
                      <M3Card 
                        variant="elevated"
                        className={`p-8 md:p-10 transition-all duration-700 hover:shadow-3xl group ${
                          isActive ? 'ring-2 ring-blue-400/50 shadow-2xl scale-105 bg-gradient-to-br from-blue-50/50 to-indigo-50/50' : ''
                        } ${isAnimating && isActive ? 'animate-pulse' : ''}`}
                        glow={isActive}
                      >
                        
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getNodeColor(node)}/10`}>
                                {getNodeIcon(node)}
                              </div>
                              
                              {node.duration && (
                                <M3Chip 
                                  variant="elevated" 
                                  icon={<Clock className="w-4 h-4" />}
                                  size="lg"
                                >
                                  {node.duration}
                                </M3Chip>
                              )}

                              <M3Chip 
                                variant="gradient" 
                                size="sm"
                                className={`bg-gradient-to-r ${getNodeColor(node)}`}
                              >
                                {node.type}
                              </M3Chip>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {node.title}
                            </h3>
                            
                            <p className="text-slate-600 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {node.description}
                            </p>
                          </div>

                          {/* Completion Toggle */}
                          {isUnlocked && (
                            <M3Button
                              variant="fab"
                              size="sm"
                              onClick={() => toggleCompletion(node.id)}
                              className="w-12 h-12 p-0 ml-4"
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <Circle className="w-6 h-6" />
                              )}
                            </M3Button>
                          )}
                        </div>

                        {/* Enhanced Skill and Resource Previews */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {/* Skills Preview */}
                          {node.skills && node.skills.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-900 flex items-center text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <Brain className="w-5 h-5 mr-2 text-blue-500" />
                                Skills ({node.skills.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {node.skills.slice(0, 6).map((skill: string, skillIndex: number) => (
                                  <M3Chip key={skillIndex} variant="filled" size="sm">
                                    {skill}
                                  </M3Chip>
                                ))}
                                {node.skills.length > 6 && (
                                  <M3Chip variant="outlined" size="sm">
                                    +{node.skills.length - 6} more
                                  </M3Chip>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Resources Preview */}
                          {node.resources && node.resources.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-900 flex items-center text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <BookOpen className="w-5 h-5 mr-2 text-emerald-500" />
                                Resources ({node.resources.length})
                              </h4>
                              <div className="space-y-2">
                                {node.resources.slice(0, 3).map((resource: Resource, resIndex: number) => (
                                  <div key={resIndex} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                      <span className="text-slate-700 font-medium text-sm">{resource.name}</span>
                                      <M3Chip variant="outlined" size="sm">{resource.type}</M3Chip>
                                    </div>
                                    {resource.url && (
                                      <M3Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => window.open(resource.url, '_blank')}
                                        icon={<ExternalLink className="w-3 h-3" />}
                                      />
                                    )}
                                  </div>
                                ))}
                                {node.resources.length > 3 && (
                                  <div className="text-sm text-slate-500 text-center py-2">
                                    +{node.resources.length - 3} more resources
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex items-center space-x-3">
                          <M3Button
                            variant="gradient"
                            size="default"
                            onClick={() => setSelectedNode(node)}
                            disabled={!isUnlocked}
                            className="flex-1"
                            icon={<Eye className="w-4 h-4" />}
                          >
                            View Details
                          </M3Button>
                          
                          {isUnlocked && !isCompleted && (
                            <M3Button
                              variant="outlined"
                              size="default"
                              onClick={() => toggleCompletion(node.id)}
                              icon={<CheckCircle className="w-4 h-4" />}
                            >
                              Complete
                            </M3Button>
                          )}

                          {node.resources && node.resources.length > 0 && (
                            <M3Button
                              variant="ghost"
                              size="default"
                              onClick={() => {
                                // Open first resource
                                if (node.resources?.[0]?.url) {
                                  window.open(node.resources[0].url, '_blank');
                                }
                              }}
                              icon={<PlayCircle className="w-4 h-4" />}
                            >
                              Start
                            </M3Button>
                          )}
                        </div>
                      </M3Card>
                    </div>

                    {/* Connection Arrow */}
                    {index < (roadmap?.nodes?.length || 0) - 1 && (
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 z-10 transition-all duration-500 ${
                        isCompleted ? 'text-emerald-500' : 'text-slate-400'
                      }`}>
                        <div className="flex flex-col items-center space-y-2 py-4">
                          <ArrowDown className="w-5 h-5 animate-bounce" />
                          <div className="w-0.5 h-8 bg-gradient-to-b from-current to-transparent opacity-50" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Compact View */
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmap?.nodes?.map((node: RoadmapNode, index: number) => {
                const isCompleted = completedNodes.has(node.id);
                const isUnlocked = index === 0 || completedNodes.has(roadmap.nodes[index - 1]?.id) || isCompleted;
                
                return (
                  <M3Card
                    key={node.id}
                    variant="elevated"
                    className={`p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
                      isCompleted ? 'ring-2 ring-emerald-400/50 bg-gradient-to-br from-emerald-50 to-teal-50' :
                      isUnlocked ? 'hover:shadow-2xl' : 'opacity-60'
                    }`}
                    onClick={() => isUnlocked && setSelectedNode(node)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getNodeColor(node)}/10`}>
                        {getNodeIcon(node)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          Step {index + 1}
                        </span>
                        {isUnlocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompletion(node.id);
                            }}
                            className={`w-6 h-6 rounded-full transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-emerald-500 text-white' 
                                : 'border-2 border-slate-300 hover:border-blue-500'
                            }`}
                          >
                            {isCompleted && <CheckCircle className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {node.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {node.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {node.duration && (
                          <M3Chip variant="outlined" size="sm" icon={<Clock className="w-3 h-3" />}>
                            {node.duration}
                          </M3Chip>
                        )}
                        {node.skills && (
                          <M3Chip variant="filled" size="sm">
                            {node.skills.length} skills
                          </M3Chip>
                        )}
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </M3Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Detailed View Modal */}
        {selectedNode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <M3Card variant="elevated" className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getNodeColor(selectedNode)}/10`}>
                      {getNodeIcon(selectedNode)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {selectedNode.title}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <M3Chip variant="gradient" size="sm" className={`bg-gradient-to-r ${getNodeColor(selectedNode)}`}>
                          {selectedNode.type}
                        </M3Chip>
                        {selectedNode.duration && (
                          <M3Chip variant="outlined" size="sm" icon={<Clock className="w-3 h-3" />}>
                            {selectedNode.duration}
                          </M3Chip>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <M3Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNode(null)}
                    icon={<X className="w-5 h-5" />}
                    className="p-3"
                  >
                    <span className="sr-only">Close</span>
                  </M3Button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-auto p-8">
                  <p className="text-slate-600 text-lg leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {selectedNode.description}
                  </p>

                  <div className="grid gap-8">
                    {/* Skills Section */}
                    {selectedNode.skills && selectedNode.skills.length > 0 && (
                      <M3Card variant="filled" className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-2xl flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <Brain className="w-6 h-6 mr-3 text-blue-500" />
                            Skills You'll Master
                          </h3>
                          <M3Chip variant="elevated" size="lg">
                            {selectedNode.skills.length} skills
                          </M3Chip>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedNode.skills.map((skill: string, index: number) => (
                            <div key={index} className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-slate-200/50">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                              <span className="text-slate-800 font-medium">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </M3Card>
                    )}

                    {/* Resources Section */}
                    {selectedNode.resources && selectedNode.resources.length > 0 && (
                      <M3Card variant="filled" className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-2xl flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <BookOpen className="w-6 h-6 mr-3 text-emerald-500" />
                            Learning Resources
                          </h3>
                          <M3Chip variant="elevated" size="lg">
                            {selectedNode.resources.length} resources
                          </M3Chip>
                        </div>
                        
                        <div className="grid gap-4">
                          {selectedNode.resources.map((resource: Resource, index: number) => (
                            <M3Card key={index} variant="outlined" className="p-6 hover:shadow-xl transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                                    {resource.type === 'video' ? <Video className="w-6 h-6 text-white" /> :
                                     resource.type === 'book' ? <BookMarked className="w-6 h-6 text-white" /> :
                                     resource.type === 'course' ? <GraduationCap className="w-6 h-6 text-white" /> :
                                     <Globe className="w-6 h-6 text-white" />}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-lg text-slate-900">{resource.name}</h4>
                                    <M3Chip variant="outlined" size="sm">{resource.type}</M3Chip>
                                  </div>
                                </div>
                                
                                {resource.url && (
                                  <M3Button
                                    variant="gradient"
                                    size="default"
                                    onClick={() => window.open(resource.url, '_blank')}
                                    icon={<ExternalLink className="w-4 h-4" />}
                                  >
                                    Access Resource
                                  </M3Button>
                                )}
                              </div>
                            </M3Card>
                          ))}
                        </div>
                      </M3Card>
                    )}

                    {/* Project Ideas Section */}
                    {selectedNode.project_ideas && selectedNode.project_ideas.length > 0 && (
                      <M3Card variant="filled" className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-2xl flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <Lightbulb className="w-6 h-6 mr-3 text-amber-500" />
                            Hands-on Project Ideas
                          </h3>
                          <M3Chip variant="elevated" size="lg">
                            {selectedNode.project_ideas.length} projects
                          </M3Chip>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          {selectedNode.project_ideas.map((project: string, index: number) => (
                            <M3Card key={index} variant="outlined" className="p-6 group hover:shadow-2xl transition-all duration-500">
                              <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-slate-800 leading-relaxed font-medium">{project}</p>
                                  <div className="mt-4 flex items-center space-x-2">
                                    <M3Button variant="text" size="sm" icon={<Code className="w-4 h-4" />}>
                                      Start Project
                                    </M3Button>
                                    <M3Button variant="ghost" size="sm" icon={<BookmarkPlus className="w-4 h-4" />}>
                                      Save Idea
                                    </M3Button>
                                  </div>
                                </div>
                              </div>
                            </M3Card>
                          ))}
                        </div>
                      </M3Card>
                    )}

                    {/* Next Steps */}
                    {selectedNode.next_steps && selectedNode.next_steps.length > 0 && (
                      <M3Card variant="filled" className="p-6">
                        <h3 className="font-bold text-2xl mb-6 flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <ArrowRight className="w-6 h-6 mr-3 text-purple-500" />
                          Recommended Next Steps
                        </h3>
                        
                        <div className="space-y-4">
                          {selectedNode.next_steps.map((step: string, index: number) => (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl border border-slate-200/50">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="text-slate-800 font-medium flex-1">{step}</span>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </M3Card>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-slate-200/50 p-6 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <M3Button
                        variant="gradient"
                        size="lg"
                        onClick={() => toggleCompletion(selectedNode.id)}
                        icon={completedNodes.has(selectedNode.id) ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      >
                        {completedNodes.has(selectedNode.id) ? 'Mark Incomplete' : 'Mark Complete'}
                      </M3Button>
                      
                      {selectedNode.resources && selectedNode.resources[0]?.url && (
                        <M3Button
                          variant="outlined"
                          size="lg"
                          onClick={() => window.open(selectedNode.resources![0].url, '_blank')}
                          icon={<PlayCircle className="w-5 h-5" />}
                        >
                          Start Learning
                        </M3Button>
                      )}
                    </div>

                    <M3Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setSelectedNode(null)}
                    >
                      Close Details
                    </M3Button>
                  </div>
                </div>
              </div>
            </M3Card>
          </div>
        )}

        {/* Completion Celebration */}
        {completedNodes.size === roadmap?.nodes?.length && roadmap?.nodes?.length > 0 && (
          <M3Card variant="glass" className="text-center p-12 mt-12 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border-2 border-white/30">
            <div className="relative">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-amber-500 animate-bounce" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 animate-ping" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif' }}>
              🎉 Mission Accomplished! 🎉
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Congratulations on completing your entire learning roadmap! You've gained {roadmap?.nodes?.reduce((acc, node) => acc + (node.skills?.length || 0), 0)} skills and are now ready for your next career milestone.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <M3Button
                variant="gradient"
                size="xl"
                icon={<Share2 className="w-6 h-6" />}
              >
                Share Achievement
              </M3Button>
              
              <M3Button
                variant="outlined"
                size="xl"
                icon={<Download className="w-6 h-6" />}
              >
                Download Certificate
              </M3Button>
            </div>
          </M3Card>
        )}
      </div>
    </div>
  );
};

// Main Modal Component with Enhanced Design
const CareerRoadmapModal: React.FC<CareerRoadmapModalProps> = ({ 
  isOpen, 
  onClose, 
  roadmapData, 
  careerTitle 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const downloadRoadmap = () => {
    const dataStr = JSON.stringify(roadmapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${careerTitle.replace(/\s+/g, '_')}_roadmap.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareRoadmap = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${careerTitle} Learning Roadmap`,
          text: `Check out this comprehensive learning roadmap for ${careerTitle}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (!isOpen || !roadmapData) return null;

  return (
    <>
      {/* Enhanced Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
        rel="stylesheet" 
      />

      {/* Full Screen Modal */}
      <div className={`fixed inset-0 bg-white z-50 overflow-auto ${isFullscreen ? '' : 'p-4 md:p-8'}`}>
        
        {/* Enhanced Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200/50 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Route className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {careerTitle} Roadmap
                  </h1>
                  <p className="text-slate-600 text-sm">Interactive Learning Journey</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <M3Button
                  variant="ghost"
                  size="sm"
                  onClick={shareRoadmap}
                  icon={<Share2 className="w-4 h-4" />}
                >
                  <span className="hidden md:inline">Share</span>
                </M3Button>

                <M3Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadRoadmap}
                  icon={<Download className="w-4 h-4" />}
                >
                  <span className="hidden md:inline">Export</span>
                </M3Button>

                <M3Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  icon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                >
                  <span className="sr-only">Toggle Fullscreen</span>
                </M3Button>
                
                <M3Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X className="w-5 h-5" />}
                  className="p-3"
                >
                  <span className="sr-only">Close</span>
                </M3Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <RoadmapVisualization roadmapData={roadmapData} />
      </div>
    </>
  );
};

export default CareerRoadmapModal;