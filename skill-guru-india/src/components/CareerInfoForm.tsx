import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layout } from "./Layout";
import { ProgressIndicator } from "./ProgressIndicator";
import { ArrowRight, GraduationCap, BookOpen, Briefcase, Heart, X } from "lucide-react";
import axios from "axios";

interface CareerInfoFormProps {
  onNext: () => void;
  onBack: () => void;
  userEmail: string;
}

const interestOptions = [
  "Software Development", "Data Science", "Machine Learning", "UI/UX Design",
  "Product Management", "Marketing", "Finance", "Healthcare", "Education",
  "Research", "Consulting", "Sales", "Operations", "Human Resources",
  "Cybersecurity", "Cloud Computing", "Mobile Development", "DevOps",
  "Artificial Intelligence", "Blockchain", "Digital Marketing", "Content Creation"
];

export const CareerInfoForm = ({ onNext, onBack, userEmail }: CareerInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: "",
    fieldOfStudy: "",
    yearsOfExperience: "",
    interests: [] as string[],
    currentRole: "",
    industry: "",
    expectedSalary: "",
    preferredLocation: "",
  });
  const [newInterest, setNewInterest] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({ 
        ...prev, 
        interests: [...prev.interests, interest] 
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    console.log("🚀 Starting career form submission for:", userEmail);
    setIsLoading(true);

    try {
      const payload = {
        careerInfo: {
          educationLevel: formData.educationLevel,
          fieldOfStudy: formData.fieldOfStudy,
          yearsOfExperience: formData.yearsOfExperience,
          interests: formData.interests,
          currentRole: formData.currentRole || "N/A",
          industry: formData.industry || "N/A",
          expectedSalary: formData.expectedSalary || "N/A",
          preferredLocation: formData.preferredLocation || "N/A",
        },
      };

      console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(
        `https://student-advisor-portal.onrender.com/api/career-form/academic-background/${userEmail}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(`Failed to submit career form: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Career info updated successfully:", result);

      alert("Career information saved successfully!");
      onNext();
    } catch (error) {
      console.error("❌ Failed to update career info:", error);
      alert(`Error submitting career info: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.educationLevel && formData.fieldOfStudy && 
                     formData.yearsOfExperience && formData.interests.length > 0;

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

      <Layout 
        showProgress 
        currentStep={2} 
        totalSteps={4}
        stepLabels={["Personal Info", "Career Info", "Documents", "Dashboard"]}
      >
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          
          {/* Google Material Progress Indicator - Mobile Responsive */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              {/* Desktop: Full step labels */}
              <div className="hidden md:flex items-center space-x-4">
                {["Personal Info", "Career Info", "Documents"].map((label, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber === 2;
                  const isCompleted = stepNumber < 2;

                  return (
                    <div key={index} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg' 
                            : isActive 
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg ring-4 ring-blue-100' 
                              : 'bg-gray-200 border-2 border-gray-300'
                        }`}>
                          {isCompleted ? (
                            <span className="material-icons text-white text-lg">check</span>
                          ) : (
                            <span className={`font-medium ${
                              isActive ? 'text-white' : 'text-gray-500'
                            }`} style={{ fontFamily: 'Google Sans, sans-serif' }}>
                              {stepNumber}
                            </span>
                          )}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`} style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {label}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className={`w-20 h-0.5 mx-6 transition-all duration-300 ${
                          stepNumber < 2 ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Compact Progress Dots */}
              <div className="flex md:hidden items-center space-x-2">
                {[1, 2, 3].map((step) => {
                  const isActive = step === 2;
                  const isCompleted = step < 2;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-green-500 to-green-600' 
                          : isActive 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-200' 
                            : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <span className="material-icons text-white text-sm">check</span>
                        ) : (
                          <span className={`text-xs font-medium ${
                            isActive ? 'text-white' : 'text-gray-600'
                          }`}>
                            {step}
                          </span>
                        )}
                      </div>
                      <span className={`mt-1 text-xs font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`} style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Step {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Google Forms-inspired Card - Mobile Responsive */}
          <Card className="border-0 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg bg-white overflow-hidden">
            <CardHeader className="text-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="material-icons text-white text-2xl sm:text-3xl">work</span>
              </div>
              <CardTitle 
                className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 mb-3 sm:mb-4"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Career Information
              </CardTitle>
              <CardDescription 
                className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Tell us about your educational background and career interests to get 
                <span className="font-medium text-blue-600"> personalized recommendations</span>.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Education Level */}
                <div className="space-y-2 sm:space-y-3">
                  <Label 
                    htmlFor="educationLevel" 
                    className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-blue-600 text-lg sm:text-xl">school</span>
                    Education Level / Grade *
                  </Label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleInputChange("educationLevel", value)} required>
                      <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg">
                        <SelectValue 
                          placeholder="Select your education level"
                          className="text-gray-500"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg">
                        <SelectItem value="high-school" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">High School</SelectItem>
                        <SelectItem value="associate" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Associate Degree</SelectItem>
                        <SelectItem value="bachelor" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Bachelor's Degree</SelectItem>
                        <SelectItem value="master" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Master's Degree</SelectItem>
                        <SelectItem value="phd" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">PhD</SelectItem>
                        <SelectItem value="other" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Field of Study */}
                <div className="space-y-2 sm:space-y-3">
                  <Label 
                    htmlFor="fieldOfStudy" 
                    className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-green-600 text-lg sm:text-xl">menu_book</span>
                    Branch / Field of Study *
                  </Label>
                  <div className="relative">
                    <Input
                      id="fieldOfStudy"
                      type="text"
                      placeholder="e.g., Computer Science, Business"
                      className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2 sm:space-y-3">
                  <Label 
                    htmlFor="yearsOfExperience" 
                    className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-purple-600 text-lg sm:text-xl">work_history</span>
                    Years of Experience *
                  </Label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleInputChange("yearsOfExperience", value)} required>
                      <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg">
                        <SelectValue 
                          placeholder="Select years of experience"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg">
                        <SelectItem value="0" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Fresh Graduate / No Experience</SelectItem>
                        <SelectItem value="1-2" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">1-2 years</SelectItem>
                        <SelectItem value="3-5" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">3-5 years</SelectItem>
                        <SelectItem value="6-10" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">6-10 years</SelectItem>
                        <SelectItem value="10+" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interests & Career Areas - Mobile Optimized */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-red-500 text-lg sm:text-xl">favorite</span>
                      Interests & Career Areas *
                    </Label>
                    <p 
                      className="text-xs sm:text-sm text-gray-600 leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Select or add your areas of interest to help us provide better recommendations.
                    </p>
                  </div>

                  {/* Current Interest Tags - Mobile Responsive */}
                  {formData.interests.length > 0 && (
                    <div className="p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
                      <h4 
                        className="text-xs sm:text-sm font-medium text-gray-700 mb-3"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        Your Interests ({formData.interests.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest) => (
                          <Badge 
                            key={interest} 
                            className="bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-blue-200 transition-colors duration-200 group flex items-center gap-1"
                          >
                            <span className="truncate max-w-[120px] sm:max-w-none">{interest}</span>
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="ml-1 hover:text-red-600 transition-colors duration-200 flex-shrink-0 min-w-[20px] min-h-[20px] flex items-center justify-center"
                              aria-label={`Remove ${interest}`}
                            >
                              <span className="material-icons text-xs sm:text-sm">close</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Interest - Mobile Responsive */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 
                      className="text-sm sm:text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Add Interest
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Input
                        type="text"
                        placeholder="Type your interest..."
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInterest(newInterest);
                          }
                        }}
                        className="flex-1 h-11 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4 text-sm sm:text-base"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addInterest(newInterest)}
                        disabled={!newInterest.trim()}
                        className="w-full sm:w-auto h-11 sm:h-12 min-h-[44px] px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <span className="material-icons mr-2 text-lg">add</span>
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Suggested Interests - Mobile Grid */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 
                      className="text-sm sm:text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Popular Interests
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {interestOptions
                        .filter(option => !formData.interests.includes(option))
                        .slice(0, 12)
                        .map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant="outline"
                            onClick={() => addInterest(interest)}
                            className="h-11 sm:h-12 min-h-[44px] rounded-xl sm:rounded-2xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-xs sm:text-sm justify-start px-3 sm:px-4"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            <span className="material-icons mr-2 text-sm sm:text-base">add_circle_outline</span>
                            <span className="truncate">{interest}</span>
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Optional Career Fields Section - Mobile Responsive */}
                <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center flex-wrap gap-2"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="flex items-center">
                        <span className="material-icons mr-2 text-orange-500 text-lg sm:text-xl">work</span>
                        Additional Career Information
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">(Optional)</span>
                    </Label>
                    <p 
                      className="text-xs sm:text-sm text-gray-600 leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Provide additional details about your career to get more personalized recommendations.
                    </p>
                  </div>

                  {/* Current Role */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="currentRole" 
                      className="text-sm sm:text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Current Role/Position
                    </Label>
                    <Input
                      id="currentRole"
                      type="text"
                      placeholder="e.g., Software Developer, Student"
                      className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4 text-sm sm:text-base"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.currentRole}
                      onChange={(e) => handleInputChange("currentRole", e.target.value)}
                    />
                  </div>

                  {/* Industry */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="industry" 
                      className="text-sm sm:text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="e.g., Technology, Healthcare"
                      className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4 text-sm sm:text-base"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                    />
                  </div>

                  {/* Expected Salary */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="expectedSalary" 
                      className="text-sm sm:text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Expected Salary Range
                    </Label>
                    <Input
                      id="expectedSalary"
                      type="text"
                      placeholder="e.g., $50k-$70k, ₹5-8 LPA"
                      className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4 text-sm sm:text-base"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.expectedSalary}
                      onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                    />
                  </div>

                  {/* Preferred Location */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="preferredLocation" 
                      className="text-sm sm:text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Preferred Work Location
                    </Label>
                    <Input
                      id="preferredLocation"
                      type="text"
                      placeholder="e.g., Remote, New York, Mumbai"
                      className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4 text-sm sm:text-base"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.preferredLocation}
                      onChange={(e) => handleInputChange("preferredLocation", e.target.value)}
                    />
                  </div>
                </div>

                {/* Form Actions - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-12 sm:h-14 min-h-[44px] rounded-xl sm:rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-base sm:text-lg"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-lg sm:text-xl">arrow_back</span>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 sm:h-14 min-h-[44px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                        <span className="hidden sm:inline">Saving Career Info...</span>
                        <span className="inline sm:hidden">Saving...</span>
                      </>
                    ) : (
                      <>
                        Continue
                        <span className="material-icons ml-2 text-lg sm:text-xl">arrow_forward</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Google-style Help Text - Mobile Responsive */}
          <div className="text-center mt-4 sm:mt-6 lg:mt-8">
            <p 
              className="text-gray-500 text-xs sm:text-sm flex items-center justify-center flex-wrap gap-1"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <span className="material-icons text-xs sm:text-sm">info</span>
              <span className="hidden sm:inline">Your information is secure and will only be used to provide personalized career recommendations.</span>
              <span className="inline sm:hidden">Your information is secure.</span>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};
