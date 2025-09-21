import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User, 
  Settings,
  Download,
  Copy,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Brain,
  Zap,
  Shield,
  Headphones
} from "lucide-react";

// Import chatbot avatar image
import chatbotAvatar from '../assets/chatbot-avatar2.jpg';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "action" | "file" | "analysis";
  confidence?: number;
  actions?: ActionButton[];
  metadata?: {
    processingTime?: number;
    modelUsed?: string;
    category?: string;
  };
}

interface ActionButton {
  label: string;
  action: string;
  variant?: "default" | "outline" | "secondary";
}

const ProfessionalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to your Professional AI Career Advisor. I'm powered by advanced machine learning models and trained on comprehensive career data. I can provide detailed analysis, personalized recommendations, and strategic guidance for your professional development.",
      sender: "bot",
      timestamp: new Date(),
      status: "delivered",
      type: "text",
      confidence: 98,
      metadata: {
        modelUsed: "GPT-4 Turbo",
        category: "greeting",
        processingTime: 0.8
      },
      actions: [
        { label: "Career Assessment", action: "assessment", variant: "default" },
        { label: "Industry Analysis", action: "industry", variant: "outline" },
        { label: "Skill Gap Analysis", action: "skills", variant: "outline" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    messagesCount: 1,
    avgResponseTime: 1.2,
    satisfaction: 4.8,
    activeSession: "45 min"
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Professional quick actions
  const quickActions = [
    { label: "📊 Career Analysis", value: "Provide a comprehensive career analysis based on current market trends" },
    { label: "🎯 Goal Setting", value: "Help me set SMART career goals for the next 12 months" },
    { label: "📈 Skill Assessment", value: "Assess my current skills and recommend improvement areas" },
    { label: "💼 Interview Prep", value: "Prepare me for senior-level technical interviews" },
    { label: "🔍 Market Research", value: "Research salary benchmarks and job market trends in my field" },
    { label: "📝 Resume Review", value: "Review and optimize my resume for ATS systems" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate professional ML model processing
    setTimeout(() => {
      const professionalResponses = [
        {
          text: "Based on my analysis of current market data and your profile, I've identified several strategic opportunities for your career advancement. The tech industry is experiencing 23% growth in AI-related roles, with average salary increases of 15-18% year-over-year.",
          confidence: 94,
          actions: [
            { label: "View Full Report", action: "report", variant: "default" as const },
            { label: "Schedule Follow-up", action: "schedule", variant: "outline" as const }
          ],
          category: "analysis"
        },
        {
          text: "I've completed a comprehensive skill gap analysis using our proprietary algorithms. Your technical proficiency shows strong alignment with senior developer roles. However, I recommend strengthening your leadership and strategic planning capabilities to transition into management positions.",
          confidence: 91,
          actions: [
            { label: "Learning Roadmap", action: "roadmap", variant: "default" as const },
            { label: "Certification Guide", action: "certifications", variant: "outline" as const }
          ],
          category: "recommendations"
        },
        {
          text: "Our ML models have processed over 50,000 similar career trajectories. Based on this data, professionals with your background typically see 40% salary growth within 2-3 years when following structured development plans. I can create a personalized roadmap for you.",
          confidence: 96,
          actions: [
            { label: "Generate Plan", action: "plan", variant: "default" as const },
            { label: "Compare Paths", action: "compare", variant: "outline" as const }
          ],
          category: "insights"
        }
      ];

      const selectedResponse = professionalResponses[Math.floor(Math.random() * professionalResponses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: selectedResponse.text,
        sender: "bot",
        timestamp: new Date(),
        status: "delivered",
        type: "analysis",
        confidence: selectedResponse.confidence,
        actions: selectedResponse.actions,
        metadata: {
          processingTime: Math.random() * 2 + 1,
          modelUsed: "Enterprise AI v2.1",
          category: selectedResponse.category
        }
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Update session stats
      setSessionInfo(prev => ({
        messagesCount: prev.messagesCount + 2,
        avgResponseTime: (prev.avgResponseTime + botMessage.metadata!.processingTime!) / 2,
        satisfaction: prev.satisfaction,
        activeSession: prev.activeSession
      }));

      // Update user message status
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg
        ));
      }, 500);
    }, 2500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  const handleActionButton = (action: string) => {
    console.log("Action triggered:", action);
    // Handle different actions like reports, scheduling, etc.
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed left-6 bottom-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl w-16 h-16 border border-slate-700 overflow-hidden"
            size="icon"
          >
            <img 
              src={chatbotAvatar}
              alt="AI Chatbot" 
              className="w-12 h-12 object-cover rounded-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<svg class="h-7 w-7 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" /></svg>';
                }
              }}
            />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-6 bottom-6 z-50 w-[420px]">
      <Card className="shadow-2xl border border-slate-200 bg-white">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Professional AI Advisor</CardTitle>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Enterprise Model Active</span>
                <Shield className="h-3 w-3" />
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 rounded-lg"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Session Stats */}
            <div className="p-4 bg-slate-50 border-b">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{sessionInfo.messagesCount}</div>
                  <div className="text-xs text-slate-600">Messages</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{sessionInfo.avgResponseTime.toFixed(1)}s</div>
                  <div className="text-xs text-slate-600">Avg Response</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-1">
                    {sessionInfo.satisfaction}
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="text-xs text-slate-600">Satisfaction</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{sessionInfo.activeSession}</div>
                  <div className="text-xs text-slate-600">Session</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-96 p-4">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                      message.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <img 
                          src={chatbotAvatar}
                          alt="AI Chatbot" 
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<svg class="h-4 w-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" /></svg>';
                            }
                          }}
                        />
                      )}
                    </div>
                    
                    <div className={`max-w-[280px] ${
                      message.sender === "user" ? "ml-auto" : ""
                    }`}>
                      <div className={`rounded-2xl p-4 shadow-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 border border-slate-200 text-slate-800"
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        
                        {/* Confidence Score for bot messages */}
                        {message.sender === "bot" && message.confidence && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="text-xs text-slate-600">Confidence:</div>
                            <Progress value={message.confidence} className="h-1 flex-1" />
                            <div className="text-xs font-medium text-slate-700">{message.confidence}%</div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {message.actions && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.variant || "outline"}
                              size="sm"
                              className="h-7 text-xs rounded-lg"
                              onClick={() => handleActionButton(action.action)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Message Footer */}
                      <div className={`flex items-center justify-between mt-2 px-2 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.metadata?.processingTime && (
                            <>
                              <span>•</span>
                              <span>{message.metadata.processingTime.toFixed(1)}s</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {message.sender === "bot" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-slate-600"
                              onClick={() => copyMessage(message.text)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                          {message.sender === "user" && message.status === "delivered" && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center overflow-hidden">
                      <img 
                        src={chatbotAvatar}
                        alt="AI Chatbot" 
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<svg class="h-4 w-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" /></svg>';
                          }
                        }}
                      />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                        <span className="text-xs text-slate-600 ml-2">Analyzing with Enterprise AI...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Quick Actions */}
            <div className="p-4 bg-slate-50">
              <div className="text-xs font-medium text-slate-700 mb-3">Quick Professional Actions</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start truncate"
                    onClick={() => handleQuickAction(action.value)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
              
              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask for professional career guidance..."
                  className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md h-10 w-10"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-100 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Headphones className="h-3 w-3 mr-1" />
                    Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ProfessionalChatbot;