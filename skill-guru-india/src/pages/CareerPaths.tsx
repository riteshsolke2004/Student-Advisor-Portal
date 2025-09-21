import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CareerRoadmapModal from "./CareerRoadmapModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  Route,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Star,
  Zap
} from "lucide-react";

// Authentication Guard Component
const AuthenticationRequired: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/8 to-yellow-400/8 blur-3xl" />
        </div>

        <Card className="w-full max-w-2xl border-0 rounded-3xl shadow-2xl bg-white relative z-10">
          <CardHeader className="text-center space-y-6 p-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-3xl">route</span>
            </div>
            
            <div className="space-y-4">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Personalized Career Roadmap
              </CardTitle>
              <CardDescription 
                className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Sign in to generate AI-powered career roadmaps tailored to your professional journey.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "auto_awesome", title: "AI-Generated Paths", desc: "Smart career roadmaps created by ML algorithms" },
                { icon: "route", title: "Step-by-Step Guide", desc: "Clear progression with actionable milestones" },
                { icon: "trending_up", title: "Industry Insights", desc: "Market trends and growth opportunities" },
                { icon: "school", title: "Learning Resources", desc: "Curated courses and skill-building materials" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                    <span className="material-icons text-white text-lg">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/sign-in')}
                className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-3">login</span>
                Sign In to Generate Roadmap
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
          </CardContent>
        </Card>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="material-icons text-purple-500 text-sm">auto_awesome</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              Powered by advanced ML career analysis
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

const CareerPaths = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [error, setError] = useState(null);

  // Generate roadmap without requiring resume upload
  const generateRoadmap = async () => {
    setLoadingRoadmap(true);
    setError(null);

    try {
      const userEmail = user?.email || 'default@example.com';
      
      console.log('Generating personalized roadmap...');
      
      const roadmapResponse = await fetch(`http://localhost:8000/api/career-recommendations/roadmap/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
      });
      
      if (!roadmapResponse.ok) {
        throw new Error(`Roadmap generation failed: ${roadmapResponse.status}`);
      }
      
      const data = await roadmapResponse.json();
      console.log('Roadmap generated successfully:', data);
      
      // Use the API response directly since it matches the expected structure
      setRoadmapData(data);
      setShowRoadmap(true);
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(`Failed to generate roadmap: ${error.message}. Please ensure your backend is running and accessible.`);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-white">
          <div className="text-center">
            <div className="google-loading-spinner mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Loading career roadmap generator...
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

  if (!isAuthenticated) {
    return <AuthenticationRequired />;
  }

  return (
    <>
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
          <section className="py-20 lg:py-28 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
              <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/8 to-yellow-400/8 blur-3xl" />
            </div>

            <div className="container px-6 lg:px-8 relative z-10">
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full text-sm font-medium text-blue-700 shadow-sm">
                  <span className="material-icons text-base">auto_awesome</span>
                  <span style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'User'}! AI Career Roadmap Generator
                  </span>
                </div>

                <h1 
                  className="text-5xl lg:text-7xl font-normal text-gray-900 leading-tight"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Generate Your
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium mt-2">
                    Personalized Roadmap
                  </span>
                </h1>

                <p 
                  className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Let our AI create a detailed career roadmap tailored to your 
                  <span className="font-medium text-blue-600"> skills and aspirations</span>.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="container px-6 lg:px-8">
              <Card className="max-w-4xl mx-auto border-0 rounded-3xl shadow-2xl bg-white">
                <CardHeader className="text-center p-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-medium text-gray-900 mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    AI-Powered Career Roadmap
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Generate a personalized learning roadmap with step-by-step guidance, resources, and project ideas
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-12 pt-0">
                  <div className="space-y-8">
                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                        <div className="flex items-start">
                          <span className="material-icons text-red-500 mr-3 mt-0.5">error_outline</span>
                          <span className="text-red-800 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {error}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Generate Button */}
                    <div className="text-center">
                      <Button
                        onClick={generateRoadmap}
                        disabled={loadingRoadmap}
                        className="h-16 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium disabled:opacity-50"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        {loadingRoadmap ? (
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span>Generating Your Personalized Roadmap...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <Route className="h-6 w-6" />
                            <span>Generate Your Personalized Roadmap</span>
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Features Preview */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
                      {[
                        { icon: "auto_awesome", title: "AI Analysis", desc: "Smart career path recommendations" },
                        { icon: "route", title: "Step-by-Step", desc: "Clear learning progression" },
                        { icon: "school", title: "Resources", desc: "Curated learning materials" },
                        { icon: "trending_up", title: "Industry Aligned", desc: "Current market demands" }
                      ].map((feature, idx) => (
                        <div key={idx} className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <span className="material-icons text-white text-lg">{feature.icon}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {feature.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        {/* Career Roadmap Modal */}
        {showRoadmap && roadmapData && (
          <CareerRoadmapModal 
            isOpen={showRoadmap}
            onClose={() => setShowRoadmap(false)}
            roadmapData={roadmapData}
            careerTitle="Your Personalized Career Roadmap"
          />
        )}
      </div>
    </>
  );
};

export default CareerPaths;
