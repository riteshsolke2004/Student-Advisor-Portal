import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CareerPaths from "./pages/CareerPaths";
import SkillsAnalysis from "./pages/SkillsAnalysis";
import ResumeBuilder from "./pages/ResumeBuilder";
import Mentorship from "./pages/Mentorship";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";
import Profile from "./pages/Profile";
import Dashboard from "@/components/Dashboard";
import Community from "./pages/Community";
import Onboarding  from "./pages/Onboarding";
import JobMarket from "./pages/JobMarket";
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AuthProvider>
        <Chatbot />
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/career-paths" element={<CareerPaths />} />
          <Route path="/skills-analysis" element={<SkillsAnalysis />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community/>} />
           <Route path="/onboarding" element={<Onboarding />} />
           <Route path="/job-market" element={<JobMarket />} />
          

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
