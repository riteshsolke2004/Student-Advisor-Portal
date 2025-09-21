import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Wand2,
  Download,
  Eye,
  Share,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Plus,
  Edit3,
  Copy,
  Star,
  Lock
} from "lucide-react";
import ResumeAnalysis from "@/components/ResumeAnalysisComponent";

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
            {/* Google-style resume icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-3xl">description</span>
            </div>
            
            <div className="space-y-4">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Build Your Professional Resume
              </CardTitle>
              <CardDescription 
                className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Sign in to create ATS-optimized resumes with AI-powered suggestions and professional templates.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            {/* Resume Builder Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <span className="material-icons text-white text-lg">auto_awesome</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    AI-Powered Content
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Smart suggestions to improve resume content and impact
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <span className="material-icons text-white text-lg">gps_fixed</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    ATS Optimization
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Ensure your resume passes applicant tracking systems
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                  <span className="material-icons text-white text-lg">palette</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Professional Templates
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Choose from industry-specific resume designs
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                  <span className="material-icons text-white text-lg">analytics</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Performance Analytics
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Track resume performance and keyword optimization
                  </p>
                </div>
              </div>
            </div>

            {/* Template Preview */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <span className="material-icons text-orange-600">preview</span>
                <h4 
                  className="font-semibold text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  What You'll Create:
                </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Professional Templates", icon: "description", color: "text-blue-600" },
                  { label: "ATS-Optimized", icon: "gps_fixed", color: "text-green-600" },
                  { label: "AI Suggestions", icon: "auto_awesome", color: "text-purple-600" },
                  { label: "Export Options", icon: "download", color: "text-orange-600" }
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

            {/* Resume Success Stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-green-600">trending_up</span>
                  <h4 
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Success Stories
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="material-icons text-yellow-500 text-lg">stars</span>
                  <span 
                    className="text-sm font-bold text-green-600"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    4.8/5 Rating
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { stat: "10K+", label: "Resumes Created" },
                  { stat: "87%", label: "Interview Success" },
                  { stat: "2x", label: "Faster Hiring" }
                ].map((item, index) => (
                  <div key={index}>
                    <div 
                      className="text-2xl font-bold text-green-600 mb-1"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      {item.stat}
                    </div>
                    <div 
                      className="text-sm text-gray-600"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/sign-in')}
                className="flex-1 h-14 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-3">login</span>
                Sign In to Build Resume
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
                Join thousands of job seekers who landed their dream jobs with our AI-powered resumes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google-style Feature Notice */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="material-icons text-orange-500 text-sm">auto_awesome</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              AI-powered resume optimization for maximum impact
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

const ResumeBuilder = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const aiSuggestions = [
    {
      section: "Professional Summary",
      suggestion: "Add quantifiable achievements to make your summary more impactful",
      impact: "High",
      example: "Increased team productivity by 35% through process optimization",
      icon: "psychology"
    },
    {
      section: "Skills Section",
      suggestion: "Include trending technologies relevant to your target role",
      impact: "Medium",
      example: "Add React, TypeScript, and AWS to match job requirements",
      icon: "code"
    },
    {
      section: "Work Experience",
      suggestion: "Use action verbs and include specific metrics for each role",
      impact: "High",
      example: "Led cross-functional team of 8 developers, delivering 12 features on time",
      icon: "work"
    },
    {
      section: "Education",
      suggestion: "Highlight relevant coursework and academic projects",
      impact: "Medium",
      example: "Include Machine Learning specialization and final year project details",
      icon: "school"
    }
  ];

  const resumeStats = {
    atsScore: 87,
    completeness: 78,
    keywordMatch: 92,
    readabilityScore: 89
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 70) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
              Loading resume builder...
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

  // Show resume builder if user is authenticated
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
                  <span className="material-icons text-base">auto_awesome</span>
                  <span style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'User'}! AI-Powered Resume Builder
                  </span>
                </div>

                <h1 
                  className="text-5xl lg:text-7xl font-normal text-gray-900 leading-tight"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Create Professional
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium mt-2">
                    ATS-Optimized Resumes
                  </span>
                </h1>

                <p 
                  className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Build stunning resumes with AI-powered content suggestions, 
                  ATS optimization, and professional templates tailored for the 
                  <span className="font-medium text-blue-600"> Indian job market</span>.
                </p>
              </div>
            </div>
          </section>

          {/* Resume Builder Interface */}
          <section className="py-20 bg-white">
            <div className="container px-6 lg:px-8">
              <Tabs defaultValue="builder" className="space-y-8">
                <div className="text-center">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-100 p-1 rounded-full">
                    <TabsTrigger 
                      value="builder"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-base">build</span>
                      Builder
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="analysis"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-base">analytics</span>
                      Analysis
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Builder Tab */}
                <TabsContent value="builder" className="space-y-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel - Resume Content */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Current Resume Stats */}
                      <Card className="border-0 rounded-3xl shadow-lg bg-white">
                        <CardHeader className="p-8">
                          <CardTitle 
                            className="flex items-center space-x-3 text-2xl font-medium text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                              <span className="material-icons text-white text-xl">gps_fixed</span>
                            </div>
                            <span>{user?.firstName || 'Your'} Resume Performance</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                              { label: "ATS Score", value: resumeStats.atsScore, icon: "radar" },
                              { label: "Complete", value: resumeStats.completeness, icon: "check_circle" },
                              { label: "Keywords", value: resumeStats.keywordMatch, icon: "key" },
                              { label: "Readability", value: resumeStats.readabilityScore, icon: "visibility" }
                            ].map((stat, index) => (
                              <div key={index} className="text-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex items-center justify-center mb-2">
                                  <span className={`material-icons text-lg ${getScoreColor(stat.value)}`}>
                                    {stat.icon}
                                  </span>
                                </div>
                                <div 
                                  className={`text-3xl font-bold mb-1 ${getScoreColor(stat.value)}`}
                                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                                >
                                  {stat.value}%
                                </div>
                                <div 
                                  className="text-sm text-gray-600"
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI Suggestions */}
                      <Card className="border-0 rounded-3xl shadow-lg bg-white">
                        <CardHeader className="p-8">
                          <CardTitle 
                            className="flex items-center space-x-3 text-2xl font-medium text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                              <span className="material-icons text-white text-xl">auto_awesome</span>
                            </div>
                            <span>AI Suggestions for {user?.firstName || 'You'}</span>
                          </CardTitle>
                          <CardDescription 
                            className="text-lg text-gray-600 mt-2"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            Personalized recommendations to improve your resume
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                          <div className="space-y-6">
                            {aiSuggestions.map((suggestion, index) => (
                              <div key={index} className="group flex items-start space-x-4 p-6 rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                                  suggestion.impact === 'High' ? 'from-red-500 to-red-600' :
                                  suggestion.impact === 'Medium' ? 'from-yellow-500 to-orange-500' :
                                  'from-green-500 to-green-600'
                                } shadow-md group-hover:shadow-lg transition-all duration-300`}>
                                  <span className="material-icons text-white">
                                    {suggestion.icon}
                                  </span>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center space-x-3">
                                    <h4 
                                      className="font-medium text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300"
                                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    >
                                      {suggestion.section}
                                    </h4>
                                    <Badge className={`rounded-full px-3 py-1 font-medium border ${getImpactColor(suggestion.impact)}`}>
                                      {suggestion.impact} Impact
                                    </Badge>
                                  </div>
                                  
                                  <p 
                                    className="text-gray-600 leading-relaxed"
                                    style={{ fontFamily: 'Roboto, sans-serif' }}
                                  >
                                    {suggestion.suggestion}
                                  </p>
                                  
                                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                                    <div className="flex items-start space-x-2">
                                      <span className="material-icons text-blue-600 text-lg">lightbulb</span>
                                      <span 
                                        className="text-blue-700 text-sm leading-relaxed"
                                        style={{ fontFamily: 'Roboto, sans-serif' }}
                                      >
                                        {suggestion.example}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <Button 
                                  size="sm" 
                                  className="h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                                >
                                  <span className="material-icons mr-2 text-sm">auto_fix_high</span>
                                  Apply AI Fix
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Resume Sections */}
                      <div className="space-y-4">
                        {[
                          { name: "Personal Information", status: "complete", icon: "person", color: "text-green-600" },
                          { name: "Professional Summary", status: "needs-work", icon: "psychology", color: "text-yellow-600" },
                          { name: "Work Experience", status: "complete", icon: "work", color: "text-green-600" },
                          { name: "Skills", status: "needs-work", icon: "code", color: "text-yellow-600" },
                          { name: "Education", status: "complete", icon: "school", color: "text-green-600" },
                          { name: "Projects", status: "missing", icon: "folder", color: "text-gray-500" },
                          { name: "Certifications", status: "missing", icon: "verified", color: "text-gray-500" }
                        ].map((section, index) => (
                          <Card key={index} className="border border-gray-200 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="flex items-center justify-between p-6">
                              <div className="flex items-center space-x-4">
                                <span className={`material-icons text-xl ${section.color}`}>
                                  {section.icon}
                                </span>
                                <div>
                                  <span 
                                    className="font-medium text-gray-900 text-lg"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                  >
                                    {section.name}
                                  </span>
                                  {section.status === 'needs-work' && (
                                    <Badge className="ml-3 bg-yellow-100 text-yellow-700 border-yellow-200 rounded-full px-3 py-1 text-xs font-medium">
                                      Needs Improvement
                                    </Badge>
                                  )}
                                  {section.status === 'missing' && (
                                    <Badge className="ml-3 bg-gray-100 text-gray-700 border-gray-200 rounded-full px-3 py-1 text-xs font-medium">
                                      Not Added
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                              >
                                <span className="material-icons">edit</span>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Right Panel - Resume Preview */}
                    <div className="space-y-6">
                      <Card className="sticky top-24 border-0 rounded-3xl shadow-lg bg-white">
                        <CardHeader className="p-8">
                          <CardTitle 
                            className="text-xl font-medium text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            {user?.firstName || 'Your'} Resume Preview
                          </CardTitle>
                          <CardDescription 
                            className="text-gray-600"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            Professional Classic Template
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-8 pt-0">
                          {/* Mock Resume Preview */}
                          <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                            <div className="text-center space-y-3">
                              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center">
                                <span className="material-icons text-blue-600 text-2xl">description</span>
                              </div>
                              <div>
                                <p 
                                  className="font-medium text-gray-700 text-lg"
                                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                                >
                                  Resume Preview
                                </p>
                                <p 
                                  className="text-sm text-gray-500 mt-1"
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  Real-time updates as you edit
                                </p>
                              </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-200/30" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-green-200/30" />
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <Button 
                              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              <span className="material-icons mr-3">download</span>
                              Download PDF
                            </Button>
                            <div className="grid grid-cols-2 gap-3">
                              <Button 
                                variant="outline" 
                                className="h-10 rounded-full border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                <span className="material-icons mr-2 text-base">visibility</span>
                                Preview
                              </Button>
                              <Button 
                                variant="outline" 
                                className="h-10 rounded-full border-2 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all duration-300"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                <span className="material-icons mr-2 text-base">share</span>
                                Share
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Analysis Tab */}
                <TabsContent value="analysis" className="space-y-8">
                  <div className="text-center space-y-6 mb-16">
                    <h2 
                      className="text-4xl lg:text-5xl font-normal text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      {user?.firstName || 'Your'} Resume Analysis & Optimization
                    </h2>
                    <p 
                      className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Get detailed insights and recommendations to make your resume stand out to 
                      <span className="font-medium text-blue-600"> recruiters and ATS systems</span>.
                    </p>
                  </div>

                  <ResumeAnalysis></ResumeAnalysis>

                  {/* Bottom CTA */}
                  <div className="text-center space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
                    <h3 
                      className="text-3xl font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Ready to Optimize Your Resume, {user?.firstName || 'User'}?
                    </h3>
                    <p 
                      className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Let our AI help you create a resume that gets noticed by both 
                      <span className="font-medium text-blue-600"> recruiters and ATS systems</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg" 
                        className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <span className="material-icons mr-3">auto_fix_high</span>
                        Optimize with AI
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="h-12 px-8 border-2 border-gray-300 hover:bg-white hover:border-blue-300 hover:text-blue-600 rounded-full transition-all duration-300"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <span className="material-icons mr-3">content_copy</span>
                        Create New Resume
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ResumeBuilder;
