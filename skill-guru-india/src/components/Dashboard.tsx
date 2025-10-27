import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Calendar,
  Clock,
  Award,
  Users,
  FileText,
  ArrowRight,
  Plus,
  Brain,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  User,
  Briefcase,
  BarChart3,
  ExternalLink,
  Zap,
  TrendingDown,
  Shield,
  Lock
} from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";

// Career Recommendation Parser (unchanged)
const parseCareerRecommendation = (response: string) => {
  const sections = response.split('------------------------------');
  const recommendation = sections[1]?.trim();
  
  if (!recommendation) return null;

  // Extract different parts using regex
  const explanationMatch = recommendation.match(/- Explanation: (.*?)(?=- Skill Gaps:|$)/s);
  const skillGapsMatch = recommendation.match(/- Skill Gaps: (.*?)$/s);

  const explanation = explanationMatch?.[1]?.trim() || '';
  const skillGaps = skillGapsMatch?.[1]?.trim() || 'None';

  // Parse the explanation for structured data
  const careerSuggestionMatch = explanation.match(/\*Career Suggestion\*: (.*?)(?=\*|$)/s);
  const reasoningMatch = explanation.match(/\*Reasoning\*: (.*?)(?=\*|$)/s);
  const initialStepsMatch = explanation.match(/\*Initial Steps\*:(.*?)$/s);

  const careerSuggestion = careerSuggestionMatch?.[1]?.trim() || '';
  const reasoning = reasoningMatch?.[1]?.trim() || '';
  
  // Parse initial steps
  let initialSteps: string[] = [];
  if (initialStepsMatch) {
    const stepsText = initialStepsMatch[1];
    const steps = stepsText.match(/\d+\.\s*\*(.*?)\*:(.*?)(?=\d+\.|$)/gs);
    if (steps) {
      initialSteps = steps.map(step => {
        const stepMatch = step.match(/\d+\.\s*\*(.*?)\*:(.*)/s);
        if (stepMatch) {
          return `${stepMatch[1].trim()}: ${stepMatch[2].trim()}`;
        }
        return step.trim();
      });
    }
  }

  return {
    careerSuggestion,
    reasoning,
    initialSteps,
    skillGaps
  };
};

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
            {/* Google-style security icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-3xl">security</span>
            </div>
            
            <div className="space-y-4">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Authentication Required
              </CardTitle>
              <CardDescription 
                className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Please sign in to access your personalized career dashboard and AI-powered insights.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            {/* Security Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <span className="material-icons text-white text-lg">person</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Personalized Experience
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Access your custom career insights and progress tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <span className="material-icons text-white text-lg">shield</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Secure & Private
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Your data is protected with Google-level security
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                  <span className="material-icons text-white text-lg">smart_toy</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    AI-Powered Insights
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Get personalized career recommendations and guidance
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                  <span className="material-icons text-white text-lg">trending_up</span>
                </div>
                <div>
                  <h4 
                    className="font-semibold text-gray-900 mb-1"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Progress Tracking
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Monitor your career development and achievements
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/sign-in')}
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-3">login</span>
                Sign In to Dashboard
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
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google-style Security Notice */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="material-icons text-green-500 text-sm">verified_user</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              Your privacy and security are our top priority
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

// AI Recommendation Component (unchanged)
const AICareerRecommendation: React.FC<{ recommendation: any }> = ({ recommendation }) => {
  if (!recommendation) {
    return (
      <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-8 pb-6">
          <CardTitle 
            className="flex items-center space-x-3 text-xl font-medium text-gray-900"
            style={{ fontFamily: 'Google Sans, sans-serif' }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <Brain className="text-white h-6 w-6" />
            </div>
            <span>AI Career Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Loading your personalized career recommendations...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-8 pb-6">
        <CardTitle 
          className="flex items-center space-x-3 text-xl font-medium text-gray-900"
          style={{ fontFamily: 'Google Sans, sans-serif' }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
            <Brain className="text-white h-6 w-6" />
          </div>
          <span>AI Career Insights</span>
        </CardTitle>
        <CardDescription 
          className="text-gray-600 text-lg mt-2"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          Personalized recommendations based on your profile analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-8">
        
        {/* Career Suggestion */}
        {recommendation.careerSuggestion && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                <Briefcase className="text-white h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 
                  className="font-semibold text-lg text-gray-900 mb-2"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Recommended Career Path
                </h4>
                <p 
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {recommendation.careerSuggestion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reasoning */}
        {recommendation.reasoning && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-blue-600 shadow-md">
                <Target className="text-white h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 
                  className="font-semibold text-lg text-gray-900 mb-2"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Why This Path Suits You
                </h4>
                <p 
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {recommendation.reasoning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Initial Steps */}
        {recommendation.initialSteps && recommendation.initialSteps.length > 0 && (
          <div>
            <h4 
              className="flex items-center text-lg font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-md mr-3">
                <CheckCircle className="text-white h-4 w-4" />
              </div>
              Next Action Steps
            </h4>
            <div className="space-y-3">
              {recommendation.initialSteps.map((step: string, index: number) => {
                const [title, description] = step.split(': ');
                return (
                  <div 
                    key={index} 
                    className="group flex items-start space-x-4 p-4 rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-300">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h5 
                        className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        {title}
                      </h5>
                      {description && (
                        <p 
                          className="text-gray-600 text-sm leading-relaxed"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {description}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skill Gaps */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-500 to-gray-600 shadow-md">
              {recommendation.skillGaps === 'None' ? 
                <CheckCircle className="text-white h-4 w-4" /> : 
                <AlertTriangle className="text-white h-4 w-4" />
              }
            </div>
            <div>
              <h5 
                className="font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Skill Gaps Analysis
              </h5>
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {recommendation.skillGaps === 'None' ? 
                  'Great! No major skill gaps identified.' : 
                  recommendation.skillGaps
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [careerRecommendation, setCareerRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sample AI response - replace this with actual API call
  const sampleAIResponse = `Career Recommendations 
------------------------------
1. General Career Suggestion 
   - Explanation: Hello Shreyash! It's great to hear about your impressive skills in backend development with FastAPI, C++, algorithms, and game development. That's a fantastic combination of technical expertise!
Here's a career suggestion that I believe would be a fantastic fit for you:
*Career Suggestion*: Software Engineer (with a focus on Game Development or Backend Systems)
*Reasoning*: Your proficiency in backend technologies like FastAPI, coupled with your strong C++ and algorithms knowledge, makes you a highly valuable candidate for building robust and efficient software systems. The addition of game development skills indicates a strong aptitude for complex problem-solving, performance optimization, and creative application development. These skills are directly transferable to either specializing in the backend infrastructure for online games or working on complex backend systems for other industries that require high performance and scalability.
*Initial Steps*:
    1. *Build a Portfolio*: Showcase your game development projects and any backend applications you've built using FastAPI. This will visually demonstrate your abilities to potential employers.
    2. *Network within Game Development Communities*: Connect with other game developers online (forums, Discord, LinkedIn) and attend local or virtual game development meetups. Networking can open doors to exciting opportunities.
    3. *Explore Backend Roles in Gaming Companies*: Look for entry-level or junior backend engineer positions at gaming studios. Highlight how your FastAPI and C++ skills can contribute to their game servers, matchmaking systems, or other backend services.
You have a strong foundation, Shreyash, and I'm excited to see where your talents take you!
   - Skill Gaps: None
------------------------------`;

  // Sample job trends data
  const jobTrends = [
    {
      title: "AI/ML Engineer Roles",
      growth: "+45%",
      trend: "up",
      description: "High demand across tech companies",
      color: "bg-green-100 text-green-700",
      icon: "smart_toy",
      dotColor: "bg-green-500",
      trendIcon: TrendingUp
    },
    {
      title: "Remote Developer Jobs",
      growth: "+32%",
      trend: "up", 
      description: "Growing remote opportunities",
      color: "bg-blue-100 text-blue-700",
      icon: "home",
      dotColor: "bg-blue-500",
      trendIcon: TrendingUp
    },
    {
      title: "Full Stack Positions",
      growth: "+28%",
      trend: "up",
      description: "High demand for versatile developers",
      color: "bg-purple-100 text-purple-700",
      icon: "code",
      dotColor: "bg-purple-500",
      trendIcon: TrendingUp
    },
    {
      title: "Data Science Roles",
      growth: "+15%",
      trend: "up",
      description: "Steady growth in analytics",
      color: "bg-orange-100 text-orange-700", 
      icon: "analytics",
      dotColor: "bg-orange-500",
      trendIcon: BarChart3
    }
  ];

  // Fetch career recommendation from backend
 const fetchCareerRecommendation = async () => {
  if (!user?.email) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    console.log(`Fetching career recommendations for: ${user.email}`);

    // First, check if cached recommendations exist
    const cachedResponse = await fetch(
      `https://fastapi-backend-fixed-278398219986.asia-south1.run.app/api/career-recommendations/cached/${encodeURIComponent(user.email)}`
    );

    if (cachedResponse.ok) {
      const cachedResult = await cachedResponse.json();
      if (cachedResult.found && cachedResult.recommendations) {
        console.log("Found cached recommendations:", cachedResult.recommendations);
        setCareerRecommendation(cachedResult.recommendations);
        setLoading(false);
        return;
      }
    }

    console.log("No cached recommendations found, generating new ones...");

    // If no cached recommendations, generate new ones
    const generateResponse = await fetch(
      `https://fastapi-backend-fixed-278398219986.asia-south1.run.app/api/career-recommendations/generate/${encodeURIComponent(user.email)}?use_resume=true&force_refresh=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

   if (generateResponse.ok) {
  const result = await generateResponse.json();
  console.log("Generate API raw response:", result);
  if (result.success && result.recommendations) {
    console.log("Successfully generated recommendations:", result.recommendations);
    setCareerRecommendation(result.recommendations);
  } else {
    console.error("Failed to generate recommendations:", result.error);
    setCareerRecommendation([]);
  }
} else {
  console.error("API call failed:", generateResponse.status);
  const errorText = await generateResponse.text();
  console.error("Error response:", errorText);
  setCareerRecommendation([]);
}
  } catch (error) {
    console.error("Error fetching career recommendation:", error);
    setCareerRecommendation([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      fetchCareerRecommendation();
    }
  }, [isAuthenticated]);

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
              Loading your dashboard...
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

  // Show dashboard if user is authenticated
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

      <Header/>
      
      <section id="dashboard" className="py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-white relative overflow-hidden">
        {/* Google-style Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/8 to-purple-400/8 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/6 to-yellow-400/6 blur-3xl" />
          
          {/* Google-style geometric elements */}
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
          {/* Google Material Header - Welcome Message */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full text-sm font-medium text-blue-700 shadow-sm">
              <span className="material-icons text-base">dashboard</span>
              <span style={{ fontFamily: 'Google Sans, sans-serif' }}>
                Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'User'}!
              </span>
            </div>

            <h2 
              className="text-4xl lg:text-5xl font-normal text-gray-900 leading-tight"
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            >
              Your Personalized
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium mt-2">
                Career Dashboard
              </span>
            </h2>

            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Track your progress, discover opportunities, and manage your career journey 
              with <span className="font-medium text-blue-600">Google AI insights</span>.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Career Recommendation comes FIRST */}
              {/* AI Career Recommendation - REPLACE YOUR EXISTING SECTION WITH THIS */}
{(() => {
  console.log("Career recommendation data:", careerRecommendation);

  // Handle loading state
  if (loading || careerRecommendation === null) {
    return (
      <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-8 pb-6">
          <CardTitle 
            className="flex items-center space-x-3 text-xl font-medium text-gray-900"
            style={{ fontFamily: 'Google Sans, sans-serif' }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <i className="material-icons text-white text-xl">psychology</i>
            </div>
            <span>AI Career Recommendation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="google-loading-spinner mb-4"></div>
              <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Analyzing your profile for personalized career recommendations...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty or invalid recommendation data
  if (!careerRecommendation || careerRecommendation.length === 0) {
    return (
      <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
        <CardHeader className="p-8 pb-6">
          <CardTitle 
            className="flex items-center space-x-3 text-xl font-medium text-gray-900"
            style={{ fontFamily: 'Google Sans, sans-serif' }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <i className="material-icons text-white text-xl">psychology</i>
            </div>
            <span>AI Career Recommendation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="text-center py-8">
            <i className="material-icons text-gray-400 text-4xl mb-4">info</i>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              No career recommendations available. Please ensure your profile is complete.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Parse the recommendation data
  const recommendations = Array.isArray(careerRecommendation) ? careerRecommendation : [careerRecommendation];
  const mainRecommendation = recommendations[0];

  // Parse career suggestions from the reasoning field
  let careerSuggestions = [];
  if (mainRecommendation?.reasoning) {
    try {
      // Extract JSON from the reasoning field (it's wrapped in ```json```)
      const jsonMatch = mainRecommendation.reasoning.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        careerSuggestions = Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (e) {
      console.log("Could not parse reasoning JSON:", e);
    }
  }

  return (
    <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-8 pb-6">
        <CardTitle 
          className="flex items-center space-x-3 text-xl font-medium text-gray-900"
          style={{ fontFamily: 'Google Sans, sans-serif' }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
            <i className="material-icons text-white text-xl">psychology</i>
          </div>
          <span>AI Career Recommendation</span>
        </CardTitle>
        <CardDescription 
          className="text-gray-600 text-lg mt-2"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          Personalized career insights powered by AI analysis of your profile
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 pt-0 space-y-8">
        {/* Main Career Suggestion */}
        {mainRecommendation?.career_name && mainRecommendation.career_name !== "General Career Suggestion" && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <i className="material-icons text-white">star</i>
                </div>
              </div>
              <div className="flex-1">
                <h3 
                  className="text-xl font-semibold text-gray-900 mb-3"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {mainRecommendation.career_name}
                </h3>
                {mainRecommendation.explanation && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <p>{mainRecommendation.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Career Suggestions from Reasoning */}
        {careerSuggestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="material-icons text-blue-600 text-lg">work_outline</i>
              </div>
              <h4 
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Top Career Recommendations for You
              </h4>
            </div>
            
            <div className="space-y-6">
              {careerSuggestions.slice(0, 3).map((career, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index === 0 ? 'bg-blue-100' :
                        index === 1 ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <i className={`material-icons text-lg ${
                          index === 0 ? 'text-blue-600' :
                          index === 1 ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                          {career.career_name.includes('Full-Stack') || career.career_name.includes('Full Stack') ? 'code' : 
                           career.career_name.includes('Frontend') ? 'web' : 'storage'}
                        </i>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 
                        className="text-xl font-semibold text-gray-900 mb-3"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        {career.career_name}
                      </h5>
                      
                      {career.reasoning && (
                      <p 
  className="text-gray-600 text-sm mb-5 leading-relaxed"
  style={{ fontFamily: 'Roboto, sans-serif' }}
>
  {career.reasoning}
</p>
                      )}
                      
                      {career.required_skills && career.required_skills.length > 0 && (
                        <div>
                          <h6 
                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            Key Skills Required
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {career.required_skills.slice(0, 4).map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="inline-block px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                {skill}
                              </span>
                            ))}
                            {career.required_skills.length > 4 && (
                              <span className="inline-block px-3 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                                +{career.required_skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6 border-t border-gray-100">
          <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <span style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Get Detailed Career Analysis
            </span>
            <i className="material-icons text-lg">arrow_forward</i>
          </button>
        </div>
      </CardContent>
    </Card>
  );
})()}

              {/* Career Progress comes SECOND */}
              <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-8 pb-6">
                  <CardTitle 
                    className="flex items-center space-x-3 text-xl font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <span className="material-icons text-white text-xl">trending_up</span>
                    </div>
                    <span>Career Progress</span>
                  </CardTitle>
                  <CardDescription 
                    className="text-gray-600 text-lg mt-2"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Your journey towards becoming a <span className="font-medium text-blue-600">Full Stack Developer</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  {/* Main Progress with Google Material Design styling */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span 
                        className="font-medium text-gray-900 text-lg"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        Overall Progress
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">68%</span>
                        <span className="material-icons text-green-500">trending_up</span>
                      </div>
                    </div>
                    {/* Custom Google-style progress bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: '68%' }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skill Breakdown */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { name: "Technical Skills", value: 75, color: "from-blue-500 to-blue-600", icon: "code" },
                      { name: "Experience", value: 45, color: "from-green-500 to-green-600", icon: "work" },
                      { name: "Portfolio", value: 85, color: "from-purple-500 to-purple-600", icon: "folder" }
                    ].map((skill, index) => (
                      <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <span className={`material-icons text-lg bg-gradient-to-r ${skill.color} bg-clip-text text-transparent`}>
                            {skill.icon}
                          </span>
                          <div 
                            className="text-sm font-medium text-gray-900"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            {skill.name}
                          </div>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${skill.value}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">{skill.value}%</span>
                          <span className="material-icons text-xs text-green-500">check_circle</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Stats & Actions */}
            <div className="space-y-8">
              {/* Quick Stats - Google Material Card */}
              <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-6">
                  <CardTitle 
                    className="text-lg font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                  {[
                    { label: "Skills Acquired", value: "24", icon: "military_tech", color: "text-blue-600" },
                    { label: "Projects Completed", value: "8", icon: "task_alt", color: "text-green-600" },
                    { label: "Mentor Sessions", value: "12", icon: "people", color: "text-purple-600" },
                    { label: "Job Applications", value: "45", icon: "send", color: "text-red-600" }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <span className={`material-icons ${stat.color}`}>
                          {stat.icon}
                        </span>
                        <span 
                          className="text-gray-700 font-medium"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {stat.label}
                        </span>
                      </div>
                      <span 
                        className="font-bold text-xl text-gray-900"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Job Market Trends */}
              <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-6">
                  <CardTitle 
                    className="flex items-center justify-between text-lg font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-icons text-blue-600">trending_up</span>
                      <span>Job Market Trends</span>
                    </div>
                    <Button 
                      asChild
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Link to="/job-market">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardTitle>
                  <CardDescription 
                    className="text-sm text-gray-600"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Current hiring trends in your field
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  {jobTrends.map((trend, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200 group cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${trend.dotColor}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div 
                            className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            {trend.title}
                          </div>
                          <div className="flex items-center space-x-1">
                            <trend.trendIcon className="w-3 h-3 text-green-500" />
                            <span className="text-sm font-semibold text-green-600">
                              {trend.growth}
                            </span>
                          </div>
                        </div>
                        <div 
                          className="text-sm text-gray-500 flex items-center gap-1 mt-1"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          <span className="material-icons text-xs">{trend.icon}</span>
                          {trend.description}
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs rounded-full ${trend.color} border-0`}>
                        Hot
                      </Badge>
                    </div>
                  ))}
                  
                  {/* View Full Market Analysis Button */}
                  <div className="pt-2">
                    <Button 
                      asChild
                      className="w-full justify-center h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <Link to="/job-market">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Full Market Analysis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions - Google Material Card */}
              <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-6">
                  <CardTitle 
                    className="text-lg font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-3">
                  {[
                    { label: "Start Learning Path", icon: "menu_book", color: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200", to: "/career-paths" },
                    { label: "Book Mentor Session", icon: "people", color: "hover:bg-green-50 hover:text-green-600 hover:border-green-200", to: "/mentorship" },
                    { label: "Take Skills Assessment", icon: "quiz", color: "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200", to: "/skills-analysis" }
                  ].map((action, index) => (
                    <Button 
                      key={index}
                      asChild
                      className={`w-full justify-start h-12 rounded-xl border border-gray-200 text-gray-700 bg-white transition-all duration-200 ${action.color}`} 
                      variant="outline"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <Link to={action.to}>
                        <span className="material-icons mr-3">
                          {action.icon}
                        </span>
                        {action.label}
                      </Link>
                    </Button>
                  ))}
                  
                  <Button 
                    className="w-full justify-start h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-3">calendar_today</span>
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
