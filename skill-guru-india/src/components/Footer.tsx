import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
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

      <footer className="bg-gray-900 text-white py-20 relative overflow-hidden">
        {/* Google-style Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-green-500/8 to-yellow-500/8 blur-3xl" />
          
          {/* Google-style subtle pattern */}
          <div className="absolute top-1/3 right-10 opacity-5">
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i % 3 === 0 ? 'bg-blue-400' :
                    i % 3 === 1 ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            {/* Google-style Brand Section */}
            <div className="lg:col-span-1 space-y-8">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <span className="material-icons text-white text-xl">school</span>
                </div>
                <div>
                  <span 
                    className="text-2xl font-medium text-white"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Student Advisor
                  </span>
                  <div 
                    className="text-sm text-blue-300 -mt-1"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Powered by Google AI
                  </div>
                </div>
              </div>
              
              <p 
                className="text-gray-300 text-base leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Empowering students and professionals with AI-driven career guidance, 
                skills development, and job opportunities through Google's cutting-edge technology.
              </p>
              
              {/* Google Material Social Icons */}
              <div className="flex space-x-3">
                {[
                  { icon: "facebook", color: "from-blue-600 to-blue-700", link: "https://facebook.com" },
                  { icon: "alternate_email", color: "from-blue-400 to-blue-500", link: "https://twitter.com" },
                  { icon: "work", color: "from-blue-700 to-indigo-600", link: "https://linkedin.com" },
                  { icon: "photo_camera", color: "from-pink-500 to-purple-600", link: "https://instagram.com" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group flex items-center justify-center"
                  >
                    <span 
                      className={`material-icons text-lg bg-gradient-to-r ${social.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                    >
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>

              {/* Google-style badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm">
                <span className="material-icons text-green-400 text-base">verified</span>
                <span 
                  className="text-white font-medium"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Google Partner
                </span>
              </div>
            </div>

            {/* Platform Links - With proper navigation */}
            <div className="space-y-6">
              <h3 
                className="text-xl font-medium text-white"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Platform
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Career Paths", icon: "explore", path: "/career-paths" },
                  { name: "Skills Analysis", icon: "psychology", path: "/skills-analysis" },
                  { name: "Resume Builder", icon: "description", path: "/resume-builder" },
                  { name: "Job Alerts", icon: "notifications_active", path: "/job-market" },
                  { name: "Mentorship", icon: "people", path: "/mentorship" },
                  { name: "AI Assessments", icon: "quiz", path: "/skills-analysis" }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 group"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <span className="material-icons text-base text-blue-400 group-hover:text-blue-300">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources - With proper navigation */}
            <div className="space-y-6">
              <h3 
                className="text-xl font-medium text-white"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Resources
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Career Guide", icon: "menu_book", path: "/career-guide" },
                  { name: "Industry Reports", icon: "assessment", path: "/reports" },
                  { name: "Learning Paths", icon: "school", path: "/learning-paths" },
                  { name: "Success Stories", icon: "star", path: "/success-stories" },
                  { name: "Blog", icon: "article", path: "/blog" },
                  { name: "Help Center", icon: "help", path: "/help" }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-200 group"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <span className="material-icons text-base text-green-400 group-hover:text-green-300">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact & Newsletter - Enhanced with proper links */}
            <div className="space-y-8">
              <h3 
                className="text-xl font-medium text-white"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Get in Touch
              </h3>
              
              <div className="space-y-5">
                <a 
                  href="mailto:support@studentadvisor.ai"
                  className="flex items-center space-x-4 text-gray-300 group hover:text-white transition-colors duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 group-hover:bg-red-500/30 transition-colors duration-200">
                    <span className="material-icons text-red-400">mail</span>
                  </div>
                  <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                    support@studentadvisor.com
                  </span>
                </a>
                
                <a 
                  href="tel:+8799993086"
                  className="flex items-center space-x-4 text-gray-300 group hover:text-white transition-colors duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-200">
                    <span className="material-icons text-green-400">phone</span>
                  </div>
                  <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                    +91 8799993086
                  </span>
                </a>
                
                <div className="flex items-center space-x-4 text-gray-300 group hover:text-white transition-colors duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors duration-200">
                    <span className="material-icons text-yellow-400">location_on</span>
                  </div>
                  <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                    PUNE, INDIA
                  </span>
                </div>
              </div>

              {/* Google-style Newsletter */}
              <div className="space-y-4">
                <h4 
                  className="font-medium text-white text-lg"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Stay Updated
                </h4>
                
                <form className="space-y-3">
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 pl-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      required
                    />
                    <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      mail_outline
                    </span>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2">send</span>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </form>

                <p 
                  className="text-xs text-gray-400 leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Get the latest updates on career opportunities and AI-powered insights.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section with Legal Links */}
          <div className="border-t border-white/20 pt-10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {[
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "Cookie Policy", path: "/cookies" },
                  { name: "Accessibility", path: "/accessibility" },
                  { name: "Sitemap", path: "/sitemap" }
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Copyright */}
              <div className="text-center lg:text-right">
                <p 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  © 2025 Student Advisor. All rights reserved.
                </p>
                <p 
                  className="text-gray-500 text-xs mt-1"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Built with ❤️ for students worldwide
                </p>
              </div>
            </div>

            {/* Google-style Trust Indicators */}
            <div className="flex justify-center items-center gap-8 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200">
                <span className="material-icons text-blue-400">security</span>
                <span className="text-xs" style={{ fontFamily: 'Roboto, sans-serif' }}>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200">
                <span className="material-icons text-green-400">verified_user</span>
                <span className="text-xs" style={{ fontFamily: 'Roboto, sans-serif' }}>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200">
                <span className="material-icons text-yellow-400">support_agent</span>
                <span className="text-xs" style={{ fontFamily: 'Roboto, sans-serif' }}>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
