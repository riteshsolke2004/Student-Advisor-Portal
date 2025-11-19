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
  userEmail: string; // ✅ Fixed prop name to match your usage
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
    // Academic Background Fields (Required)
    educationLevel: "",
    fieldOfStudy: "",
    yearsOfExperience: "",
    interests: [] as string[],
    
    // Career Info Fields (Optional, will default to "N/A" in backend)
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
      // ✅ Structure payload to match backend expectations
      const payload = {
        careerInfo: {
          // Academic Background (Required fields)
          educationLevel: formData.educationLevel,
          fieldOfStudy: formData.fieldOfStudy,
          yearsOfExperience: formData.yearsOfExperience,
          interests: formData.interests,
          
          // Career Info (Optional fields)
          currentRole: formData.currentRole || "N/A",
          industry: formData.industry || "N/A",
          expectedSalary: formData.expectedSalary || "N/A",
          preferredLocation: formData.preferredLocation || "N/A",
        },
      };

      console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(
        `http://127.0.0.1:8000/api/career-form/academic-background/${userEmail}`,
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

      // Show success message
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
        <div className="max-w-3xl mx-auto">
          {/* Debug Info (Remove in production) */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Debug:</strong> Submitting for user: {userEmail}
            </p>
          </div>
          
          {/* Google Material Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
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
            </div>
          </div>

          {/* Google Forms-inspired Card */}
          <Card className="border-0 rounded-3xl shadow-lg bg-white overflow-hidden">
            <CardHeader className="text-center p-12 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="material-icons text-white text-3xl">work</span>
              </div>
              <CardTitle 
                className="text-3xl font-medium text-gray-900 mb-4"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Career Information
              </CardTitle>
              <CardDescription 
                className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Tell us about your educational background and career interests to get 
                <span className="font-medium text-blue-600"> personalized recommendations</span>.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Education Level */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="educationLevel" 
                    className="text-lg font-medium text-gray-900 flex items-center"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-blue-600">school</span>
                    Education Level / Grade *
                  </Label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleInputChange("educationLevel", value)} required>
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-lg">
                        <SelectValue 
                          placeholder="Select your education level"
                          className="text-gray-500"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                        <SelectItem value="high-school" className="py-3 px-4 text-base">High School</SelectItem>
                        <SelectItem value="associate" className="py-3 px-4 text-base">Associate Degree</SelectItem>
                        <SelectItem value="bachelor" className="py-3 px-4 text-base">Bachelor's Degree</SelectItem>
                        <SelectItem value="master" className="py-3 px-4 text-base">Master's Degree</SelectItem>
                        <SelectItem value="phd" className="py-3 px-4 text-base">PhD</SelectItem>
                        <SelectItem value="other" className="py-3 px-4 text-base">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Field of Study */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="fieldOfStudy" 
                    className="text-lg font-medium text-gray-900 flex items-center"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-green-600">menu_book</span>
                    Branch / Field of Study *
                  </Label>
                  <div className="relative">
                    <Input
                      id="fieldOfStudy"
                      type="text"
                      placeholder="e.g., Computer Science, Business Administration"
                      className="h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-lg px-6"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="yearsOfExperience" 
                    className="text-lg font-medium text-gray-900 flex items-center"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2 text-purple-600">work_history</span>
                    Years of Experience *
                  </Label>
                  <div className="relative">
                    <Select onValueChange={(value) => handleInputChange("yearsOfExperience", value)} required>
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-lg">
                        <SelectValue 
                          placeholder="Select years of experience"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2 border-gray-200 shadow-lg">
                        <SelectItem value="0" className="py-3 px-4 text-base">Fresh Graduate / No Experience</SelectItem>
                        <SelectItem value="1-2" className="py-3 px-4 text-base">1-2 years</SelectItem>
                        <SelectItem value="3-5" className="py-3 px-4 text-base">3-5 years</SelectItem>
                        <SelectItem value="6-10" className="py-3 px-4 text-base">6-10 years</SelectItem>
                        <SelectItem value="10+" className="py-3 px-4 text-base">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interests & Career Areas */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label 
                      className="text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-red-500">favorite</span>
                      Interests & Career Areas *
                    </Label>
                    <p 
                      className="text-gray-600 leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Select or add your areas of interest to help us provide better recommendations.
                    </p>
                  </div>

                  {/* Current Interest Tags */}
                  {formData.interests.length > 0 && (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <h4 
                        className="text-sm font-medium text-gray-700 mb-3"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        Your Interests ({formData.interests.length})
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {formData.interests.map((interest) => (
                          <Badge 
                            key={interest} 
                            className="bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-200 transition-colors duration-200 group"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="ml-2 hover:text-red-600 transition-colors duration-200"
                            >
                              <span className="material-icons text-sm">close</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Interest */}
                  <div className="space-y-4">
                    <h4 
                      className="text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Add Interest
                    </h4>
                    <div className="flex gap-3">
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
                        className="flex-1 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addInterest(newInterest)}
                        disabled={!newInterest.trim()}
                        className="h-12 px-6 rounded-2xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        <span className="material-icons mr-2">add</span>
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Suggested Interests */}
                  <div className="space-y-4">
                    <h4 
                      className="text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Popular Interests
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {interestOptions
                        .filter(option => !formData.interests.includes(option))
                        .slice(0, 12)
                        .map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant="outline"
                            onClick={() => addInterest(interest)}
                            className="h-12 rounded-2xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            <span className="material-icons mr-2 text-sm">add_circle_outline</span>
                            {interest}
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Optional Career Fields Section */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="space-y-3">
                    <Label 
                      className="text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-orange-500">work</span>
                      Additional Career Information
                      <span className="text-sm text-gray-500 ml-2">(Optional)</span>
                    </Label>
                    <p 
                      className="text-gray-600 leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Provide additional details about your career to get more personalized recommendations.
                    </p>
                  </div>

                  {/* Current Role */}
                  <div className="space-y-3">
                    <Label 
                      htmlFor="currentRole" 
                      className="text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Current Role/Position
                    </Label>
                    <Input
                      id="currentRole"
                      type="text"
                      placeholder="e.g., Software Developer, Student, Manager"
                      className="h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.currentRole}
                      onChange={(e) => handleInputChange("currentRole", e.target.value)}
                    />
                  </div>

                  {/* Industry */}
                  <div className="space-y-3">
                    <Label 
                      htmlFor="industry" 
                      className="text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                    />
                  </div>

                  {/* Expected Salary */}
                  <div className="space-y-3">
                    <Label 
                      htmlFor="expectedSalary" 
                      className="text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Expected Salary Range
                    </Label>
                    <Input
                      id="expectedSalary"
                      type="text"
                      placeholder="e.g., $50,000 - $70,000, ₹5-8 LPA"
                      className="h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.expectedSalary}
                      onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                    />
                  </div>

                  {/* Preferred Location */}
                  <div className="space-y-3">
                    <Label 
                      htmlFor="preferredLocation" 
                      className="text-base font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Preferred Work Location
                    </Label>
                    <Input
                      id="preferredLocation"
                      type="text"
                      placeholder="e.g., Remote, New York, Mumbai, Flexible"
                      className="h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm px-4"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      value={formData.preferredLocation}
                      onChange={(e) => handleInputChange("preferredLocation", e.target.value)}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-14 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-lg"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <span className="material-icons mr-2">arrow_back</span>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Saving Career Info...
                      </>
                    ) : (
                      <>
                        Continue
                        <span className="material-icons ml-2">arrow_forward</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Google-style Help Text */}
          <div className="text-center mt-8">
            <p 
              className="text-gray-500 text-sm"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <span className="material-icons mr-1 text-sm">info</span>
              Your information is secure and will only be used to provide personalized career recommendations.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};