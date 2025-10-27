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
  Activity
} from "lucide-react";

// Fixed Material Design 3 Card Component
interface M3CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "elevated" | "filled" | "outlined";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const M3Card: React.FC<M3CardProps> = ({ 
  className = "", 
  children, 
  onClick, 
  variant = "elevated", 
  onMouseEnter,
  onMouseLeave,
  ...props 
}) => {
  const variants = {
    elevated: "bg-white shadow-lg hover:shadow-xl border-0",
    filled: "bg-gradient-to-br from-blue-50 to-purple-50 shadow-md border-0",
    outlined: "bg-white border-2 border-gray-200 shadow-sm hover:shadow-md"
  };

  return (
    <div 
      className={`rounded-2xl md:rounded-3xl transition-all duration-300 cursor-pointer ${variants[variant]} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};






// Fixed Material Design 3 Button Component
interface M3ButtonProps {
  variant?: "filled" | "outlined" | "text" | "fab";
  size?: "sm" | "default" | "lg";
  onClick?: (e?: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const M3Button: React.FC<M3ButtonProps> = ({ 
  variant = "filled", 
  size = "default", 
  onClick, 
  children, 
  className = "", 
  icon, 
  disabled = false,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    filled: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl disabled:hover:shadow-lg",
    outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white disabled:hover:bg-white",
    text: "text-blue-600 hover:bg-blue-50 disabled:hover:bg-transparent",
    fab: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl rounded-full disabled:hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm h-8 md:h-10 rounded-xl md:rounded-2xl",
    default: "px-4 py-3 text-sm md:text-base h-10 md:h-12 rounded-2xl md:rounded-3xl",
    lg: "px-6 py-4 text-base md:text-lg h-12 md:h-14 rounded-2xl md:rounded-3xl"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      style={{ fontFamily: 'Google Sans, sans-serif' }}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Fixed Material Design 3 Chip Component
interface M3ChipProps {
  variant?: "filled" | "outlined" | "elevated";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const M3Chip: React.FC<M3ChipProps> = ({ 
  variant = "filled", 
  children, 
  className = "", 
  icon, 
  ...props 
}) => {
  const variants = {
    filled: "bg-blue-100 text-blue-800 border border-blue-200",
    outlined: "border border-gray-300 text-gray-700 bg-white",
    elevated: "bg-gray-100 text-gray-800 shadow-md"
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 ${variants[variant]} ${className}`}
      style={{ fontFamily: 'Google Sans, sans-serif' }}
      {...props}
    >
      {icon && <span className="mr-1 md:mr-2">{icon}</span>}
      {children}
    </span>
  );
};

// Component to display resource links with thumbnails
interface ResourceLinkProps {
  resource: Resource;
  compact?: boolean;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({ resource, compact = false }) => {
  const [thumbnailError, setThumbnailError] = React.useState(false);
  
  // Check if URL is YouTube and get thumbnail
  const getThumbnailUrl = (url: string): string | null => {
    if (!url) return null;
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    return null;
  };

  // Get icon based on resource type
  const getResourceIcon = (type: string): React.ReactNode => {
    const iconClass = "w-4 h-4 text-white";
    switch (type.toLowerCase()) {
      case 'video': return <Video className={iconClass} />;
      case 'book': return <BookOpen className={iconClass} />;
      case 'course': return <GraduationCap className={iconClass} />;
      case 'article': return <FileText className={iconClass} />;
      case 'tutorial': return <Code className={iconClass} />;
      default: return <BookOpen className={iconClass} />;
    }
  };

  const thumbnailUrl = getThumbnailUrl(resource.url || '');

  // Compact view (for small spaces)
  if (compact) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            {getResourceIcon(resource.type)}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-gray-700 font-medium text-sm block truncate">{resource.name}</span>
            <M3Chip variant="outlined"  className="mt-1">{resource.type}</M3Chip>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 ml-2" />
      </a>
    );
  }

  // Full view (with thumbnail if available)
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <M3Card variant="outlined" className="p-4 md:p-6 hover:shadow-lg transition-all">
        <div className="flex items-start space-x-4">
          {/* Show thumbnail for YouTube or icon for others */}
          <div className="flex-shrink-0">
            {thumbnailUrl && !thumbnailError ? (
              <div className="relative w-24 h-18 md:w-32 md:h-24 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt={resource.name}
                  className="w-full h-full object-cover"
                  onError={() => setThumbnailError(true)}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                {getResourceIcon(resource.type)}
              </div>
            )}
          </div>

          {/* Resource details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-2 group-hover:text-blue-600">
              {resource.name}
            </h4>
            <M3Chip variant="outlined" >{resource.type}</M3Chip>
          </div>

          {/* Open button */}
          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
        </div>
      </M3Card>
    </a>
  );
};








