import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "./Layout";
import { ProgressIndicator } from "./ProgressIndicator";
import { ArrowRight, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import axios from "axios";

interface PersonalInfoFormProps {
  onNext: (email: string) => void;
  onBack?: () => void;
}

export const PersonalInfoForm = ({ onNext, onBack }: PersonalInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    dateOfBirth: "",
    gender: ""
  });

  // ✅ Handles all input changes and updates form state
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending form data:", formData);
    setIsLoading(true);

    try {
      // ✅ Payload shaped exactly like backend expects
      const payload = {
        personalInfo: {
          name: formData.fullName || "N/A",
          email: formData.email || "noemail@example.com",
          phone: formData.phone || "0000000000",
          location: formData.city || "N/A",
        },
        careerInfo: {
          currentRole: "N/A",
          industry: "N/A",
          expectedSalary: "N/A",
          preferredLocation: "N/A",
        },
      };

      const response = await axios.post(
        `https://student-advisor-portal.onrender.com/api/profile/?user_id=${formData.email}`,
        payload
      );

      console.log("✅ Form submitted successfully", response.data);
      onNext(formData.email);
    } catch (error) {
      if (error.response) {
        console.error("❌ Backend responded with:", error.response.data);
        if (error.response.data.detail) {
          error.response.data.detail.forEach((err) => {
            console.error(`Field: ${err.loc.join(" -> ")} | Issue: ${err.msg}`);
          });
        }
      } else {
        console.error("❌ Form submission failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

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
        currentStep={1} 
        totalSteps={4}
        stepLabels={["Personal Info", "Career Info", "Documents", "Dashboard"]}
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Google Material Progress Indicator - Mobile Responsive */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              {/* Desktop: Full step labels, Mobile: Compact dots */}
              <div className="hidden md:flex items-center space-x-4">
                {["Personal Info", "Career Info", "Documents"].map((label, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber === 1;
                  const isCompleted = stepNumber < 1;

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
                          stepNumber < 1 ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Compact Progress Dots */}
              <div className="flex md:hidden items-center space-x-2">
                {[1, 2, 3].map((step) => {
                  const isActive = step === 1;
                  const isCompleted = step < 1;

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
            <CardHeader className="text-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <span className="material-icons text-white text-2xl sm:text-3xl">person</span>
              </div>
              <CardTitle 
                className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 mb-3 sm:mb-4"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Personal Information
              </CardTitle>
              <CardDescription 
                className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Let's get to know you better. Please fill in your personal details to get 
                <span className="font-medium text-blue-600"> personalized recommendations</span>.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
                {/* Mobile-First Grid: Single column on mobile, 2 columns on tablet+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                  {/* Full Name */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="fullName" 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-purple-600 text-lg sm:text-xl">person</span>
                      Full Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="email" 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-red-600 text-lg sm:text-xl">email</span>
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="phone" 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-green-600 text-lg sm:text-xl">phone</span>
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="+91 98765 43210"
                        className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="city" 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-blue-600 text-lg sm:text-xl">location_on</span>
                      City *
                    </Label>
                    <div className="relative">
                      <Input
                        id="city"
                        type="text"
                        placeholder="Bangalore, Mumbai, Delhi..."
                        className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="dateOfBirth" 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-yellow-600 text-lg sm:text-xl">cake</span>
                      Date of Birth *
                    </Label>
                    <div className="relative">
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label 
                      htmlFor="gender" 
                      className="text-base sm:text-lg font-medium text-gray-900 flex items-center"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons mr-2 text-indigo-600 text-lg sm:text-xl">people</span>
                      Gender *
                    </Label>
                    <div className="relative">
                      <Select onValueChange={(value) => handleInputChange("gender", value)} required>
                        <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base sm:text-lg px-4 sm:px-6">
                          <SelectValue 
                            placeholder="Select your gender"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg">
                          <SelectItem value="male" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Male</SelectItem>
                          <SelectItem value="female" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Female</SelectItem>
                          <SelectItem value="other" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say" className="py-3 px-4 text-sm sm:text-base min-h-[44px]">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Privacy Notice - Mobile Optimized */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <span className="material-icons text-blue-600 text-lg sm:text-xl flex-shrink-0">info</span>
                    <div>
                      <h4 
                        className="font-medium text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        Privacy & Security
                      </h4>
                      <p 
                        className="text-blue-700 text-xs sm:text-sm leading-relaxed"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Your personal information is securely encrypted and will only be used to provide 
                        personalized career recommendations. We follow Google's privacy standards to protect your data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Actions - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-100">
                  {onBack && (
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
                  )}
                  <Button
                    type="submit"
                    className={`${onBack ? 'flex-1' : 'w-full'} h-12 sm:h-14 min-h-[44px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                        Saving...
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
            <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-white px-3 py-2 sm:px-4 rounded-full border border-gray-200 shadow-sm">
              <span className="material-icons text-green-500 text-sm sm:text-base">verified_user</span>
              <span style={{ fontFamily: 'Roboto, sans-serif' }} className="hidden sm:inline">
                Secure form powered by Google's infrastructure
              </span>
              <span style={{ fontFamily: 'Roboto, sans-serif' }} className="inline sm:hidden">
                Secure form
              </span>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
