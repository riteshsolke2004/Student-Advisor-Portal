import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Target, TrendingUp, Users, Zap, School, BookOpen, Award, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";
// Import your video from assets folder
import advisorVideo from "@/assets/advisor-video.mp4"; // Update this filename to match your actual file name

const Hero = () => {
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

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 lg:py-5">
        {/* Google-style Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary Google Blue Gradient */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(26, 115, 232, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(52, 168, 83, 0.10) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(251, 188, 4, 0.08) 0%, transparent 50%)
              `
            }}
          />
          
          {/* Google-style geometric shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/8 to-yellow-400/6 blur-3xl" />
          
          {/* Material Design inspired dots pattern */}
          <div className="absolute top-1/3 right-1/4 grid grid-cols-6 gap-2 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i % 4 === 0 ? 'bg-blue-500' :
                  i % 4 === 1 ? 'bg-green-500' :
                  i % 4 === 2 ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: 'pulse 2s infinite'
                }}
              />
            ))}
          </div>
        </div>

        <div className="container relative z-10 px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                {/* Google-style Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
                  <span className="material-icons text-base">auto_awesome</span>
                  <span style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Powered by Google AI
                  </span>
                </div>

                <h1 
                  className="text-5xl lg:text-7xl font-normal text-gray-900 leading-tight"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Shape Your
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent font-medium">
                    Dream Career
                  </span>
                  <span className="block text-4xl lg:text-5xl text-gray-700 font-light mt-2">
                    with AI Guidance
                  </span>
                </h1>

                <p 
                  className="text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Discover personalized career paths, bridge skill gaps, and unlock opportunities 
                  tailored for students with our <span className="font-medium text-blue-600">AI-powered platform</span>.
                </p>
              </div>

              {/* Google Material Design CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Start Your Journey Button - Original styling */}
                <Button
                  asChild
                  size="lg"
                  className="group h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  <Link to="/career-paths">
                    <span className="material-icons mr-3">rocket_launch</span>
                    Start Your Journey
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                {/* Watch Demo Button - WITH Subtle Gemini Border Effect */}
                <div className="hero-gemini-border-wrapper">
                  <Button 
                    size="lg" 
                    className="hero-gemini-gradient-border h-14 px-8 rounded-full transition-all duration-300 border-2 border-gray-300 hover:border-transparent relative"
                    style={{ 
                      fontFamily: 'Google Sans, sans-serif',
                      backgroundColor: '#ffffff',
                      color: '#374151'
                    }}
                  >
                    <Play className="mr-3 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
              </div>

              
            

              {/* Enhanced Google-style Stats with Student Focus */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200">
               
                
                
                
                
              </div>
            </div>

            {/* Right Video Section - Enhanced with Student-Focused Cards */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
                {/* Use the imported video from assets */}
                <video 
                  src={advisorVideo}
                  className="w-full h-auto object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>  



             

              {/* Job Market Trends Card */}
              <div 
                className="absolute bottom-1/3 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ 
                  animation: 'slideInLeft 2s ease-out 2.5s both',
                }}
              >
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CSS with new animations */}
      <style>{`
        /* Original animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideInLeft {
          0% { 
            transform: translateX(-100px);
            opacity: 0;
          }
          100% { 
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% { 
            transform: translateX(100px);
            opacity: 0;
          }
          100% { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Video specific styles */
        video {
          border-radius: inherit;
          width: 100%;
          height: auto;
          max-width: 100%;
        }

        /* REDUCED Gemini Effect - Much Smaller Ring */
        :root {
          /* Subtle Google Gemini Gradient Colors */
          --hero-gemini-orange: #FF8A80;
          --hero-gemini-pink: #FF80AB;
          --hero-gemini-purple: #EA80FC;
          --hero-gemini-blue: #8C9EFF;
          --hero-gemini-cyan: #84FFFF;
          --hero-gemini-green: #B9F6CA;
          --hero-gemini-yellow: #FFFF8D;
        }

        /* Button wrapper with minimal padding */
        .hero-gemini-border-wrapper {
          position: relative;
          border-radius: 9999px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
        }

        /* REDUCED: Much smaller gradient border overlay */
        .hero-gemini-border-wrapper::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(
            45deg,
            var(--hero-gemini-orange) 0%,
            var(--hero-gemini-pink) 14%,
            var(--hero-gemini-purple) 28%,
            var(--hero-gemini-blue) 42%,
            var(--hero-gemini-cyan) 57%,
            var(--hero-gemini-green) 71%,
            var(--hero-gemini-yellow) 85%,
            var(--hero-gemini-orange) 100%
          );
          background-size: 400% 400%;
          border-radius: inherit;
          opacity: 0;
          z-index: -1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: saturate(0.8) brightness(0.9);
        }

        /* REDUCED: Smaller gradient border on hover */
        .hero-gemini-border-wrapper:hover::before {
          opacity: 0.7;
          animation: hero-gemini-gradient-rotate 5s linear infinite;
          filter: saturate(1.0) brightness(1.0);
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
        }

        /* Button maintains white background with subtle border */
        .hero-gemini-gradient-border {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #374151 !important;
          position: relative;
          z-index: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-gemini-gradient-border:hover {
          background-color: #f9fafb !important;
          background: #f9fafb !important;
          color: #374151 !important;
          border-color: transparent !important;
          transform: translateY(-1px);
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.08),
            0 3px 10px rgba(0, 0, 0, 0.04);
        }

        .hero-gemini-gradient-border:focus {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #374151 !important;
        }

        .hero-gemini-gradient-border:active {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #374151 !important;
          transform: translateY(0px) scale(0.98);
        }

        /* REDUCED: Slower, more subtle animation */
        @keyframes hero-gemini-gradient-rotate {
          0% {
            background-position: 0% 50%;
            filter: hue-rotate(0deg) saturate(0.8) brightness(0.9);
          }
          50% {
            background-position: 100% 50%;
            filter: hue-rotate(180deg) saturate(1.0) brightness(1.0);
          }
          100% {
            background-position: 0% 50%;
            filter: hue-rotate(360deg) saturate(0.8) brightness(0.9);
          }
        }

        /* SCOPED focus states */
        .hero-gemini-gradient-border:focus-visible {
          outline: 2px solid #8C9EFF;
          outline-offset: 2px;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }

        /* SCOPED active states */
        .hero-gemini-border-wrapper:active {
          transform: scale(0.98);
        }

        /* SCOPED reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .hero-gemini-border-wrapper:hover::before {
            animation: none !important;
          }
          
          .hero-gemini-gradient-border:hover {
            transform: translateY(-1px);
          }
          
          /* Disable all complex animations for reduced motion */
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default Hero;