// TypeScript Interfaces
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

interface RoadmapVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapData: RoadmapDataStructure | {
    success?: boolean;
    user_email?: string;
    roadmap: RoadmapDataStructure;
  };
  careerTitle: string;
}

interface CareerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapData: any;
  careerTitle: string;
  version?: number; // Add version prop
  lastUpdate?: string; // Add last update prop
}




const AdvancedRoadmapVisualization: React.FC<RoadmapVisualizationProps> = ({ 
  isOpen, 
  onClose, 
  roadmapData, 
  careerTitle 
}) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'roadmap' | 'timeline' | 'progress'>('roadmap');
  const detailsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  if (!isOpen || !roadmapData) return null;

  // Handle both data structures (direct roadmap or wrapped in response)
  // Safely extract roadmap data with proper validation
const getRoadmapContent = (data: any) => {
  console.log('Processing roadmap data:', {
    dataType: typeof data,
    isObject: data && typeof data === 'object',
    hasRoadmapProp: data && 'roadmap' in data,
    hasUserProfile: data && 'user_profile' in data,
    dataKeys: data ? Object.keys(data) : []
  });

  // If data is already the roadmap structure (has user_profile, career_outlook, roadmap)
  if (data && typeof data === 'object' && 'user_profile' in data && 'career_outlook' in data && 'roadmap' in data) {
    console.log('Found direct roadmap structure');
    return data;
  }
  
  // If data has a 'roadmap' property that contains the structure
  if (data && typeof data === 'object' && 'roadmap' in data && data.roadmap) {
    console.log('Found nested roadmap structure');
    return data.roadmap;
  }
  
  console.error('Invalid roadmap data structure:', data);
  return null;
};

const roadmapContent = getRoadmapContent(roadmapData);

// Validate and extract with fallbacks
const user_profile = roadmapContent?.user_profile || {
  name: 'User',
  career_goal: 'Career Development',
  experience_level: 'Fresher',
  estimated_duration: '12-18 months'
};


const career_outlook = roadmapContent?.career_outlook || {
  summary: 'Career outlook information will be displayed here.',
  average_salary_entry_level: 'Varies by location and experience',
  difficulty_level: 'Medium',
  key_industries: []
};

const roadmap = roadmapContent?.roadmap || {
  title: 'Learning Roadmap',
  description: 'Your personalized learning journey',
  nodes: []
};


useEffect(() => {
  if (isOpen && roadmapData) {
    console.log('RoadmapVisualization mounted with data:', {
      hasValidData: !!roadmapContent,
      hasUserProfile: !!roadmapContent?.user_profile,
      hasCareerOutlook: !!roadmapContent?.career_outlook,
      hasRoadmapSection: !!roadmapContent?.roadmap,
      hasRoadmapNodes: !!roadmapContent?.roadmap?.nodes,
      nodeCount: roadmapContent?.roadmap?.nodes?.length || 0,
      dataStructure: roadmapContent ? Object.keys(roadmapContent) : 'invalid'
    });
  }
}, [isOpen, roadmapData, roadmapContent]);


    



// Early return for invalid or missing data
if (!isOpen || !roadmapData || !roadmapContent || !roadmap?.nodes) {
  if (isOpen && (!roadmapData || !roadmapContent)) {
    console.error('❌ RoadmapVisualization: Invalid data provided');
  }
  return null;
}

