import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// ❌ REMOVED: import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
// ❌ REMOVED: import { Eye, EyeOff, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
// ❌ REMOVED: import { signInWithGoogle } from "@/services/firebase";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Form Data:", formData);

    try {
      const res = await fetch("https://fastapi-backend-fixed-278398219986.asia-south1.run.app/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      if (!res.ok) throw new Error(`Sign-up failed: ${res.statusText}`);
      const data = await res.json();
      console.log("Sign-up success:", data);
      
      alert("Account created successfully!");
      localStorage.setItem("token", data.token);
      navigate("/onboarding");

    } catch (err) {
      console.error(err);
      alert("Sign-up failed. Check console for details.");
    }
  };

  // ❌ REMOVED: handleGoogleSignUp function

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

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center p-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/8 to-pink-400/8 blur-3xl" />
        </div>

        <Card className="w-full max-w-lg border-0 rounded-3xl shadow-2xl bg-white relative z-10">
          <CardHeader className="text-center space-y-6 p-12">
            {/* Google-style branding */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-2xl">person_add</span>
            </div>
            
            <div className="space-y-3">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Create Account
              </CardTitle>
              <CardDescription 
                className="text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Start your personalized career journey today
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            {/* ❌ REMOVED: Google Sign-Up Button */}
            {/* ❌ REMOVED: Google-style Divider */}

            {/* Email Sign-Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label 
                    htmlFor="firstName"
                    className="text-base font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      person
                    </span>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label 
                    htmlFor="lastName"
                    className="text-base font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="email"
                  className="text-base font-medium text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Email
                </Label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                    email
                  </span>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="password"
                  className="text-base font-medium text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-icons text-gray-500">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="confirmPassword"
                  className="text-base font-medium text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-icons text-gray-500">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))}
                  className="mt-0.5 rounded border-2 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  required
                />
                <Label 
                  htmlFor="agreeToTerms" 
                  className="text-sm text-gray-700 leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  I agree to the{" "}
                  <Link 
                    to="/terms" 
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link 
                    to="/privacy" 
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
                disabled={!formData.agreeToTerms}
              >
                Create Account
              </Button>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <span className="material-icons text-blue-600 text-lg mt-0.5">info</span>
                  <div>
                    <h4 
                      className="font-medium text-blue-900 mb-2"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Password Requirements
                    </h4>
                    <ul 
                      className="text-sm text-blue-700 space-y-1"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <li className="flex items-center space-x-2">
                        <span className="material-icons text-xs">check_circle</span>
                        <span>At least 8 characters long</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="material-icons text-xs">check_circle</span>
                        <span>Include numbers and letters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="material-icons text-xs">check_circle</span>
                        <span>Use both uppercase and lowercase</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="text-center p-12 pt-0">
            <p 
              className="text-base text-gray-600"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Already have an account?{" "}
              <Link 
                to="/sign-in" 
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Google-style Security Notice */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="material-icons text-green-500 text-sm">verified_user</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              Account creation is secure and encrypted
            </span>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignUp;
