import React, { useState, useRef } from 'react';
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
  Code
} from 'lucide-react';

<<<<<<< HEAD
//import Chatbot from "../components/Chatbot";
=======

>>>>>>> a1767ff40ded6464b38930278a580011360e941d

// Material 3 Components with enhanced responsiveness
const M3Card: React.FC<{ 
  className?: string; 
  children: React.ReactNode; 
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  variant?: 'elevated' | 'filled' | 'outlined';
}> = ({ className, children, onClick, onMouseEnter, onMouseLeave, variant = 'elevated' }) => {
  const variants = {
    elevated: 'bg-white shadow-lg hover:shadow-xl border-0',
    filled: 'bg-gradient-to-br from-blue-50 to-purple-50 shadow-md border-0',
    outlined: 'bg-white border-2 border-outline shadow-sm hover:shadow-md'
  };
  
  return (
    
    <div 
      className={`rounded-2xl md:rounded-3xl transition-all duration-300 ${variants[variant]} ${className}`} 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

const M3Button: React.FC<{
  variant?: 'filled' | 'outlined' | 'text' | 'fab';
  size?: 'sm' | 'default' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}> = ({ variant = 'filled', size = 'default', onClick, children, className, icon }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-95";
  
  const variants = {
    filled: 'bg-gradient-to-r from-primary to-primary-dark text-on-primary shadow-lg hover:shadow-xl',
    outlined: 'border-2 border-primary text-primary hover:bg-primary/8 bg-surface',
    text: 'text-primary hover:bg-primary/8',
    fab: 'bg-gradient-to-r from-primary to-secondary text-on-primary shadow-xl hover:shadow-2xl rounded-full'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm h-8 md:h-10 rounded-xl md:rounded-2xl',
    default: 'px-4 py-3 text-sm md:text-base h-10 md:h-12 rounded-2xl md:rounded-3xl',
    lg: 'px-6 py-4 text-base md:text-lg h-12 md:h-14 rounded-2xl md:rounded-3xl'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ fontFamily: 'Google Sans, sans-serif' }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const M3Chip: React.FC<{
  variant?: 'filled' | 'outlined' | 'elevated';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}> = ({ variant = 'filled', children, className, icon }) => {
  const variants = {
    filled: 'bg-secondary-container text-on-secondary-container',
    outlined: 'border border-outline text-on-surface bg-surface',
    elevated: 'bg-surface-variant text-on-surface-variant shadow-md'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 hover:scale-105 ${variants[variant]} ${className}`}
          style={{ fontFamily: 'Google Sans, sans-serif' }}>
      {icon && <span className="mr-1 md:mr-2">{icon}</span>}
      {children}
    </span>
  );
};

// Interfaces
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
  position: { x: number; y: number };
  connections: string[];
  skills?: string[];
  resources?: Resource[];
  project_ideas?: string[];
  next_steps?: string[];
}

interface RoadmapData {
  user_profile: {
    name: string;
    career_goal: string;
    experience_level: string;
    estimated_duration: string;
  };
  career_outlook: {
    summary: string;
    average_salary_entry_level: string;
    difficulty_level: string;
    key_industries: string[];
  };
  roadmap: {
    title: string;
    description: string;
    nodes: RoadmapNode[];
  };
}

interface RoadmapVisualizationProps {
  roadmapData: RoadmapData;
}

const ResponsiveRoadmapWithDetails: React.FC<RoadmapVisualizationProps> = ({ roadmapData }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set(['start']));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const updatedNodes = roadmapData.roadmap.nodes;

  const getNodeIcon = (node: RoadmapNode) => {
    const isCompleted = completedNodes.has(node.id);
    const isUnlocked = isCompleted || node.status === 'current';
    
    const iconProps = { className: "w-5 h-5 md:w-7 md:h-7" };
    
    switch (node.type) {
      case 'start':
        return <Rocket {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-success" />;
      case 'success':
        return <Trophy {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-tertiary" />;
      case 'milestone':
        return <Award {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-secondary" />;
      case 'choice':
        return <Brain {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-primary" />;
      default:
        if (isCompleted) {
          return <CheckCircle {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-success" />;
        } else if (isUnlocked) {
          return <Sparkles {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-primary" />;
        } else {
          return <Lock {...iconProps} className="w-5 h-5 md:w-7 md:h-7 text-outline" />;
        }
    }
  };

  const getNodeGradient = (node: RoadmapNode) => {
    const isCompleted = completedNodes.has(node.id);
    const isUnlocked = isCompleted || node.status === 'current';
    
    if (isCompleted) {
      return "from-success-container to-success border-success";
    } else if (isUnlocked) {
      return "from-primary-container to-secondary-container border-primary";
    } else {
      return "from-surface-variant to-surface border-outline";
    }
  };

  const toggleNodeCompletion = (nodeId: string) => {
    const newCompleted = new Set(completedNodes);
    if (completedNodes.has(nodeId)) {
      newCompleted.delete(nodeId);
    } else {
      newCompleted.add(nodeId);
    }
    setCompletedNodes(newCompleted);
  };

  // Handle phase selection and scroll to details
  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
    
    // Smooth scroll to details section
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const { user_profile, career_outlook, roadmap } = roadmapData;
console.log(roadmapData);
  return (
    <>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />

      {/* Material 3 Color System + Responsive Styles */}
      <style>{`
        html { scroll-behavior: smooth; }
        :root {
          --md-sys-color-primary: #1976d2;
          --md-sys-color-primary-dark: #1565c0;
          --md-sys-color-primary-container: #e3f2fd;
          --md-sys-color-on-primary: #ffffff;
          --md-sys-color-on-primary-container: #0d47a1;
          --md-sys-color-secondary: #9c27b0;
          --md-sys-color-secondary-container: #f3e5f5;
          --md-sys-color-on-secondary-container: #4a148c;
          --md-sys-color-tertiary: #ff9800;
          --md-sys-color-success: #4caf50;
          --md-sys-color-success-container: #e8f5e8;
          --md-sys-color-surface: #ffffff;
          --md-sys-color-surface-variant: #f5f5f5;
          --md-sys-color-on-surface: #1c1b1f;
          --md-sys-color-on-surface-variant: #49454f;
          --md-sys-color-outline: #79747e;
        }
        
        .text-primary { color: var(--md-sys-color-primary); }
        .text-secondary { color: var(--md-sys-color-secondary); }
        .text-tertiary { color: var(--md-sys-color-tertiary); }
        .text-success { color: var(--md-sys-color-success); }
        .text-on-primary { color: var(--md-sys-color-on-primary); }
        .text-on-surface { color: var(--md-sys-color-on-surface); }
        .text-outline { color: var(--md-sys-color-outline); }
        
        .bg-primary { background-color: var(--md-sys-color-primary); }
        .bg-primary-container { background-color: var(--md-sys-color-primary-container); }
        .bg-secondary-container { background-color: var(--md-sys-color-secondary-container); }
        .bg-success-container { background-color: var(--md-sys-color-success-container); }
        .bg-surface { background-color: var(--md-sys-color-surface); }
        .bg-surface-variant { background-color: var(--md-sys-color-surface-variant); }
        
        .border-primary { border-color: var(--md-sys-color-primary); }
        .border-success { border-color: var(--md-sys-color-success); }
        .border-outline { border-color: var(--md-sys-color-outline); }
        
        .from-primary { --tw-gradient-from: var(--md-sys-color-primary); }
        .to-secondary { --tw-gradient-to: var(--md-sys-color-secondary); }
        .from-primary-container { --tw-gradient-from: var(--md-sys-color-primary-container); }
        .to-secondary-container { --tw-gradient-to: var(--md-sys-color-secondary-container); }
        .from-success-container { --tw-gradient-from: var(--md-sys-color-success-container); }
        .to-success { --tw-gradient-to: var(--md-sys-color-success); }
        .from-surface-variant { --tw-gradient-from: var(--md-sys-color-surface-variant); }
        .to-surface { --tw-gradient-to: var(--md-sys-color-surface); }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .animate-pulse { animation: none; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        
        {/* Mobile-friendly Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 md:top-20 left-10 md:left-20 w-48 md:w-96 h-48 md:h-96 rounded-full bg-gradient-to-br from-primary/5 md:from-primary/10 to-secondary/5 md:to-secondary/10 blur-2xl md:blur-3xl animate-pulse" />
          <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-48 md:w-96 h-48 md:h-96 rounded-full bg-gradient-to-br from-tertiary/4 md:from-tertiary/8 to-success/4 md:to-success/8 blur-2xl md:blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Responsive Header */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-outline/20 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-6 flex-1 min-w-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
                  <Code className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 
                    className="text-lg md:text-4xl font-medium text-on-surface leading-tight truncate"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {roadmap.title}
                  </h1>
                  <p 
                    className="text-sm md:text-lg text-on-surface-variant mt-1 line-clamp-2"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {roadmap.description}
                  </p>
                </div>
              </div>
              
              {/* Compact Progress Ring for Mobile */}
              <div className="relative w-12 h-12 md:w-20 md:h-20 ml-4">
                <svg className="w-12 h-12 md:w-20 md:h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="100, 100"
                    className="text-outline/20"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${(completedNodes.size / roadmap.nodes.length) * 100}, 100`}
                    className="text-primary transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm md:text-2xl font-semibold text-primary" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {Math.round((completedNodes.size / roadmap.nodes.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Stats Cards */}
        <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-outline/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-on-surface-variant" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Duration
                    </p>
                    <p className="text-sm md:text-2xl font-semibold text-on-surface" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {user_profile.estimated_duration}
                    </p>
                  </div>
                </div>
              </M3Card>
              
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-success rounded-xl md:rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-on-surface-variant" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Level
                    </p>
                    <p className="text-sm md:text-2xl font-semibold text-on-surface" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {career_outlook.difficulty_level}
                    </p>
                  </div>
                </div>
              </M3Card>
              
              <M3Card variant="filled" className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-tertiary rounded-xl md:rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm text-on-surface-variant" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Salary
                    </p>
                    <p className="text-xs md:text-2xl font-semibold text-on-surface" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {career_outlook.average_salary_entry_level}
                    </p>
                  </div>
                </div>
              </M3Card>
            </div>
          </div>
        </div>

        {/* Main Roadmap Content - Responsive Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {updatedNodes.map((node, index) => (
              <M3Card 
                key={node.id}
                variant="elevated"
                className={`
                  cursor-pointer transition-all duration-300 transform
                  bg-gradient-to-br ${getNodeGradient(node)} border-2
                  ${hoveredNode === node.id ? 'scale-105 shadow-2xl' : 'hover:scale-[1.02]'}
                  ${selectedNode?.id === node.id ? 'ring-4 ring-primary/30' : ''}
                  group relative overflow-hidden
                `}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Floating Step Number */}
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-primary to-secondary rounded-full shadow-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-lg" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    {index + 1}
                  </span>
                </div>

                <div className="p-4 md:p-8">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center">
                        {getNodeIcon(node)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {node.type !== 'start' && node.type !== 'success' && (
                        <M3Button
                          variant="fab"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNodeCompletion(node.id);
                          }}
                          className="w-8 h-8 md:w-12 md:h-12 shadow-lg"
                        >
                          {completedNodes.has(node.id) ? 
                            <CheckCircle className="w-4 h-4 md:w-6 md:h-6" /> : 
                            <Circle className="w-4 h-4 md:w-6 md:h-6" />
                          }
                        </M3Button>
                      )}
                      <div className="text-primary">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div>
                    <h3 
                      className="font-semibold text-lg md:text-2xl text-on-surface mb-2 md:mb-3 line-clamp-2"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      {node.title}
                    </h3>
                    <p 
                      className="text-sm md:text-base text-on-surface-variant leading-relaxed line-clamp-3 mb-3 md:mb-4"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {node.description}
                    </p>
                    
                    {/* Card Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {node.duration && (
                          <M3Chip variant="elevated" icon={<Clock className="w-3 h-3 md:w-4 md:h-4" />}>
                            {node.duration}
                          </M3Chip>
                        )}
                        {node.type === 'required' && (
                          <M3Chip variant="filled" className="bg-red-100 text-red-800">
                            Required
                          </M3Chip>
                        )}
                      </div>
                      <div className="flex items-center text-primary">
                        <span className="text-xs md:text-sm font-medium" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          {selectedNode?.id === node.id ? 'Selected' : 'Explore'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </M3Card>
            ))}
          </div>
        </div>

        {/* Details Section Below Roadmap */}
        {selectedNode && (
          <div 
            ref={detailsRef}
            className="relative z-10 bg-gradient-to-r from-primary/5 to-secondary/5 border-t-4 border-primary animate-slideUp"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
              
              {/* Details Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
                    {getNodeIcon(selectedNode)}
                  </div>
                  <div>
                    <h2 
                      className="text-2xl md:text-4xl font-semibold text-primary mb-2"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      {selectedNode.title}
                    </h2>
                    <p 
                      className="text-sm md:text-lg text-on-surface-variant leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {selectedNode.description}
                    </p>
                  </div>
                </div>
                <M3Button 
                  variant="outlined" 
                  onClick={() => setSelectedNode(null)}
                  icon={<X className="w-4 h-4" />}
                  size="sm"
                  className="shrink-0"
                >
                  <span className="hidden md:inline">Close</span>
                </M3Button>
              </div>

              {/* Details Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                
                {selectedNode.skills && (
                  <M3Card variant="elevated" className="p-4 md:p-8">
                    <h4 
                      className="flex items-center text-xl md:text-2xl font-semibold text-on-surface mb-4 md:mb-6"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-tertiary rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <Star className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      Skills You'll Master
                    </h4>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      {selectedNode.skills.map((skill, index) => (
                        <M3Card key={index} variant="filled" className="p-3 md:p-4 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-primary to-secondary rounded-full" />
                            <span 
                              className="font-medium text-on-surface text-sm md:text-lg"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              {skill}
                            </span>
                          </div>
                        </M3Card>
                      ))}
                    </div>
                  </M3Card>
                )}

                {selectedNode.resources && (
                  <M3Card variant="elevated" className="p-4 md:p-8">
                    <h4 
                      className="flex items-center text-xl md:text-2xl font-semibold text-on-surface mb-4 md:mb-6"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-success rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <BookOpen className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      Learning Resources
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      {selectedNode.resources.map((resource, index) => (
                        <M3Card key={index} variant="outlined" className="p-4 md:p-6 hover:shadow-xl transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                            <div className="flex-1">
                              <h5 
                                className="font-semibold text-lg md:text-xl text-on-surface mb-2"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                {resource.name}
                              </h5>
                              <M3Chip variant="outlined">{resource.type}</M3Chip>
                            </div>
                            <M3Button 
                              variant="filled" 
                              size="sm" 
                              onClick={() => window.open(resource.url, '_blank')}
                              icon={<ExternalLink className="w-4 h-4" />}
                              className="w-full md:w-auto md:ml-6"
                            >
                              Open Resource
                            </M3Button>
                          </div>
                        </M3Card>
                      ))}
                    </div>
                  </M3Card>
                )}

                {selectedNode.project_ideas && (
                  <M3Card variant="elevated" className="p-4 md:p-8">
                    <h4 
                      className="flex items-center text-xl md:text-2xl font-semibold text-on-surface mb-4 md:mb-6"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-secondary rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <Lightbulb className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      Project Ideas
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      {selectedNode.project_ideas.map((project, index) => (
                        <M3Card key={index} variant="filled" className="p-4 md:p-6">
                          <div className="flex items-start space-x-3 md:space-x-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-secondary to-tertiary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              <span className="text-xs md:text-sm">{index + 1}</span>
                            </div>
                            <p 
                              className="text-on-surface text-sm md:text-lg leading-relaxed"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {project}
                            </p>
                          </div>
                        </M3Card>
                      ))}
                    </div>
                  </M3Card>
                )}

                {selectedNode.next_steps && (
                  <M3Card variant="elevated" className="p-4 md:p-8">
                    <h4 
                      className="flex items-center text-xl md:text-2xl font-semibold text-on-surface mb-4 md:mb-6"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <TrendingUp className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      What's Next?
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      {selectedNode.next_steps.map((step, index) => (
                        <M3Card key={index} variant="outlined" className="p-4 md:p-6">
                          <div className="flex items-start space-x-3 md:space-x-4">
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-0.5 md:mt-1" />
                            <p 
                              className="text-on-surface text-sm md:text-lg leading-relaxed"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {step}
                            </p>
                          </div>
                        </M3Card>
                      ))}
                    </div>
                  </M3Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile-Optimized FAB Progress */}
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
          <M3Button variant="fab" size="lg" className="w-16 h-16 md:w-20 md:h-20 shadow-2xl">
            <div className="text-center">
              <div className="text-lg md:text-2xl font-bold">{Math.round((completedNodes.size / roadmap.nodes.length) * 100)}%</div>
              <div className="text-xs opacity-90">Done</div>
            </div>
          </M3Button>
        </div>
      </div>
   
    </>
  );
};

export default ResponsiveRoadmapWithDetails;
