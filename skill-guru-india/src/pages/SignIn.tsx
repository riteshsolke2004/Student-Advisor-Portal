import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { signInWithGoogle } from "@/services/firebase";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!res.ok) throw new Error(`Sign-in failed: ${res.statusText}`);
      const data = await res.json();
      console.log("Sign-in success:", data);

      // Use the auth context to login
      login({
        id: data.user?.id || data.id,
        email: data.user?.email || formData.email,
        name: data.user?.name || data.name,
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
        token: data.token
      });

      alert("Signed in successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Invalid Password, Please enter correct Password.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user, idToken } = await signInWithGoogle();

      const res = await fetch("http://127.0.0.1:8000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ name: user.displayName, email: user.email }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
      const data = await res.json();
      console.log("Backend response:", data);

      // Use the auth context to login
      login({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        firstName: data.user.firstName,
        lastName: data.user.lastName
      });

      alert(data.message);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      alert("Google Sign-In failed. Check console for details.");
    }
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

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center p-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/8 to-yellow-400/8 blur-3xl" />
        </div>

        <Card className="w-full max-w-md border-0 rounded-3xl shadow-2xl bg-white relative z-10">
          <CardHeader className="text-center space-y-6 p-12">
            {/* Google-style branding */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-white text-2xl">account_circle</span>
            </div>
            
            <div className="space-y-3">
              <CardTitle 
                className="text-3xl font-medium text-gray-900"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Welcome Back
              </CardTitle>
              <CardDescription 
                className="text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Sign in to continue your career journey
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-12 pt-0">
            {/* Google Sign-In Button - Official Design */}
            <Button
              variant="outline"
              className="w-full h-14 text-base border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-2xl shadow-sm hover:shadow-md"
              onClick={handleGoogleSignIn}
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Google-style Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="bg-white px-6 text-gray-500"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  or
                </span>
              </div>
            </div>

            {/* Email Sign-In Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-6">
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
                    className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm text-base transition-all duration-200"
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

              <div className="flex items-center justify-end">
                <ForgotPasswordDialog>
                  <button 
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Forgot password?
                  </button>
                </ForgotPasswordDialog>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center p-12 pt-0">
            <p 
              className="text-base text-gray-600"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Don't have an account?{" "}
              <Link 
                to="/sign-up" 
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Google-style Security Notice */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="material-icons text-green-500 text-sm">shield</span>
            <span style={{ fontFamily: 'Roboto, sans-serif' }}>
              Your information is protected by Google's security
            </span>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignIn;
