import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import CareerRoadmapModal from "./CareerRoadmapModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Palette, 
  BarChart3, 
  Shield, 
  Smartphone,
  Database,
  Brain,
  TrendingUp,
  Users,
  Clock,
  Star,
  ArrowRight,
  Target,
  Award,
  Map,
  Lock,
  Route
} from "lucide-react";

interface CareerPath {
  title: string;
  description: string;
  icon: string;
  match: number;
  salary: string;
  growth: string;
  demand: string;
  skills: string[];
  companies: string[];
  gradient: string;
}

// Authentication Guard Component
const AuthenticationRequired: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Google Fonts Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />
      <link 
        href="https://fonts.googleapis.com/icon?family=Material+Icons" 
        rel="stylesheet" 
      />

      <Header />
      
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center p-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/8 to-yellow-400/8 blur-3xl" />
        </div>

        {/* Authentication Required Card */}
        <Card className="w-full max-w-2xl border-0 rounded-3xl shadow-2xl bg-white relative z-10">
          <CardHeader className="text-center space-y-6 p-12">
            {/* Google-style career icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-3xl">psychology</span>
            </div>
            
            <div className="space-y-4">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Access Your Career Insights
              </CardTitle>
              <CardDescription 
                className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Sign in to discover personalized career paths and get AI-powered roadmaps tailored to your skills.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            {/* Career Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <span className="material-icons text-white text-lg">psychology</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    AI Career Matching
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Get personalized career recommendations based on your profile
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <span className="material-icons text-white text-lg">route</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    AI-Generated Roadmaps
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Detailed learning paths created by our ML algorithms
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                  <span className="material-icons text-white text-lg">trending_up</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Market Insights
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Real-time salary data and job market trends
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                  <span className="material-icons text-white text-lg">apartment</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Company Connections
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Discover top companies hiring for your dream role
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <span className="material-icons text-blue-600">preview</span>
                <h4 
                  className="font-semibold text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  What You'll Get Access To:
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Career Paths", icon: "route", color: "text-blue-600" },
                  { label: "Skill Analysis", icon: "psychology", color: "text-purple-600" },
                  { label: "Salary Data", icon: "payments", color: "text-green-600" },
                  { label: "Job Market", icon: "trending_up", color: "text-orange-600" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <span className={`material-icons text-2xl ${item.color} mb-2 block`}>
                      {item.icon}
                    </span>
                    <span 
                      className="text-sm text-gray-700 font-medium"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/sign-in')}
                className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-3">login</span>
                Sign In to Explore Careers
              </Button>

              <Button 
                onClick={() => navigate('/sign-up')}
                variant="outline"
                className="flex-1 h-14 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-2xl text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-3">person_add</span>
                Create Account
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p 
                className="text-sm text-gray-500"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Join thousands of professionals who found their dream career with our AI guidance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google-style Feature Notice */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="material-icons text-purple-500 text-sm">auto_awesome</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              Powered by advanced machine learning algorithms
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

const CareerPaths = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Google Material Icon mapping
  const iconMap = {
    Code: "code",
    Palette: "palette",
    BarChart3: "analytics",
    Shield: "security",
    Smartphone: "smartphone",
    Database: "storage",
    Brain: "psychology"
  };

  // Google color gradients for career paths
  const gradientMap = {
    Code: "from-blue-500 to-blue-600",
    Palette: "from-purple-500 to-pink-500",
    BarChart3: "from-green-500 to-emerald-500",
    Shield: "from-red-500 to-red-600",
    Smartphone: "from-indigo-500 to-blue-500",
    Database: "from-yellow-500 to-orange-500",
    Brain: "from-violet-500 to-purple-600"
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCareerPaths();
    }
  }, [isAuthenticated]);

  const fetchCareerPaths = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/career-paths');
      const data = await response.json();
      setCareerPaths(data.career_paths || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching career paths:', error);
      setLoading(false);
    }
  };

