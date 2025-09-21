import React, { useState } from 'react';
import { Upload, FileText, Mail, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';

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
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload PDF, DOC, or DOCX files only.');
        return;
      }
      
      // Validate file size (10MB)
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

  // Handle form submission
  // Replace your handleSubmit function with this improved version
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.email || !formData.resume) {
    setError('Please provide both email and resume file.');
    return;
  }

  setIsAnalyzing(true);
  setError(null);
  setAnalysisResult(null);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('resume', formData.resume);

    console.log('Sending request to:', 'http://localhost:8000/api/resume/analyze');

    const response = await fetch('http://localhost:8000/api/resume/analyze', {
      method: 'POST',
      body: formDataToSend,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.get('content-type'));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    
    if (response.status === 404) {
      throw new Error('Resume analysis endpoint not found. Please check if the backend route is properly configured.');
    }

    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.log('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(result.detail || `Request failed: ${response.status}`);
    }

    console.log('Analysis result:', result);
    setAnalysisResult(result);

  } catch (err) {
    console.error('Error during analysis:', err);
    setError(err.message || 'An error occurred during analysis');
  } finally {
    setIsAnalyzing(false);
  }
};

  // Reset form
  const resetForm = () => {
    setFormData({ email: '', resume: null });
    setAnalysisResult(null);
    setError(null);
  };

  // Render ATS Score component
  const ATSScoreCard = ({ score }) => {
    const getScoreColor = (score) => {
      if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          ATS Score Analysis
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(score).map(([key, value]) => {
            if (key === 'total_score') return null;
            return (
              <div key={key} className={`p-3 rounded-lg border ${getScoreColor(value)}`}>
                <div className="text-sm font-medium capitalize">
                  {key.replace('_', ' ')}
                </div>
                <div className="text-2xl font-bold">{value}%</div>
              </div>
            );
          })}
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${getScoreColor(score.total_score)}`}>
          <div className="text-center">
            <div className="text-sm font-medium">Overall ATS Score</div>
            <div className="text-4xl font-bold">{score.total_score}%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume ATS Analysis</h1>
        <p className="text-gray-600">Upload your resume to get detailed ATS score and improvement recommendations</p>
      </div>

      {!analysisResult ? (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Resume File
              </label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                
                {formData.resume ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {formData.resume.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Drag and drop your resume here, or{' '}
                      <label className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
                        browse files
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing || !formData.email || !formData.resume}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <Clock className="animate-spin h-5 w-5 mr-2" />
                  Analyzing Resume...
                </div>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analysis Results Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-green-800">
                  Analysis Complete!
                </h2>
                <p className="text-sm text-green-600">
                  Resume: {analysisResult.resume_filename} | Analyzed: {new Date(analysisResult.metadata.analyzed_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>

          {/* ATS Score */}
          <ATSScoreCard score={analysisResult.analysis.ats_score} />

          {/* Recommendations */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            
            {/* Missing Skills */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.analysis.recommendations.missing_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Improved Bullets */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Improved Bullet Points</h4>
              <div className="space-y-3">
                {analysisResult.analysis.recommendations.improved_bullets.map((bullet, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: bullet }}></p>
                  </div>
                ))}
              </div>
            </div>

            {/* General Recommendations */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">General Recommendations</h4>
              <div className="space-y-3">
                {analysisResult.analysis.recommendations.recommendations.map((rec, index) => (
                  <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: rec }}></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
              <p className="text-sm text-gray-700">{analysisResult.analysis.recommendations.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;