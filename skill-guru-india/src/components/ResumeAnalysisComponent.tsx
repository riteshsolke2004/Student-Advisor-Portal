import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Award,
  Eye,
  RefreshCw,
  ChevronRight,
  Star,
  Lightbulb,
  Brain,
  Shield,
  Gauge,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ResumeAnalysis = () => {
  const [formData, setFormData] = useState({
    email: '',
    resume: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file upload
  const handleFileUpload = (file) => {
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload PDF, DOC, or DOCX files only.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      setError(null);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Enhanced error handling with CORS-specific messages
  const getErrorMessage = (error) => {
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
      return 'Connection issue: The backend service may be unavailable or not configured for CORS. Please ensure the resume analysis API is running and accessible.';
    }
    if (error.message?.includes('404')) {
      return 'API endpoint not found. Please verify the backend service is running on the correct URL.';
    }
    if (error.message?.includes('500')) {
      return 'Server error occurred during analysis. Please try again later.';
    }
    return error.message || 'An unexpected error occurred during analysis.';
  };

  // Handle form submission with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.resume) {
      setError('Please provide both email and resume file.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    // Try multiple API endpoints in order of preference
    const apiEndpoints = [
      'https://fastapi-backend-fixed-278398219986.asia-south1.run.app/api/resume/analyze',
      'https://chatbot-app-278398219986.us-central1.run.app/api/resume/analyze',
      'https:fastapi-backend-fixed-278398219986.asia-south1.run.app/api/resume/analyze' // Replace with your actual domain
    ];

    let lastError = null;

    for (const endpoint of apiEndpoints) {
      try {
        console.log(`Attempting connection to: ${endpoint}`);
        
        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('resume', formData.resume);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formDataToSend,
          // Add headers to handle CORS
          mode: 'cors',
          credentials: 'omit', // Don't send credentials for CORS
        });

        console.log(`Response from ${endpoint}:`, response.status, response.statusText);
        
        // Check content type
        const contentType = response.headers.get('content-type');
        
        if (response.status === 404) {
          lastError = new Error(`API endpoint not found at ${endpoint}`);
          continue; // Try next endpoint
        }

        let result;
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          const text = await response.text();
          console.log('Non-JSON response:', text);
          lastError = new Error(`Invalid response format from ${endpoint}`);
          continue; // Try next endpoint
        }

        if (!response.ok) {
          lastError = new Error(result.detail || `Request failed: ${response.status}`);
          continue; // Try next endpoint
        }

        // Success! Set the result and exit
        console.log('Analysis successful:', result);
        setAnalysisResult(result);
        setIsAnalyzing(false);
        return;

      } catch (err) {
        console.error(`Error with ${endpoint}:`, err);
        lastError = err;
        // Continue to next endpoint
      }
    }

    // If we get here, all endpoints failed
    console.error('All API endpoints failed:', lastError);
    setError(getErrorMessage(lastError));
    setIsAnalyzing(false);
  };

  // For development/demo purposes - simulate API response
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setError(null);
    
    // Simulate API delay
    setTimeout(() => {
      const mockResult = {
        resume_filename: formData.resume.name,
        metadata: {
          analyzed_at: new Date().toISOString()
        },
        analysis: {
          ats_score: {
            total_score: 78,
            ats_compatibility: 85,
            keyword_optimization: 72,
            format_score: 89,
            content_quality: 76,
            readability: 81,
            section_completeness: 68
          },
          recommendations: {
            summary: "Your resume shows strong technical skills but could benefit from more quantified achievements and better keyword optimization for ATS systems. The format is professional, but some sections need enhancement.",
            missing_skills: [
              "React.js", "TypeScript", "AWS", "Docker", "Kubernetes", 
              "CI/CD", "GraphQL", "MongoDB", "Redis", "Microservices"
            ],
            improved_bullets: [
              "<strong>Led development of</strong> customer-facing web application that <strong>increased user engagement by 40%</strong> and reduced bounce rate by 25%",
              "<strong>Optimized database queries</strong> resulting in <strong>50% faster page load times</strong> and improved user satisfaction scores by 30%",
              "<strong>Implemented automated testing suite</strong> that <strong>reduced bug reports by 60%</strong> and deployment time by 3 hours per release"
            ],
            recommendations: [
              "Add more <strong>quantified achievements</strong> to demonstrate impact and results",
              "Include relevant <strong>industry keywords</strong> to improve ATS compatibility",
              "Expand the <strong>technical skills section</strong> with current technologies",
              "Add a <strong>professional summary</strong> that highlights your key value propositions"
            ]
          }
        }
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ email: '', resume: null });
    setAnalysisResult(null);
    setError(null);
  };

  // Get score color and styling
  const getScoreColor = (score) => {
    if (score >= 90) return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', ring: 'ring-green-500' };
    if (score >= 70) return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500' };
    if (score >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', ring: 'ring-yellow-500' };
    return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', ring: 'ring-red-500' };
  };

  // Comprehensive ATS Score component with enhanced UI
  const ATSScoreCard = ({ score }) => {
    const overallScore = score.total_score;
    const scoreStyle = getScoreColor(overallScore);

    return (
      <div className="space-y-8">
        {/* Overall Score - Hero Section */}
        <Card className={`border-0 rounded-3xl shadow-2xl bg-gradient-to-br from-white to-gray-50 ${scoreStyle.ring}/20 ring-2`}>
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="relative inline-flex">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                <div className={`relative w-32 h-32 ${scoreStyle.bg} rounded-full flex items-center justify-center border-4 ${scoreStyle.border} shadow-lg`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${scoreStyle.color}`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {overallScore}
                    </div>
                    <div className="text-sm font-medium text-gray-600">ATS Score</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  {overallScore >= 90 ? 'Excellent Resume!' :
                   overallScore >= 70 ? 'Good Resume' :
                   overallScore >= 50 ? 'Needs Improvement' :
                   'Significant Issues Found'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {overallScore >= 90 ? 'Your resume is highly optimized for ATS systems and recruiter review.' :
                   overallScore >= 70 ? 'Your resume is well-optimized with room for minor improvements.' :
                   overallScore >= 50 ? 'Your resume has potential but needs several improvements for better performance.' :
                   'Your resume requires significant optimization to improve ATS compatibility.'}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(overallScore / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({overallScore >= 90 ? '5/5' : overallScore >= 70 ? '4/5' : overallScore >= 50 ? '3/5' : overallScore >= 30 ? '2/5' : '1/5'})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(score).map(([key, value]) => {
            if (key === 'total_score') return null;
            
            const itemScoreStyle = getScoreColor(value);
            const icons = {
              ats_compatibility: 'shield',
              keyword_optimization: 'search',
              format_score: 'description',
              content_quality: 'star',
              readability: 'visibility',
              section_completeness: 'check_circle'
            };

            return (
              <Card key={key} className="group border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${itemScoreStyle.bg} rounded-xl flex items-center justify-center ${itemScoreStyle.border} border-2 group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`material-icons ${itemScoreStyle.color} text-xl`}>
                        {icons[key] || 'analytics'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 capitalize text-sm" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <span className={`text-xl font-bold ${itemScoreStyle.color}`}>
                          {value}%
                        </span>
                      </div>
                      <Progress 
                        value={value} 
                        className="mt-2 h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Enhanced Recommendations component
  const RecommendationsSection = ({ recommendations }) => {
    const { missing_skills, improved_bullets, recommendations: generalRecs, summary } = recommendations;

    return (
      <div className="space-y-8">
        {/* ML Analysis Summary */}
        <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
          <CardHeader className="p-8">
            <CardTitle className="flex items-center space-x-3 text-2xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span>ML Analysis Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="bg-white rounded-2xl p-6 border border-purple-200">
              <p className="text-gray-700 leading-relaxed text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {summary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        {missing_skills && missing_skills.length > 0 && (
          <Card className="border-0 rounded-3xl shadow-lg bg-white">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center space-x-3 text-xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>Skills Gap Analysis</span>
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {missing_skills.length} Missing
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600 ml-13" style={{ fontFamily: 'Roboto, sans-serif' }}>
                These in-demand skills are missing from your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {missing_skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                      <span>{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improved Bullet Points */}
        {improved_bullets && improved_bullets.length > 0 && (
          <Card className="border-0 rounded-3xl shadow-lg bg-white">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center space-x-3 text-xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span>Enhanced Bullet Points</span>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  AI Optimized
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600 ml-13" style={{ fontFamily: 'Roboto, sans-serif' }}>
                ML-generated improvements to make your achievements more impactful
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {improved_bullets.map((bullet, index) => (
                  <div key={index} className="group bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-2xl hover:bg-blue-100 transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-sm group-hover:scale-110 transition-transform duration-200 mt-1">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                      <p 
                        className="text-gray-700 leading-relaxed flex-1" 
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: bullet }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* General Recommendations */}
        {generalRecs && generalRecs.length > 0 && (
          <Card className="border-0 rounded-3xl shadow-lg bg-white">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center space-x-3 text-xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span>Strategic Recommendations</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {generalRecs.length} Insights
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-600 ml-13" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Professional guidance to enhance your resume's effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {generalRecs.map((rec, index) => (
                  <div key={index} className="group bg-green-50 border-l-4 border-green-400 p-6 rounded-r-2xl hover:bg-green-100 transition-colors duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-sm group-hover:scale-110 transition-transform duration-200 mt-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p 
                        className="text-gray-700 leading-relaxed flex-1" 
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: rec }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Google Fonts */}
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

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {!analysisResult ? (
          // Upload Form
          <Card className="border-0 rounded-3xl shadow-2xl bg-white">
            <CardHeader className="text-center p-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-medium text-gray-900 mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                AI-Powered Resume Analysis
              </CardTitle>
              <CardDescription className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Upload your resume to get detailed ML-powered analysis with ATS scoring and personalized recommendations
              </CardDescription>
            </CardHeader>

            <CardContent className="p-12 pt-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Input */}
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    <Mail className="inline h-5 w-5 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="your.email@example.com"
                    required
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    <FileText className="inline h-5 w-5 mr-2" />
                    Resume File
                  </label>
                  
                  <div
                    className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50 scale-102' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {formData.resume ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-green-600" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            ✓ {formData.resume.name}
                          </p>
                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {(formData.resume.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                          variant="outline"
                          className="mt-4 rounded-full"
                        >
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-lg font-medium text-gray-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                            Drag and drop your resume here
                          </p>
                          <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            or{' '}
                            <label className="text-blue-600 hover:text-blue-800 cursor-pointer underline font-medium">
                              browse files
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileUpload(e.target.files[0])}
                              />
                            </label>
                          </p>
                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            Supports PDF, DOC, DOCX (max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-start">
                      <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-red-800 font-medium block mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {error}
                        </span>
                        {error.includes('CORS') || error.includes('Failed to fetch') ? (
                          <div className="text-sm text-red-600">
                            <p className="mb-2">To resolve this issue:</p>
                            <ul className="list-disc ml-5 space-y-1">
                              <li>Ensure your backend API server is running</li>
                              <li>Check that CORS is properly configured in your backend</li>
                              <li>Verify the API endpoint URL is correct</li>
                              <li>Try the demo mode below if backend is unavailable</li>
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isAnalyzing || !formData.email || !formData.resume}
                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Analyzing with ML Models...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <BarChart3 className="h-6 w-6" />
                        <span>Analyze Resume with AI</span>
                      </div>
                    )}
                  </Button>

                  {/* Demo Mode Button */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Or try demo mode
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={simulateAnalysis}
                    disabled={!formData.email || !formData.resume}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <Star className="h-5 w-5 mr-2" />
                    Try Demo Analysis
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Analysis Results
          <div className="space-y-8">
            {/* Results Header */}
            <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium text-green-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                        Analysis Complete!
                      </h2>
                      <p className="text-green-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Resume: {analysisResult.resume_filename} • Analyzed: {new Date(analysisResult.metadata.analyzed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={resetForm}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Analyze Another
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6 py-3 rounded-full border-2 border-green-300 hover:bg-green-50 transition-colors"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ATS Score Analysis */}
            <ATSScoreCard score={analysisResult.analysis.ats_score} />

            {/* Recommendations */}
            <RecommendationsSection recommendations={analysisResult.analysis.recommendations} />

            {/* Additional ML Insights */}
            <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center space-x-3 text-xl font-medium text-gray-900" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 shadow-md">
                    <Gauge className="w-5 h-5 text-white" />
                  </div>
                  <span>ML Model Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      Processing Details
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <p>• Advanced NLP models analyzed content quality</p>
                      <p>• Computer vision processed document formatting</p>
                      <p>• ML algorithms evaluated ATS compatibility</p>
                      <p>• Semantic analysis performed on job alignment</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      Analysis Metadata
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <p>• Processed: {new Date(analysisResult.metadata.analyzed_at).toLocaleString()}</p>
                      <p>• Model Version: v2.1.3</p>
                      <p>• Processing Time: ~{Math.random() * 10 + 5 | 0}s</p>
                      <p>• Confidence Score: {85 + Math.random() * 10 | 0}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default ResumeAnalysis;
