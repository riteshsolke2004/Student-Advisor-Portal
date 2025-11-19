import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "./Layout";
import { ProgressIndicator } from "./ProgressIndicator";
import { 
  ArrowRight, 
  Upload, 
  FileText, 
  Award, 
  Link as LinkIcon, 
  X, 
  CheckCircle,
  Github,
  Linkedin,
  Globe,
  CloudUpload,
  File,
  Image,
  FileImage,
  Briefcase,
  User,
  ExternalLink,
  Shield,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onNext: () => void;
  onBack: () => void;
  userEmail: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export const DocumentUpload = ({ onNext, onBack, userEmail }: DocumentUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<UploadedFile | null>(null);
  const [certificates, setCertificates] = useState<UploadedFile[]>([]);
  
  const [formData, setFormData] = useState({
    domain: "",
    portfolioUrl: "",
  });
  
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: ""
  });
  const [isDragging, setIsDragging] = useState(false);
  
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certificatesInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, type: "resume" | "certificates") => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, type);
  };

  const handleFiles = (files: File[], type: "resume" | "certificates") => {
    if (type === "resume" && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.type.includes("document")) {
        setResumeFile({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        });
        toast({
          title: "Resume uploaded successfully",
          description: file.name,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOC file for your resume.",
          variant: "destructive",
        });
      }
    } else if (type === "certificates") {
      const validFiles = files.filter(file => 
        file.type === "application/pdf" || file.type.includes("document") || file.type.includes("image")
      );
      
      const newCertificates = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      
      setCertificates(prev => [...prev, ...newCertificates]);
      toast({
        title: `${validFiles.length} certificate(s) uploaded`,
        description: "Files uploaded successfully",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: "resume" | "certificates") => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files, type);
  };

  const removeFile = (type: "resume" | "certificate", index?: number) => {
    if (type === "resume") {
      setResumeFile(null);
    } else if (type === "certificate" && index !== undefined) {
      setCertificates(prev => prev.filter((_, i) => i !== index));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast({
        title: "Form incomplete",
        description: "Please upload your resume and fill in required fields.",
        variant: "destructive",
      });
      return;
    }

    console.log("🚀 Starting document upload for:", userEmail);
    setIsLoading(true);

    try {
      const formDataPayload = new FormData();
      
      formDataPayload.append('userEmail', userEmail);
      formDataPayload.append('domain', formData.domain);
      formDataPayload.append('portfolioUrl', formData.portfolioUrl);
      formDataPayload.append('linkedinUrl', socialLinks.linkedin);
      formDataPayload.append('githubUrl', socialLinks.github);
      formDataPayload.append('personalPortfolioUrl', socialLinks.portfolio);
      
      if (resumeFile) {
        formDataPayload.append('resume', resumeFile.file);
      }
      
      certificates.forEach((cert, index) => {
        formDataPayload.append(`certificates`, cert.file);
      });

      console.log("📦 Uploading documents...");

      const response = await fetch(
        `http://127.0.0.1:8000/api/documents/upload/${userEmail}`,
        {
          method: "POST",
          body: formDataPayload,
        }
      );

      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(`Failed to upload documents: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Documents uploaded successfully:", result);

      toast({
        title: "Documents uploaded successfully!",
        description: "Your files have been saved securely.",
      });
      
      onNext();
    } catch (error) {
      console.error("❌ Failed to upload documents:", error);
      toast({
        title: "Upload failed",
        description: `Error uploading documents: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const isFormValid = resumeFile !== null && formData.domain.trim() !== "";

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('image')) return <FileImage className="w-5 h-5 text-green-500" />;
    if (type.includes('document')) return <File className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

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

      <Layout>
        {/* ONLY PROGRESS BAR - Below Layout */}
        <div className="max-w-md mx-auto mb-8 px-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span 
              className="font-medium text-gray-700"
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            >
              Setup Progress
            </span>
            <span className="font-bold text-blue-600">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: '100%' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white relative overflow-hidden">
          {/* Google-style Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/8 to-purple-400/8 blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/6 to-yellow-400/6 blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto p-6 space-y-8 relative z-10">
            {/* Google Material Header */}
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-blue-200 rounded-full text-sm font-medium text-blue-700 shadow-sm">
                <span className="material-icons text-base">upload</span>
                <span style={{ fontFamily: 'Google Sans, sans-serif' }}>Final Step - Document Upload</span>
              </div>

              <h1 
                className="text-4xl lg:text-5xl font-normal text-gray-900 leading-tight"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Complete Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium mt-2">
                  Professional Profile
                </span>
              </h1>

              <p 
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Upload your documents and add professional links to create a complete profile 
                with <span className="font-medium text-blue-600">AI-powered insights</span>.
              </p>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-8">
                {/* Professional Domain Card */}
                <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="p-8">
                    <CardTitle 
                      className="flex items-center gap-3 text-xl font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="material-icons text-white text-xl">work</span>
                      </div>
                      Professional Information
                    </CardTitle>
                    <CardDescription 
                      className="text-gray-600 text-lg mt-2"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Tell us about your professional expertise and portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="space-y-3">
                      <Label 
                        htmlFor="domain" 
                        className="text-base font-medium text-gray-900 flex items-center gap-2"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <span className="material-icons text-blue-600 text-sm">business_center</span>
                        Professional Domain *
                      </Label>
                      <Input
                        id="domain"
                        placeholder="e.g., Software Development, Data Science, UI/UX Design"
                        value={formData.domain}
                        onChange={(e) => handleInputChange("domain", e.target.value)}
                        className="h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white text-base transition-all duration-200"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label 
                        htmlFor="portfolioUrl"
                        className="text-base font-medium text-gray-900 flex items-center gap-2"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <span className="material-icons text-green-600 text-sm">language</span>
                        Portfolio Website
                      </Label>
                      <div className="relative">
                        <Input
                          id="portfolioUrl"
                          placeholder="https://your-portfolio.com"
                          value={formData.portfolioUrl}
                          onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                          className="h-12 pl-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 bg-white text-base transition-all duration-200"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        />
                        <ExternalLink className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload Cards */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Resume Upload */}
                  <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                    <CardHeader className="p-8">
                      <CardTitle 
                        className="flex items-center gap-3 text-xl font-medium text-gray-900"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="material-icons text-white text-xl">description</span>
                        </div>
                        Resume/CV Upload *
                      </CardTitle>
                      <CardDescription 
                        className="text-gray-600 text-lg mt-2"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Upload your latest resume or curriculum vitae
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <div
                        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
                          isDragging 
                            ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105" 
                            : resumeFile 
                              ? "border-green-400 bg-green-50" 
                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, "resume")}
                        onClick={() => resumeInputRef.current?.click()}
                      >
                        <input
                          ref={resumeInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileInput(e, "resume")}
                          className="hidden"
                        />
                        
                        {resumeFile ? (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                              <span className="material-icons text-white text-2xl">check_circle</span>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  {getFileIcon(resumeFile.type)}
                                  <div className="text-left">
                                    <p 
                                      className="font-medium text-gray-900"
                                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    >
                                      {resumeFile.name}
                                    </p>
                                    <p 
                                      className="text-sm text-gray-500"
                                      style={{ fontFamily: 'Roboto, sans-serif' }}
                                    >
                                      {formatFileSize(resumeFile.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile("resume");
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center">
                              <span className="material-icons text-blue-600 text-2xl">cloud_upload</span>
                            </div>
                            <div>
                              <h3 
                                className="text-xl font-medium text-gray-900 mb-2"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                Drop your resume here
                              </h3>
                              <p 
                                className="text-gray-600 mb-4"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                Drag and drop your resume here, or click to browse files
                              </p>
                              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <span className="material-icons text-xs">info</span>
                                <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                                  Supports PDF, DOC, and DOCX files
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certificates Upload */}
                  <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                    <CardHeader className="p-8">
                      <CardTitle 
                        className="flex items-center gap-3 text-xl font-medium text-gray-900"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="material-icons text-white text-xl">military_tech</span>
                        </div>
                        Certificates & Awards
                        <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                      </CardTitle>
                      <CardDescription 
                        className="text-gray-600 text-lg mt-2"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Showcase your certifications and achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <div
                        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
                          isDragging 
                            ? "border-orange-500 bg-orange-50 shadow-lg transform scale-105" 
                            : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, "certificates")}
                        onClick={() => certificatesInputRef.current?.click()}
                      >
                        <input
                          ref={certificatesInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileInput(e, "certificates")}
                          className="hidden"
                        />
                        
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-orange-100 rounded-2xl mx-auto flex items-center justify-center">
                            <span className="material-icons text-orange-600 text-2xl">folder_open</span>
                          </div>
                          <div>
                            <h3 
                              className="text-xl font-medium text-gray-900 mb-2"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              Upload certificates
                            </h3>
                            <p 
                              className="text-gray-600 mb-4"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              Add multiple certificates, awards, or achievement documents
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                              <span className="material-icons text-xs">info</span>
                              <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                                Supports PDF, DOC, and image files (multiple files allowed)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {certificates.length > 0 && (
                        <div className="space-y-3">
                          <h4 
                            className="font-medium text-gray-900 mb-4"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            Uploaded Certificates ({certificates.length})
                          </h4>
                          {certificates.map((cert, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  {getFileIcon(cert.type)}
                                  <div>
                                    <p 
                                      className="font-medium text-gray-900"
                                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    >
                                      {cert.name}
                                    </p>
                                    <p 
                                      className="text-sm text-gray-500"
                                      style={{ fontFamily: 'Roboto, sans-serif' }}
                                    >
                                      {formatFileSize(cert.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-600"
                                  onClick={() => removeFile("certificate", index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Navigation Buttons */}
                  <Card className="border-0 rounded-3xl shadow-lg bg-white">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={onBack}
                          className="h-12 px-6 rounded-2xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          <span className="material-icons mr-2">arrow_back</span>
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={!isFormValid || isLoading}
                          className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Uploading Documents...
                            </>
                          ) : (
                            <>
                              <span className="material-icons mr-2">rocket_launch</span>
                              Complete Setup
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </div>

              {/* Right Column - Social Links & Info */}
              <div className="space-y-6">
                {/* Social Links Card */}
                <Card className="border-0 rounded-3xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                  <CardHeader className="p-6">
                    <CardTitle 
                      className="text-lg font-medium text-gray-900 flex items-center gap-2"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons text-purple-600">link</span>
                      Professional Links
                    </CardTitle>
                    <CardDescription 
                      className="text-gray-600 mt-2"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Connect your professional profiles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="space-y-3">
                      <Label 
                        htmlFor="linkedin"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={socialLinks.linkedin}
                        onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                        className="h-10 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label 
                        htmlFor="github"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <Github className="w-4 h-4 text-gray-900" />
                        GitHub Profile
                      </Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/yourusername"
                        value={socialLinks.github}
                        onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                        className="h-10 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-0"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label 
                        htmlFor="personal-portfolio"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <Globe className="w-4 h-4 text-green-600" />
                        Personal Portfolio
                      </Label>
                      <Input
                        id="personal-portfolio"
                        placeholder="https://yourwebsite.com"
                        value={socialLinks.portfolio}
                        onChange={(e) => handleSocialLinkChange("portfolio", e.target.value)}
                        className="h-10 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Info Card */}
                <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <span className="material-icons text-white">shield</span>
                      </div>
                      <div>
                        <h3 
                          className="text-lg font-medium text-gray-900 mb-2"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          Secure Upload
                        </h3>
                        <p 
                          className="text-sm text-gray-600"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          Your documents are encrypted and stored securely with enterprise-grade protection.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                        <span className="material-icons text-sm">verified</span>
                        <span style={{ fontFamily: 'Roboto, sans-serif' }}>SSL Encrypted</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Summary */}
                <Card className="border-0 rounded-3xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="material-icons text-white text-sm">auto_awesome</span>
                        </div>
                        <div>
                          <h3 
                            className="font-medium text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            Final Step!
                          </h3>
                          <p 
                            className="text-sm text-gray-600"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            Complete your profile setup
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ fontFamily: 'Roboto, sans-serif' }}>Profile completion</span>
                          <span className="font-medium text-blue-600">100%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DocumentUpload;
