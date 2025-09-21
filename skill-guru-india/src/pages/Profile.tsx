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
        
        {/* Welcome Banner for New Users */}
        {isEmptyProfile && !isEditing && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                    Welcome to your Profile, {user?.firstName || 'User'}!
                  </h2>
                  <p className="text-blue-100" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Complete your profile to get personalized career recommendations.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsEditing(true)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-6 rounded-full shadow-lg"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  <span className="material-icons mr-2">edit</span>
                  Complete Profile
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          </div>
          
          <div className="relative container mx-auto px-8 py-16">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Profile Picture & Basic Info */}
              <div className="flex flex-col items-center text-center lg:text-left">
                <div className="relative group mb-6">
                  <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <Avatar className="relative h-40 w-40 ring-4 ring-white/30 shadow-2xl">
                    <AvatarImage src="" />
                    <AvatarFallback 
                      className="text-3xl bg-gradient-to-br from-white to-gray-100 text-blue-600 shadow-lg"
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
                      className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                    >
                      <span className="material-icons">photo_camera</span>
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3 text-white">
                  <h1 
                    className="text-4xl lg:text-5xl font-medium"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {profile.personalInfo.name || 'Complete Your Profile'}
                  </h1>
                  <p 
                    className="text-xl text-blue-100 font-medium"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {profile.careerInfo.currentRole || 'Add your professional role'}
                  </p>
                  {profile.personalInfo.location && (
                    <div className="flex items-center gap-2 text-blue-100 justify-center lg:justify-start">
                      <span className="material-icons text-lg">location_on</span>
                      <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {profile.personalInfo.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-lg">
                  <div 
                    className="text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {profile.academicBackground.yearsOfExperience || '0+'}
                  </div>
                  <div 
                    className="text-blue-100"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Years Experience
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-lg">
                  <div 
                    className="text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {profile.skills.length}
                  </div>
                  <div 
                    className="text-blue-100"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Skills
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-lg">
                  <div 
                    className="text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    {profile.academicBackground.interests.length}
                  </div>
                  <div 
                    className="text-blue-100"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Interests
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="lg:ml-8">
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  size="lg"
                  disabled={isSaving}
                  className={`h-14 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isEditing 
                      ? 'bg-white text-blue-600 hover:bg-gray-50' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <span className="material-icons mr-2">close</span>
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2">edit</span>
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-12">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-gray-100 p-1 rounded-full">
              <TabsTrigger 
                value="overview"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-2 text-base">dashboard</span>
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="academic"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-2 text-base">school</span>
                Academic
              </TabsTrigger>
              <TabsTrigger 
                value="career"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-2 text-base">work</span>
                Career
              </TabsTrigger>
              <TabsTrigger 
                value="skills"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                <span className="material-icons mr-2 text-base">psychology</span>
                Skills
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Personal Information Card */}
                <Card className="border-0 rounded-3xl shadow-lg bg-white">
                  <CardHeader className="p-8">
                    <CardTitle 
                      className="flex items-center gap-4 text-2xl font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="material-icons text-white text-xl">person</span>
                      </div>
                      Personal Information
                      {editSection !== "personal" && isEditing && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditSection("personal")} 
                          className="ml-auto rounded-full h-10 w-10 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="material-icons">edit</span>
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    {editSection === "personal" ? (
                      <div className="space-y-6">
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
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg"
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
                      <div className="space-y-6">
                        {profile.personalInfo.name || profile.personalInfo.phone ? (
                          <div className="grid grid-cols-1 gap-4">
                            {profile.personalInfo.email && (
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                <span className="material-icons text-blue-600">email</span>
                                <span 
                                  className="text-gray-700"
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {profile.personalInfo.email}
                                </span>
                              </div>
                            )}
                            {profile.personalInfo.phone && (
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                <span className="material-icons text-green-600">phone</span>
                                <span 
                                  className="text-gray-700"
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {profile.personalInfo.phone}
                                </span>
                              </div>
                            )}
                            {profile.personalInfo.location && (
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                <span className="material-icons text-purple-600">location_on</span>
                                <span 
                                  className="text-gray-700"
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {profile.personalInfo.location}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                            <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                              Add your personal information to complete your profile
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Career Information Card */}
                <Card className="border-0 rounded-3xl shadow-lg bg-white">
                  <CardHeader className="p-8">
                    <CardTitle 
                      className="flex items-center gap-4 text-2xl font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <span className="material-icons text-white text-xl">work</span>
                      </div>
                      Career Information
                      {editSection !== "career" && isEditing && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setEditSection("career")} 
                          className="ml-auto rounded-full h-10 w-10 hover:bg-green-50 hover:text-green-600"
                        >
                          <span className="material-icons">edit</span>
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    {editSection === "career" ? (
                      <div className="space-y-6">
                        <EditableField
                          value={profile.careerInfo.currentRole}
                          onChange={(value) => setProfile(prev => ({ ...prev, careerInfo: { ...prev.careerInfo, currentRole: value } }))}
                          placeholder="Current Role"
                        />
                        <EditableField
                          value={profile.careerInfo.industry}
                          onChange={(value) => setProfile(prev => ({ ...prev, careerInfo: { ...prev.careerInfo, industry: value } }))}
                          placeholder="Industry"
                        />
                        <EditableField
                          value={profile.careerInfo.expectedSalary}
                          onChange={(value) => setProfile(prev => ({ ...prev, careerInfo: { ...prev.careerInfo, expectedSalary: value } }))}
                          placeholder="Expected Salary"
                        />
                        <EditableField
                          value={profile.careerInfo.preferredLocation}
                          onChange={(value) => setProfile(prev => ({ ...prev, careerInfo: { ...prev.careerInfo, preferredLocation: value } }))}
                          placeholder="Preferred Location"
                        />
                        <Button 
                          onClick={() => handleSave("Career")} 
                          disabled={isSaving}
                          className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-lg"
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
                      <div className="grid grid-cols-1 gap-4">
                        {profile.careerInfo.currentRole ? (
                          <>
                            <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                              <div 
                                className="text-sm text-gray-600 mb-1"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                Current Role
                              </div>
                              <div 
                                className="font-medium text-gray-900"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                {profile.careerInfo.currentRole}
                              </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                              <div 
                                className="text-sm text-gray-600 mb-1"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                Industry
                              </div>
                              <div 
                                className="font-medium text-gray-900"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                {profile.careerInfo.industry}
                              </div>
                            </div>
                            {profile.careerInfo.expectedSalary && (
                              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                                <div 
                                  className="text-sm text-gray-600 mb-1"
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  Expected Salary
                                </div>
                                <div 
                                  className="font-medium text-gray-900"
                                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                                >
                                  {profile.careerInfo.expectedSalary}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                            <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                              Add your career information to get better job recommendations
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Academic Tab */}
            <TabsContent value="academic" className="space-y-8">
              <Card className="border-0 rounded-3xl shadow-lg bg-white">
                <CardHeader className="p-8">
                  <CardTitle 
                    className="flex items-center gap-4 text-2xl font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <span className="material-icons text-white text-xl">school</span>
                    </div>
                    Academic Background
                    {editSection !== "academic" && isEditing && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditSection("academic")} 
                        className="ml-auto rounded-full h-10 w-10 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <span className="material-icons">edit</span>
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  {editSection === "academic" ? (
                    <div className="space-y-6">
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
                          className="w-full h-12 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 bg-white shadow-sm px-4"
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
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full shadow-lg"
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
                    <div className="space-y-6">
                      {profile.academicBackground.educationLevel || profile.academicBackground.fieldOfStudy ? (
                        <div className="grid grid-cols-1 gap-4">
                          {profile.academicBackground.educationLevel && (
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                              <div 
                                className="text-sm text-gray-600 mb-1"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                Education Level
                              </div>
                              <div 
                                className="font-medium text-gray-900 capitalize"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                {profile.academicBackground.educationLevel.replace('_', ' ')}
                              </div>
                            </div>
                          )}
                          {profile.academicBackground.fieldOfStudy && (
                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                              <div 
                                className="text-sm text-gray-600 mb-1"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                Field of Study
                              </div>
                              <div 
                                className="font-medium text-gray-900"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                {profile.academicBackground.fieldOfStudy}
                              </div>
                            </div>
                          )}
                          {profile.academicBackground.yearsOfExperience && (
                            <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
                              <div 
                                className="text-sm text-gray-600 mb-1"
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                              >
                                Experience
                              </div>
                              <div 
                                className="font-medium text-gray-900"
                                style={{ fontFamily: 'Google Sans, sans-serif' }}
                              >
                                {profile.academicBackground.yearsOfExperience} years
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                          <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            Add your academic background to complete your profile
                          </p>
                        </div>
                      )}

                      {/* Interests */}
                      {profile.academicBackground.interests.length > 0 && (
                        <div>
                          <h4 
                            className="font-medium text-lg mb-4 text-gray-900 flex items-center gap-2"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            <span className="material-icons text-green-600">interests</span>
                            Areas of Interest
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {profile.academicBackground.interests.map((interest, index) => (
                              <Badge 
                                key={index} 
                                className="px-4 py-2 text-sm bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 border border-gray-200 rounded-full shadow-sm"
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

            {/* Career Tab */}
            <TabsContent value="career" className="space-y-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-3xl text-blue-600">work</span>
                </div>
                <h3 
                  className="text-2xl font-medium text-gray-900 mb-4"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                >
                  Career Details
                </h3>
                <p 
                  className="text-gray-600 max-w-md mx-auto"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Your career information is displayed in the Overview tab. You can edit it by switching to Overview and clicking Edit Profile.
                </p>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-8">
              <Card className="border-0 rounded-3xl shadow-lg bg-white">
                <CardHeader className="p-8">
                  <CardTitle 
                    className="flex items-center gap-4 text-2xl font-medium text-gray-900"
                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="material-icons text-white text-xl">psychology</span>
                    </div>
                    Skills & Expertise
                    {isEditing && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditSection(editSection === "skills" ? null : "skills")} 
                        className="ml-auto rounded-full h-10 w-10 hover:bg-purple-50 hover:text-purple-600"
                      >
                        <span className="material-icons">edit</span>
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                  {profile.skills.length > 0 ? (
                    <>
                      {editSection === "skills" && (
                        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                          <h4 
                            className="font-medium mb-4 text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            Add New Skill
                          </h4>
                          <div className="flex gap-3">
                            <Input
                              placeholder="Skill name"
                              value={newSkill.name}
                              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                              className="flex-1 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            />
                            <select
                              value={newSkill.category}
                              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as 'technical' | 'soft' })}
                              className="px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white focus:border-purple-500 focus:ring-0"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              <option value="technical">Technical</option>
                              <option value="soft">Soft Skill</option>
                            </select>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={newSkill.level}
                              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
                              className="w-24 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0"
                              placeholder="Level"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            />
                            <Button 
                              onClick={addSkill} 
                              className="h-12 w-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-md hover:shadow-lg"
                            >
                              <span className="material-icons">add</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Technical Skills */}
                        <div>
                          <h3 
                            className="font-medium text-xl mb-6 flex items-center gap-3 text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            <span className="material-icons text-blue-600 text-xl">code</span>
                            Technical Skills
                          </h3>
                          <div className="space-y-6">
                            {profile.skills.filter(skill => skill.category === 'technical').map((skill, index) => (
                              <div key={index} className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span 
                                    className="font-medium text-gray-900"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                  >
                                    {skill.name}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span 
                                      className="text-sm font-bold text-blue-600"
                                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    >
                                      {skill.level}%
                                    </span>
                                    {editSection === "skills" && (
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => removeSkill(profile.skills.indexOf(skill))} 
                                        className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                                      >
                                        <span className="material-icons text-sm">delete</span>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                                    style={{ width: `${skill.level}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Soft Skills */}
                        <div>
                          <h3 
                            className="font-medium text-xl mb-6 flex items-center gap-3 text-gray-900"
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                          >
                            <span className="material-icons text-green-600 text-xl">emoji_objects</span>
                            Soft Skills
                          </h3>
                          <div className="space-y-6">
                            {profile.skills.filter(skill => skill.category === 'soft').map((skill, index) => (
                              <div key={index} className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                                <div className="flex items-center justify-between mb-3">
                                  <span 
                                    className="font-medium text-gray-900"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                  >
                                    {skill.name}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span 
                                      className="text-sm font-bold text-green-600"
                                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                                    >
                                      {skill.level}%
                                    </span>
                                    {editSection === "skills" && (
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => removeSkill(profile.skills.indexOf(skill))} 
                                        className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                                      >
                                        <span className="material-icons text-sm">delete</span>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                                    style={{ width: `${skill.level}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons text-3xl text-purple-600">psychology</span>
                      </div>
                      <h3 
                        className="text-2xl font-medium text-gray-900 mb-4"
                        style={{ fontFamily: 'Google Sans, sans-serif' }}
                      >
                        No Skills Added Yet
                      </h3>
                      <p 
                        className="text-gray-600 max-w-md mx-auto mb-6"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Start building your skills portfolio by adding your technical and soft skills.
                      </p>
                      {isEditing && (
                        <Button 
                          onClick={() => setEditSection("skills")}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full px-8 py-3"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          <span className="material-icons mr-2">add</span>
                          Add Your First Skill
                        </Button>
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
