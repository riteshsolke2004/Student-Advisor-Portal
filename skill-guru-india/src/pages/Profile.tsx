import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { profileService, UserProfile } from "../services/ProfileService";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Award, 
  Edit2, 
  Save, 
  X,
  Plus,
  Trash2,
  Camera,
  Star,
  Calendar,
  Code,
  Brain,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  name: string;
  level: number;
  category: 'technical' | 'soft';
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface Achievement {
  title: string;
  description: string;
  date: string;
}

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  // Dynamic profile state - starts empty and loads from API
  const [profile, setProfile] = useState<UserProfile & {
    skills: Skill[];
    education: Education[];
    achievements: Achievement[];
    careerGoals: {
      shortTerm: string;
      longTerm: string;
      interests: string[];
    };
  }>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: ""
    },
    careerInfo: {
      currentRole: "",
      industry: "",
      expectedSalary: "",
      preferredLocation: ""
    },
    academicBackground: {
      educationLevel: "",
      fieldOfStudy: "",
      yearsOfExperience: "",
      interests: []
    },
    skills: [],
    education: [],
    achievements: [],
    careerGoals: {
      shortTerm: "",
      longTerm: "",
      interests: []
    }
  });

  const [newSkill, setNewSkill] = useState<{ name: string; level: number; category: 'technical' | 'soft' }>({ 
    name: "", 
    level: 50, 
    category: 'technical' 
  });
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", year: "", grade: "" });
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "", date: "" });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load user profile from API
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);
        
        // Check if profile exists
        const exists = await profileService.checkProfileExists(user.email);
        setProfileExists(exists);

        if (exists) {
          // Load existing profile
          const userProfile = await profileService.getUserProfile(user.email);
          
          if (userProfile) {
            // Map API data to local state
            setProfile({
              personalInfo: {
                name: userProfile.personalInfo.name || user.name || '',
                email: userProfile.personalInfo.email || user.email,
                phone: userProfile.personalInfo.phone || '',
                location: userProfile.personalInfo.location || ''
              },
              careerInfo: {
                currentRole: userProfile.careerInfo.currentRole || '',
                industry: userProfile.careerInfo.industry || '',
                expectedSalary: userProfile.careerInfo.expectedSalary || '',
                preferredLocation: userProfile.careerInfo.preferredLocation || ''
              },
              academicBackground: {
                educationLevel: userProfile.academicBackground.educationLevel || '',
                fieldOfStudy: userProfile.academicBackground.fieldOfStudy || '',
                yearsOfExperience: userProfile.academicBackground.yearsOfExperience || '',
                interests: userProfile.academicBackground.interests || []
              },
              // Default empty arrays for fields not in your current API
              skills: [],
              education: [],
              achievements: [],
              careerGoals: {
                shortTerm: "",
                longTerm: "",
                interests: userProfile.academicBackground.interests || []
              }
            });
            
            toast({
              title: "Profile Loaded",
              description: "Your profile has been loaded successfully.",
            });
          }
        } else {
          // No profile exists, use default with user auth data
          setProfile(prev => ({
            ...prev,
            personalInfo: {
              name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              email: user.email,
              phone: '',
              location: ''
            }
          }));
          
          toast({
            title: "Welcome!",
            description: "Complete your profile to get personalized recommendations.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  const handleSave = async (section: string) => {
    if (!user?.email) return;

    try {
      setIsSaving(true);
      
      // Create profile data to send to API
      const profileData: UserProfile = {
        personalInfo: profile.personalInfo,
        careerInfo: profile.careerInfo,
        academicBackground: profile.academicBackground
      };

      if (profileExists) {
        // Update existing profile
        await profileService.updateUserProfile(user.email, profileData);
      } else {
        // Create new profile
        await profileService.createUserProfile(user.email, profileData);
        setProfileExists(true);
      }

      setEditSection(null);
      toast({
        title: "Profile Updated",
        description: `${section} information has been saved successfully.`,
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Skills management (local state only for now)
  const addSkill = () => {
    if (newSkill.name.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill }]
      }));
      setNewSkill({ name: "", level: 50, category: 'technical' });
    }
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setProfile(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }));
      setNewEducation({ degree: "", institution: "", year: "", grade: "" });
    }
  };

  const addAchievement = () => {
    if (newAchievement.title.trim()) {
      setProfile(prev => ({
        ...prev,
        achievements: [...prev.achievements, { ...newAchievement }]
      }));
      setNewAchievement({ title: "", description: "", date: "" });
    }
  };

  const EditableField = ({ 
    value, 
    onChange, 
    type = "text", 
    multiline = false,
    placeholder = ""
  }: {
    value: string;
    onChange: (value: string) => void;
    type?: string;
    multiline?: boolean;
    placeholder?: string;
  }) => {
    if (multiline) {
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-20 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        />
      );
    }
    return (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-white shadow-sm"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      />
    );
  };

  const getSkillColor = (level: number) => {
    if (level >= 80) return "bg-gradient-to-r from-green-500 to-green-600";
    if (level >= 60) return "bg-gradient-to-r from-blue-500 to-blue-600";
    if (level >= 40) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  // Show loading screen
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Loading Your Profile
            </h2>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Please wait while we fetch your information...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Check if profile is empty
  const isEmptyProfile = !profile.personalInfo.name && 
                       !profile.careerInfo.currentRole && 
                       !profile.academicBackground.fieldOfStudy;

  // Replace ONLY the return statement starting from line ~400 (after all the functions)
// Find: return (
// Replace everything from return ( until the closing export default Profile;

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

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <Header />
      
      {/* Welcome Banner for New Users - Mobile Responsive */}
      {isEmptyProfile && !isEditing && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-medium mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                  Welcome, {user?.firstName || 'User'}!
                </h2>
                <p className="text-blue-100 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Complete your profile to get personalized recommendations.
                </p>
              </div>
              <Button 
                onClick={() => setIsEditing(true)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 h-11 sm:h-12 px-4 sm:px-6 rounded-full shadow-lg w-full sm:w-auto"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-2 text-lg">edit</span>
                Complete Profile
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section - Mobile Responsive */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Profile Picture & Basic Info */}
            <div className="flex flex-col items-center text-center lg:text-left">
              <div className="relative group mb-4 sm:mb-6">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Avatar className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40 ring-4 ring-white/30 shadow-2xl">
                  <AvatarImage src="" />
                  <AvatarFallback 
                    className="text-2xl sm:text-3xl bg-gradient-to-br from-white to-gray-100 text-blue-600 shadow-lg"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {profile.personalInfo.name ? 
                      profile.personalInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 
                      'U'
                    }
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                  >
                    <span className="material-icons text-lg sm:text-xl">photo_camera</span>
                  </Button>
                )}
              </div>
              
              <div className="space-y-2 sm:space-y-3 text-white">
                <h1 
                  className="text-2xl sm:text-3xl lg:text-5xl font-medium"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {profile.personalInfo.name || 'Complete Your Profile'}
                </h1>
                <p 
                  className="text-base sm:text-lg lg:text-xl text-blue-100 font-medium"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {profile.careerInfo.currentRole || 'Add your professional role'}
                </p>
                {profile.personalInfo.location && (
                  <div className="flex items-center gap-2 text-blue-100 justify-center lg:justify-start">
                    <span className="material-icons text-base sm:text-lg">location_on</span>
                    <span className="text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {profile.personalInfo.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Cards - Mobile Grid */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center border border-white/20 shadow-lg">
                <div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {profile.academicBackground.yearsOfExperience || '0+'}
                </div>
                <div 
                  className="text-blue-100 text-xs sm:text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Years Experience
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center border border-white/20 shadow-lg">
                <div 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {profile.academicBackground.interests.length}
                </div>
                <div 
                  className="text-blue-100 text-xs sm:text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Interests
                </div>
              </div>

              {/* Third stat - hidden on mobile, shown on lg */}
              <div className="hidden lg:block bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-lg">
                <div 
                  className="text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {profile.skills.length}
                </div>
                <div 
                  className="text-blue-100 text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Skills
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="lg:ml-8 w-full lg:w-auto">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                size="lg"
                disabled={isSaving}
                className={`h-11 sm:h-12 lg:h-14 px-6 sm:px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 w-full lg:w-auto ${
                  isEditing 
                    ? 'bg-white text-blue-600 hover:bg-gray-50' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <span className="material-icons mr-2 text-lg">close</span>
                    Cancel Editing
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2 text-lg">edit</span>
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Tabs defaultValue="overview" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 bg-gray-100 p-1 rounded-full">
            <TabsTrigger 
              value="overview"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base"
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            >
              <span className="material-icons mr-1 sm:mr-2 text-sm sm:text-base">dashboard</span>
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="academic"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base"
              style={{ fontFamily: 'Google Sans, sans-serif' }}
            >
              <span className="material-icons mr-1 sm:mr-2 text-sm sm:text-base">school</span>
              Academic
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Mobile Responsive */}
          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Personal Information Card */}
              <Card className="border-0 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg bg-white">
                <CardHeader className="p-4 sm:p-6 lg:p-8">
                  <CardTitle 
                    className="flex items-center gap-3 sm:gap-4 text-lg sm:text-xl lg:text-2xl font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="material-icons text-white text-lg sm:text-xl">person</span>
                    </div>
                    <span>Personal Info</span>
                    {editSection !== "personal" && isEditing && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditSection("personal")} 
                        className="ml-auto rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <span className="material-icons text-lg">edit</span>
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 lg:p-8 pt-0 space-y-4 sm:space-y-6">
                  {editSection === "personal" ? (
                    <div className="space-y-4 sm:space-y-6">
                      <EditableField
                        value={profile.personalInfo.name}
                        onChange={(value) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, name: value } }))}
                        placeholder="Full Name"
                      />
                      <EditableField
                        value={profile.personalInfo.email}
                        onChange={(value) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: value } }))}
                        type="email"
                        placeholder="Email"
                      />
                      <EditableField
                        value={profile.personalInfo.phone}
                        onChange={(value) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: value } }))}
                        type="tel"
                        placeholder="Phone"
                      />
                      <EditableField
                        value={profile.personalInfo.location}
                        onChange={(value) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: value } }))}
                        placeholder="Location"
                      />
                      <Button 
                        onClick={() => handleSave("Personal")} 
                        disabled={isSaving}
                        className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <span className="material-icons mr-2">save</span>
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {profile.personalInfo.name || profile.personalInfo.phone ? (
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {profile.personalInfo.email && (
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-200">
                              <span className="material-icons text-blue-600 text-lg sm:text-xl flex-shrink-0">email</span>
                              <span 
                                className="text-gray-700 text-sm sm:text-base truncate"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                {profile.personalInfo.email}
                              </span>
                            </div>
                          )}
                          {profile.personalInfo.phone && (
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-200">
                              <span className="material-icons text-green-600 text-lg sm:text-xl flex-shrink-0">phone</span>
                              <span 
                                className="text-gray-700 text-sm sm:text-base"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                {profile.personalInfo.phone}
                              </span>
                            </div>
                          )}
                          {profile.personalInfo.location && (
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-200">
                              <span className="material-icons text-purple-600 text-lg sm:text-xl flex-shrink-0">location_on</span>
                              <span 
                                className="text-gray-700 text-sm sm:text-base"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                {profile.personalInfo.location}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 text-center">
                          <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            Add your personal information
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Tab - Mobile Responsive */}
          <TabsContent value="academic" className="space-y-6 sm:space-y-8">
            <Card className="border-0 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg bg-white">
              <CardHeader className="p-4 sm:p-6 lg:p-8">
                <CardTitle 
                  className="flex items-center gap-3 sm:gap-4 text-lg sm:text-xl lg:text-2xl font-medium text-gray-900"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="material-icons text-white text-lg sm:text-xl">school</span>
                  </div>
                  <span>Academic Background</span>
                  {editSection !== "academic" && isEditing && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditSection("academic")} 
                      className="ml-auto rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <span className="material-icons text-lg">edit</span>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8 pt-0 space-y-4 sm:space-y-6">
                {editSection === "academic" ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label 
                        className="text-sm font-medium mb-2 block text-gray-900"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        Education Level
                      </label>
                      <select
                        value={profile.academicBackground.educationLevel}
                        onChange={(e) => setProfile(prev => ({ ...prev, academicBackground: { ...prev.academicBackground, educationLevel: e.target.value } }))}
                        className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 bg-white shadow-sm px-4"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <option value="">Select Education Level</option>
                        <option value="high_school">High School</option>
                        <option value="associate">Associate Degree</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD</option>
                      </select>
                    </div>
                    <EditableField
                      value={profile.academicBackground.fieldOfStudy}
                      onChange={(value) => setProfile(prev => ({ ...prev, academicBackground: { ...prev.academicBackground, fieldOfStudy: value } }))}
                      placeholder="Field of Study"
                    />
                    <EditableField
                      value={profile.academicBackground.yearsOfExperience}
                      onChange={(value) => setProfile(prev => ({ ...prev, academicBackground: { ...prev.academicBackground, yearsOfExperience: value } }))}
                      placeholder="Years of Experience"
                    />
                    <Button 
                      onClick={() => handleSave("Academic")} 
                      disabled={isSaving}
                      className="w-full h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full shadow-lg"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="material-icons mr-2">save</span>
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {profile.academicBackground.educationLevel || profile.academicBackground.fieldOfStudy ? (
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {profile.academicBackground.educationLevel && (
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-200">
                            <div 
                              className="text-xs sm:text-sm text-gray-600 mb-1"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              Education Level
                            </div>
                            <div 
                              className="font-medium text-gray-900 capitalize text-sm sm:text-base"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              {profile.academicBackground.educationLevel.replace('_', ' ')}
                            </div>
                          </div>
                        )}
                        {profile.academicBackground.fieldOfStudy && (
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200">
                            <div 
                              className="text-xs sm:text-sm text-gray-600 mb-1"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              Field of Study
                            </div>
                            <div 
                              className="font-medium text-gray-900 text-sm sm:text-base"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              {profile.academicBackground.fieldOfStudy}
                            </div>
                          </div>
                        )}
                        {profile.academicBackground.yearsOfExperience && (
                          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-50 border border-green-200">
                            <div 
                              className="text-xs sm:text-sm text-gray-600 mb-1"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              Experience
                            </div>
                            <div 
                              className="font-medium text-gray-900 text-sm sm:text-base"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              {profile.academicBackground.yearsOfExperience} years
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 text-center">
                        <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Add your academic background
                        </p>
                      </div>
                    )}

                    {/* Interests */}
                    {profile.academicBackground.interests.length > 0 && (
                      <div>
                        <h4 
                          className="font-medium text-base sm:text-lg mb-3 sm:mb-4 text-gray-900 flex items-center gap-2"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          <span className="material-icons text-green-600 text-lg sm:text-xl">interests</span>
                          Areas of Interest
                        </h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {profile.academicBackground.interests.map((interest, index) => (
                            <Badge 
                              key={index} 
                              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 border border-gray-200 rounded-full shadow-sm"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </>
);

};

export default Profile;