// Additional safety check for nodes
if (roadmap.nodes.length === 0) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Learning Path Available</h3>
        <p className="text-gray-600 mb-6">The roadmap data seems to be incomplete. Please try generating again.</p>
        <button 
          onClick={onClose}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}













  // Calculate progress
  useEffect(() => {
    const totalNodes = roadmap?.nodes?.length || 0;
    const completed = completedNodes.size;
    setProgress(totalNodes > 0 ? Math.round((completed / totalNodes) * 100) : 0);
  }, [completedNodes, roadmap?.nodes]);

  const getNodeIcon = (node: RoadmapNode): React.ReactNode => {
    const isCompleted = completedNodes.has(node.id);
    const isUnlocked = isCompleted || node.status === 'current';
    const iconProps = { className: "w-6 h-6 md:w-8 md:h-8" };

    switch (node.type) {
      case 'start':
        return <Rocket {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-green-600" />;
      case 'success':
        return <Trophy {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />;
      case 'milestone':
        return <Award {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />;
      case 'required':
        return <Target {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-red-600" />;
      default:
        if (isCompleted) {
          return <CheckCircle {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-green-600" />;
        } else if (isUnlocked) {
          return <Sparkles {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />;
        } else {
          return <Lock {...iconProps} className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />;
        }
    }
  };

  const getNodeGradient = (node: RoadmapNode): string => {
    const isCompleted = completedNodes.has(node.id);
    const isUnlocked = isCompleted || node.status === 'current';

    if (isCompleted) {
      return "from-green-100 to-green-200 border-green-300 text-green-900";
    } else if (isUnlocked) {
      return "from-blue-100 to-purple-100 border-blue-300 text-blue-900";
    } else {
      return "from-gray-100 to-gray-200 border-gray-300 text-gray-600";
    }
  };

  const toggleNodeCompletion = (nodeId: string): void => {
    const newCompleted = new Set(completedNodes);
    if (completedNodes.has(nodeId)) {
      newCompleted.delete(nodeId);
    } else {
      newCompleted.add(nodeId);
    }
    setCompletedNodes(newCompleted);
  };

  const handleNodeClick = (node: RoadmapNode): void => {
    setSelectedNode(node);
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />

      {/* Full Page Roadmap */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 overflow-y-auto">
        
        {/* Enhanced Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-6 flex-1 min-w-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
                  <Route className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg md:text-4xl font-medium text-gray-900 leading-tight truncate" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {roadmap?.title || 'Your Career Roadmap'}
                  </h1>
                  <p className="text-sm md:text-lg text-gray-600 mt-1 line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {roadmap?.description || 'Your personalized learning journey'}
                  </p>
                </div>
              </div>
              
              {/* Progress Ring */}
              <div className="relative w-12 h-12 md:w-20 md:h-20 ml-4">
                <svg className="w-12 h-12 md:w-20 md:h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="100, 100"
                    className="text-gray-200"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${progress}, 100`}
                    className="text-blue-600 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm md:text-2xl font-semibold text-blue-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <M3Button
                variant="outlined"
                onClick={onClose}
                icon={<X className="w-5 h-5" />}
                className="ml-4 w-12 h-12 p-0"
              >
                <span className="sr-only">Close</span>
              </M3Button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="sticky top-[80px] md:top-[100px] bg-white/90 backdrop-blur-sm border-b border-gray-100 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <div className="flex justify-center">
              <div className="bg-gray-100 p-1 rounded-2xl inline-flex">
                {[
                  { key: 'roadmap', label: 'Roadmap View', icon: <Route className="w-4 h-4" /> },
                  { key: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
                  { key: 'progress', label: 'Progress', icon: <Activity className="w-4 h-4" /> }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setViewMode(key as 'roadmap' | 'timeline' | 'progress')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      viewMode === key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {icon}
                    <span className="hidden md:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              
              {/* Duration */}
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Duration
                    </p>
                    <p className="text-sm md:text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {user_profile?.estimated_duration || '12-18 months'}
                    </p>
                  </div>
                </div>
              </M3Card>

              {/* Experience Level */}
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-green-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Level
                    </p>
                    <p className="text-sm md:text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {user_profile?.experience_level || 'Fresher'}
                    </p>
                  </div>
                </div>
              </M3Card>

              {/* Career Goal */}
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Target className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Goal
                    </p>
                    <p className="text-xs md:text-lg font-semibold text-gray-900 line-clamp-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {user_profile?.career_goal || 'Career Growth'}
                    </p>
                  </div>
                </div>
              </M3Card>

              {/* Total Steps */}
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Route className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Steps
                    </p>
                    <p className="text-sm md:text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {roadmap?.nodes?.length || 0}
                    </p>
                  </div>
                </div>
              </M3Card>

            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          
          {viewMode === 'roadmap' && (
            /* Roadmap Grid View */
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
              <div className="grid gap-6 md:gap-8">
                {roadmap?.nodes?.map((node, index) => (
                  <M3Card
                    key={node.id}
                    variant="elevated"
                    className={`transition-all duration-300 transform bg-gradient-to-br ${getNodeGradient(node)} border-2 ${
                      hoveredNode === node.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                    } ${
                      selectedNode?.id === node.id ? 'ring-4 ring-blue-500/30' : ''
                    } group relative overflow-hidden`}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm md:text-lg" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Connection Line */}
                    {index < (roadmap?.nodes?.length || 0) - 1 && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-blue-300 to-transparent" />
                    )}

                    <div className="p-4 md:p-8">
                      
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                          
                          {/* Icon */}
                          <div className="w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center">
                            {getNodeIcon(node)}
                          </div>

                          {/* Node Status Badges */}
                          <div className="flex items-center space-x-2">
                            {node.type === 'required' && (
                              <M3Chip variant="filled" className="bg-red-100 text-red-800">
                                Required
                              </M3Chip>
                            )}
                            {node.type === 'milestone' && (
                              <M3Chip variant="filled" className="bg-purple-100 text-purple-800">
                                Milestone
                              </M3Chip>
                            )}
                          </div>
                        </div>
                        
                        {/* Completion Toggle & Details */}
                        <div className="flex items-center space-x-2">
                          {node.type !== 'start' && node.type !== 'success' && (
                            <M3Button
                              variant="fab"
                              size="sm"
                              onClick={(e) => {
                                e?.stopPropagation();
                                toggleNodeCompletion(node.id);
                              }}
                              className="w-8 h-8 md:w-12 md:h-12 shadow-lg"
                            >
                              {completedNodes.has(node.id) ? (
                                <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
                              ) : (
                                <Circle className="w-4 h-4 md:w-6 md:h-6" />
                              )}
                            </M3Button>
                          )}
                          <div className="text-blue-600">
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div>
                        <h3 className="font-semibold text-lg md:text-2xl text-gray-900 mb-2 md:mb-3 line-clamp-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          {node.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-3 mb-3 md:mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {node.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {node.duration && (
                            <M3Chip variant="elevated" icon={<Clock className="w-3 h-3 md:w-4 md:h-4" />}>
                              {node.duration}
                            </M3Chip>
                          )}
                          {node.skills && node.skills.length > 0 && (
                            <M3Chip variant="outlined">
                              {node.skills.length} Skills
                            </M3Chip>
                          )}
                          {node.resources && node.resources.length > 0 && (
                            <M3Chip variant="outlined">
                              {node.resources.length} Resources
                            </M3Chip>
                          )}
                        </div>
                        
                        <div className="flex items-center text-blue-600">
                          <span className="text-xs md:text-sm font-medium" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            {selectedNode?.id === node.id ? 'Selected' : 'Explore'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </M3Card>
                ))}
              </div>
            </div>
          )}

          {/* Timeline and Progress views remain the same but with similar fixes... */}
          {viewMode === 'progress' && (
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
              <M3Card variant="filled" className="p-6 md:p-8 mb-8">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Your Learning Progress
                  </h2>
                  <div className="flex items-center justify-center space-x-8 mb-6">
                    <div className="text-center">
                      <div className="text-3xl md:text-5xl font-bold text-green-600">{completedNodes.size}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-5xl font-bold text-blue-600">{(roadmap?.nodes?.length || 0) - completedNodes.size}</div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-5xl font-bold text-purple-600">{progress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    You're making great progress! Keep going to reach your career goals.
                  </p>
                </div>
              </M3Card>
            </div>
          )}

        </div>

        {/* Node Details Section */}
        {selectedNode && (
          <div ref={detailsRef} className="bg-gradient-to-r from-blue-50 to-purple-50 border-t-4 border-blue-600">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
              


              
              {/* Details Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
                    {getNodeIcon(selectedNode)}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {selectedNode.title}
                    </h2>
                    <p className="text-sm md:text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {selectedNode.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <M3Button
                    variant="outlined"
                    onClick={() => toggleNodeCompletion(selectedNode.id)}
                    className={completedNodes.has(selectedNode.id) ? 'bg-green-50 border-green-300 text-green-700' : ''}
                  >
                    {completedNodes.has(selectedNode.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </M3Button>
                  
                  <M3Button
                    variant="text"
                    onClick={() => setSelectedNode(null)}
                    icon={<X className="w-4 h-4" />}
                    size="sm"
                  >
                    <span className="hidden md:inline">Close</span>
                  </M3Button>
                </div>
              </div>

              {/* Skills, Resources, Projects sections with similar fixes... */}
              {selectedNode.skills && selectedNode.skills.length > 0 && (
                <M3Card variant="elevated" className="p-4 md:p-8 mb-8">
                  <h4 className="flex items-center text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                      <Star className="w-3 h-3 md:w-5 md:h-5 text-white" />
                    </div>
                    Skills You'll Master
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {selectedNode.skills.map((skill, index) => (
                      <M3Card key={index} variant="filled" className="p-3 md:p-4 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                          <span className="font-medium text-gray-900 text-sm md:text-lg" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            {skill}
                          </span>
                        </div>
                      </M3Card>
                    ))}
                  </div>
                </M3Card>
              )}
{/* Resources Section */}
{selectedNode.resources && selectedNode.resources.length > 0 && (
  <M3Card variant="elevated" className="p-4 md:p-8 mb-8">
    <h4 className="flex items-center text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6" style={{ fontFamily: 'Google Sans, sans-serif' }}>
      <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
        <BookOpen className="w-3 h-3 md:w-5 md:h-5 text-white" />
      </div>
      Learning Resources
    </h4>
    <div className="grid gap-3 md:gap-4">
      {selectedNode.resources.map((resource, index) => (
        <ResourceLink key={index} resource={resource} compact={false} />
      ))}
    </div>
  </M3Card>
)}

{/* Project Ideas Section */}
{selectedNode.project_ideas && selectedNode.project_ideas.length > 0 && (
  <M3Card variant="elevated" className="p-4 md:p-8 mb-8">
    <h4 className="flex items-center text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6" style={{ fontFamily: 'Google Sans, sans-serif' }}>
      <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
        <Lightbulb className="w-3 h-3 md:w-5 md:h-5 text-white" />
      </div>
      Project Ideas
    </h4>
    <div className="grid gap-3 md:gap-4">
      {selectedNode.project_ideas.map((project, index) => (
        <M3Card key={index} variant="filled" className="p-3 md:p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            <span className="font-medium text-gray-900 text-sm md:text-lg" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {project}
            </span>
          </div>
        </M3Card>
      ))}
    </div>
  </M3Card>
)}

{/* Next Steps Section */}
{selectedNode.next_steps && selectedNode.next_steps.length > 0 && (
  <M3Card variant="elevated" className="p-4 md:p-8 mb-8">
    <h4 className="flex items-center text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6" style={{ fontFamily: 'Google Sans, sans-serif' }}>
      <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
        <ArrowRight className="w-3 h-3 md:w-5 md:h-5 text-white" />
      </div>
      Next Steps
    </h4>
    <div className="grid gap-3 md:gap-4">
      {selectedNode.next_steps.map((step, index) => (
        <M3Card key={index} variant="filled" className="p-3 md:p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
            <span className="font-medium text-gray-900 text-sm md:text-lg" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              {step}
            </span>
          </div>
        </M3Card>
      ))}
    </div>
  </M3Card>
)}








            </div>
          </div>
        )}

        {/* Floating Progress Button */}
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
          <M3Button
            variant="fab"
            size="lg"
            className="w-16 h-16 md:w-20 md:h-20 shadow-2xl"
            onClick={() => setViewMode(viewMode === 'roadmap' ? 'progress' : 'roadmap')}
          >
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold">{Math.round((completedNodes.size / (roadmap?.nodes?.length || 1)) * 100)}%</div>
              <div className="text-xs opacity-90">Done</div>
            </div>
          </M3Button>
        </div>

      </div>
    </>
  );
};

export default AdvancedRoadmapVisualization;