const generateRoadmap = async (career: CareerPath) => {
  setLoadingRoadmap(true);
  setSelectedCareer(career);
  
  try {
    const userEmail = user?.email || 'default@example.com';
    
    const response = await fetch(`http://localhost:8000/api/career-recommendations/roadmap/${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Full API Response:', data); // Keep this for debugging
    
    // Extract the roadmap data from the API response
    const apiRoadmap = data.roadmap;
    
    // Transform to match your component's expected structure
    const transformedData = {
      user_profile: apiRoadmap.user_profile,
      career_outlook: {
        summary: apiRoadmap.career_outlook.summary,
        average_salary_entry_level: "₹5-15 LPA", // Default since not in API
        difficulty_level: "Beginner to Intermediate", // Default since not in API
        key_industries: ["Business", "Consulting", "Operations", "Analytics"] // Default since not in API
      },
      roadmap: {
        title: `${apiRoadmap.user_profile.career_goal} Learning Path`,
        description: "Your personalized learning journey based on AI recommendations",
        nodes: apiRoadmap.roadmap.nodes.map((node, index) => ({
          id: node.id,
          title: node.label,
          type: node.type,
          status: index === 0 ? 'current' : 'locked',
          description: node.data?.description || `Learn and master ${node.label}`,
          duration: "2-4 weeks",
          position: node.position,
          connections: index < apiRoadmap.roadmap.nodes.length - 1 ? [apiRoadmap.roadmap.nodes[index + 1].id] : [],
          skills: node.data?.skills || [],
          resources: (node.data?.resources || []).map(resource => ({
            name: resource.name,
            url: resource.url,
            type: "Course" // Default type since your API doesn't provide it
          })),
          project_ideas: node.data?.project_ideas || [],
          next_steps: node.data?.next_steps || []
        }))
      }
    };
    
    console.log('Transformed Data:', transformedData); // Debug the transformation
    setRoadmapData(transformedData);
    setShowRoadmap(true);
    setLoadingRoadmap(false);
  } catch (error) {
    console.error('Error generating roadmap:', error);
    setLoadingRoadmap(false);
  }
};

  const getMatchColor = (match: number) => {
    if (match >= 85) return "text-green-600";
    if (match >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchBadgeColor = (match: number) => {
    if (match >= 85) return "bg-green-100 text-green-700 border-green-200";
    if (match >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-white">
          <div className="text-center">
            <div className="google-loading-spinner mb-4"></div>
            <p 
              className="text-gray-600"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Loading career paths...
            </p>
          </div>
        </div>
        
        <style>{`
          .google-loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e0e0e0;
            border-top: 3px solid #4285f4;
            border-radius: 50%;
            animation: google-spin 1s linear infinite;
            margin: 0 auto;
          }

          @keyframes google-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  // Show authentication required screen if user is not authenticated
  if (!isAuthenticated) {
    return <AuthenticationRequired />;
  }

  // Show career paths loading state
  if (loading) {
    return (
      <>
        {/* Google Fonts Import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet" 
        />
        
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.15s' }}></div>
            </div>
            <div>
              <h3 
                className="text-xl font-medium text-gray-900 mb-2"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Analyzing Career Paths for {user?.firstName || 'You'}
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Our AI is finding the perfect matches for your profile...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show career paths if user is authenticated
  return (
    <>
      {/* Google Fonts Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />
      <link 
        href="https://fonts.googleapis.com/icon?family=Material+Icons" 
        rel="stylesheet" 
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
        <Header />
        
        <main className="pt-8">
          {/* Google Material Hero Section with personalized welcome */}
          <section className="py-20 lg:py-28 relative overflow-hidden">
            {/* Google-style Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
              <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/8 to-yellow-400/8 blur-3xl" />
              
              {/* Google-style geometric pattern */}
              <div className="absolute top-20 right-1/3 opacity-5">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i % 4 === 0 ? 'bg-blue-500' :
                        i % 4 === 1 ? 'bg-green-500' :
                        i % 4 === 2 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="container px-6 lg:px-8 relative z-10">
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                {/* Google-style Badge with personalization */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full text-sm font-medium text-blue-700 shadow-sm">
                  <span className="material-icons text-base">psychology</span>
                  <span style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'User'}! AI-Powered Career Matching
                  </span>
                </div>

                <h1 
                  className="text-5xl lg:text-7xl font-normal text-gray-900 leading-tight"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Discover Your Perfect
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium mt-2">
                    Career Path
                  </span>
                </h1>

                <p 
                  className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Our AI analyzes your skills, interests, and market trends to recommend 
                  the most suitable career paths with <span className="font-medium text-blue-600">growth potential</span>.
                </p>
              </div>
            </div>
          </section>

          {/* Google Material Career Paths Grid */}
          <section className="py-20 bg-white relative">
            <div className="container px-6 lg:px-8">
              <div className="text-center space-y-6 mb-16">
                <h2 
                  className="text-4xl lg:text-5xl font-normal text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Recommended Career Paths
                </h2>
                <p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Click <span className="font-medium text-blue-600">"Get AI Roadmap"</span> to see a detailed learning plan 
                  generated by our machine learning model.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {careerPaths.map((career, index) => (
                  <Card 
                    key={index} 
                    className="group border-0 rounded-3xl shadow-lg bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <CardHeader className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        {/* Google Material Icon Container */}
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientMap[career.icon] || gradientMap.Code} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                          <span 
                            className="material-icons text-2xl text-white"
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                          >
                            {iconMap[career.icon] || "code"}
                          </span>
                          
                          {/* Google-style glow effect */}
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientMap[career.icon] || gradientMap.Code} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
                        </div>
                        
                        {/* Match Score with Google styling */}
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getMatchColor(career.match)} mb-1`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            {career.match}%
                          </div>
                          <Badge className={`${getMatchBadgeColor(career.match)} text-xs font-medium rounded-full px-3 py-1 border`}>
                            Match Score
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <CardTitle 
                          className="text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          {career.title}
                        </CardTitle>
                        <CardDescription 
                          className="text-gray-600 text-base leading-relaxed"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {career.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="p-8 pt-0 space-y-8">
                      {/* Google Material Progress Bar */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span 
                            className="font-medium text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            Career Match
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getMatchColor(career.match)}`}>
                              {career.match}%
                            </span>
                            {career.match >= 85 && (
                              <span className="material-icons text-green-500 text-lg">trending_up</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Custom Google-style progress bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`bg-gradient-to-r ${gradientMap[career.icon] || gradientMap.Code} h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
                              style={{ width: `${career.match}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Google Material Key Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "Salary Range", value: career.salary, icon: "payments", color: "text-green-600" },
                          { label: "Growth", value: career.growth, icon: "trending_up", color: "text-blue-600" },
                          { label: "Demand", value: career.demand, icon: "public", color: "text-purple-600" }
                        ].map((metric, metricIndex) => (
                          <div key={metricIndex} className="text-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center justify-center mb-2">
                              <span className={`material-icons text-lg ${metric.color}`}>
                                {metric.icon}
                              </span>
                            </div>
                            <div 
                              className="text-sm font-semibold text-gray-900 mb-1"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              {metric.value}
                            </div>
                            <div 
                              className="text-xs text-gray-600"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Skills Required with Google Material styling */}
                      <div className="space-y-4">
                        <h4 
                          className="text-lg font-medium flex items-center text-gray-900"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          <span className="material-icons mr-2 text-blue-600">psychology</span>
                          Key Skills Required
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex} 
                              variant="secondary" 
                              className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-medium hover:bg-blue-100 transition-colors duration-200"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Top Companies with Google Material styling */}
                      <div className="space-y-4">
                        <h4 
                          className="text-lg font-medium flex items-center text-gray-900"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          <span className="material-icons mr-2 text-green-600">apartment</span>
                          Top Hiring Companies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {career.companies.slice(0, 3).map((company, companyIndex) => (
                            <Badge 
                              key={companyIndex} 
                              variant="outline" 
                              className="bg-white border-gray-300 text-gray-700 rounded-full px-3 py-1 text-xs font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                              {company}
                            </Badge>
                          ))}
                          {career.companies.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="bg-gray-50 border-gray-300 text-gray-500 rounded-full px-3 py-1 text-xs font-medium"
                            >
                              +{career.companies.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Google Material Action Buttons */}
                      <div className="flex space-x-4 pt-6">
                        <Button 
                          className={`flex-1 h-12 bg-gradient-to-r ${gradientMap[career.icon] || gradientMap.Code} hover:shadow-lg text-white rounded-full shadow-md transition-all duration-300 group`}
                          onClick={() => generateRoadmap(career)}
                          disabled={loadingRoadmap}
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          {loadingRoadmap && selectedCareer?.title === career.title ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                              Generating for {user?.firstName || 'You'}...
                            </>
                          ) : (
                            <>
                              <span className="material-icons mr-3">route</span>
                              Get AI Roadmap
                              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2 border-gray-300 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600 transition-all duration-300"
                        >
                          <span className="material-icons">star_border</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Career Roadmap Modal */}
        {showRoadmap && roadmapData && (
          <CareerRoadmapModal 
            isOpen={showRoadmap}
            onClose={() => setShowRoadmap(false)}
            roadmapData={roadmapData}
            careerTitle={selectedCareer?.title || ""}
          />
        )}
      </div>
    </>
  );
};

export default CareerPaths;
