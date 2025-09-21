import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Sparkles,
  Lock
} from "lucide-react";
import ResumeAnalysis from "@/components/ResumeAnalysisComponent";

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
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-3xl">analytics</span>
            </div>
            
            <div className="space-y-4">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Resume Analysis Platform
              </CardTitle>
              <CardDescription 
                className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Sign in to get AI-powered resume analysis with ATS scoring and professional recommendations.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "analytics", title: "ML-Powered Analysis", desc: "Advanced machine learning algorithms" },
                { icon: "check_circle", title: "ATS Compatibility", desc: "Beat applicant tracking systems" },
                { icon: "auto_awesome", title: "AI Recommendations", desc: "Personalized improvement suggestions" },
                { icon: "trending_up", title: "Score Optimization", desc: "Maximize your resume performance" }
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
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-3">login</span>
                Sign In to Analyze
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
            <span className="material-icons text-orange-500 text-sm">auto_awesome</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              ML-powered resume optimization for maximum impact
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

const ResumeBuilder = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-white">
          <div className="text-center">
            <div className="google-loading-spinner mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Loading resume analysis platform...
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
                    Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'User'}! AI-Powered Resume Analysis
                  </span>
                </div>

                <h1 
                  className="text-5xl lg:text-7xl font-normal text-gray-900 leading-tight"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Advanced Resume
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium mt-2">
                    Analysis & Optimization
                  </span>
                </h1>

                <p 
                  className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Leverage machine learning algorithms to analyze your resume, optimize ATS compatibility, 
                  and get actionable insights for the <span className="font-medium text-blue-600">modern job market</span>.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="container px-6 lg:px-8">
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
                  Get detailed insights and recommendations powered by advanced ML models to make your resume stand out to 
                  <span className="font-medium text-blue-600"> recruiters and ATS systems</span>.
                </p>
              </div>

              <ResumeAnalysis />

              <div className="text-center space-y-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100 mt-16">
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
                  Let our ML algorithms help you create a resume that gets noticed by both 
                  <span className="font-medium text-blue-600"> recruiters and ATS systems</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-3">auto_fix_high</span>
                    Analyze Another Resume
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-12 px-8 border-2 border-gray-300 hover:bg-white hover:border-blue-300 hover:text-blue-600 rounded-full transition-all duration-300"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-3">download</span>
                    Download Report
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ResumeBuilder;
