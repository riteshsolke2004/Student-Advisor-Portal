import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Copy,
  Star,
  CheckCircle,
  Mic,
  MicOff,
  // Volume2,
  // VolumeX,
  Navigation,
  HelpCircle,
  Zap,
  Brain,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Enhanced interfaces
interface ChatOption {
  id: string;
  text: string;
  description?: string;
  action?: string;
  page?: string;
}

interface ChatAction {
  type: "navigate" | "menu" | "help";
  page?: string;
  label: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "options" | "navigation" | "info" | "error" | "advice" | "help";
  confidence?: number;
  options?: ChatOption[];
  actions?: ChatAction[];
  follow_up_options?: ChatOption[];
  metadata?: {
    processingTime?: number;
    menuType?: string;
    navigationType?: string;
    sessionId?: string;
  };
}

interface ChatbotResponse {
  success: boolean;
  response: {
    type: string;
    message: string;
    confidence?: number;
    options?: ChatOption[];
    actions?: ChatAction[];
    follow_up_options?: ChatOption[];
    page?: string;
    audio_url?: string;
    transcript?: string;
    metadata?: any;
  };
  timestamp: string;
  session_id?: string;
}

const EnhancedChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "error">("connecting");
  
  // Navigation and location
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ✅ FIXED: Correct API URL - should point to your backend, not the chatbot service directly
  const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000'  // Your main backend
    : window.location.origin;   // Production backend

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChatbot();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChatbot = async () => {
    setConnectionStatus("connecting");
    try {
      // ✅ FIXED: Correct field names in snake_case
      const response = await fetch(`${API_BASE_URL}/api/chat/enhanced`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          input_type: 'option',      // ✅ Snake case
          option_id: 'main_menu',    // ✅ Snake case  
          current_page: location.pathname  // ✅ Snake case
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatbotResponse = await response.json();
      console.log('Initialization response:', data);

      if (data.success) {
        setSessionId(data.session_id || generateSessionId());
        addBotMessage(data.response);
        setConnectionStatus("connected");
      } else {
        throw new Error('Server returned success: false');
      }
    } catch (error) {
      console.error('Chatbot initialization error:', error);
      setConnectionStatus("error");
      addErrorMessage(
        "Welcome! I'm having trouble connecting to the chatbot service. Please check your connection and try refreshing the page."
      );
    }
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async (message?: string, optionId?: string) => {
    const inputText = message || inputValue.trim();
    const isOptionInput = Boolean(optionId);

    if (!inputText && !isOptionInput) return;

    // Add user message for text input
    if (!isOptionInput && inputText) {
      addUserMessage(inputText);
      setInputValue("");
    }

    setIsTyping(true);

    try {
      // ✅ FIXED: Correct field names in snake_case
      const requestBody = {
        message: inputText,
        option_id: optionId,           // ✅ Snake case
        current_page: location.pathname, // ✅ Snake case  
        input_type: isOptionInput ? 'option' : 'text', // ✅ Snake case
        session_id: sessionId          // ✅ Snake case
      };

      console.log('Sending request:', requestBody);

      const response = await fetch(`${API_BASE_URL}/api/chat/enhanced`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatbotResponse = await response.json();
      console.log('Chat response:', data);

      if (data.success) {
        // Handle navigation
        if (data.response.type === 'navigation' && data.response.page) {
          navigate(data.response.page);
          toast({
            title: "Navigation",
            description: `Navigated to ${data.response.page}`,
            duration: 2000
          });
        }

        addBotMessage(data.response);
        setConnectionStatus("connected");

        // Handle audio response
        if (data.response.audio_url && audioEnabled) {
          playAudioResponse(data.response.audio_url);
        }

        // Update session ID
        if (data.session_id) {
          setSessionId(data.session_id);
        }
      } else {
        addErrorMessage("Sorry, I encountered an error. Please try again.");
      }
    } catch (error) {
      console.error('Message send error:', error);
      setConnectionStatus("error");
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        addErrorMessage("Cannot connect to the server. Please check your internet connection and try again.");
      } else {
        addErrorMessage(`Connection error: ${error.message}. Please try again.`);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const addUserMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const addBotMessage = (responseData: ChatbotResponse['response']) => {
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responseData.message,
      sender: "bot",
      timestamp: new Date(),
      type: responseData.type as any,
      confidence: responseData.confidence,
      options: responseData.options,
      actions: responseData.actions,
      follow_up_options: responseData.follow_up_options,
      metadata: {
        processingTime: 1.2,
        menuType: responseData.metadata?.menu_type,
        navigationType: responseData.metadata?.navigation_type,
        sessionId: sessionId
      }
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addErrorMessage = (text: string) => {
    const errorMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      type: "error",
      confidence: 0
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  const handleOptionSelect = (optionId: string) => {
    // Show user selection
    const option = messages[messages.length - 1]?.options?.find(opt => opt.id === optionId);
    if (option) {
      addUserMessage(`Selected: ${option.text}`);
    }
    
    sendMessage("", optionId);
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.type === "navigate" && action.page) {
      navigate(action.page);
      toast({
        title: "Navigation",
        description: `Navigated to ${action.page}`,
        duration: 2000
      });
    } else if (action.type === "menu") {
      handleOptionSelect("main_menu");
    } else if (action.type === "help") {
      // Handle help action
      sendMessage("", "page_help");
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
      duration: 1000
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Voice functionality
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Voice recording error:', error);
      toast({
        title: "Voice Error", 
        description: "Could not access microphone",
        duration: 2000
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('current_page', location.pathname);
      formData.append('session_id', sessionId);

      // ✅ FIXED: Use correct voice endpoint 
      const response = await fetch(`${API_BASE_URL}/api/chat/voice`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Voice response:', data);

      if (data.success) {
        // Add transcription as user message
        if (data.transcript) {
          addUserMessage(` "${data.transcript}"`);
        }

        // Add bot response
        addBotMessage(data.response);

        // Play audio response if enabled
        if (data.response.audio_url && audioEnabled) {
          playAudioResponse(data.response.audio_url);
        }
      } else {
        addErrorMessage(data.message || "Sorry, I couldn't process your voice message.");
      }
    } catch (error) {
      console.error('Voice message error:', error);
      addErrorMessage("Voice processing failed. Please try text input instead.");
    } finally {
      setIsTyping(false);
    }
  };

  const playAudioResponse = (audioUrl: string) => {
    if (audioRef.current) {
      const fullUrl = audioUrl.startsWith('http') ? audioUrl : `${API_BASE_URL}${audioUrl}`;
      audioRef.current.src = fullUrl;
      audioRef.current.play().catch(err => {
        console.error('Audio play error:', err);
      });
    }
  };

  const retryConnection = () => {
    setMessages([]);
    setConnectionStatus("connecting");
    initializeChatbot();
  };

  // Component for rendering options
  const OptionsRenderer: React.FC<{ options: ChatOption[]; onOptionSelect: (id: string) => void }> = ({
    options,
    onOptionSelect
  }) => (
    <div className="grid grid-cols-1 gap-2 mt-3">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          className="text-left justify-start h-auto p-3 hover:bg-blue-50 transition-colors"
          onClick={() => onOptionSelect(option.id)}
        >
          <div className="w-full">
            <div className="font-medium text-sm">{option.text}</div>
            {option.description && (
              <div className="text-xs text-muted-foreground mt-1 opacity-80">
                {option.description}
              </div>
            )}
          </div>
        </Button>
      ))}
    </div>
  );

  // Component for rendering actions
  const ActionsRenderer: React.FC<{ actions: ChatAction[]; onActionClick: (action: ChatAction) => void }> = ({
    actions,
    onActionClick
  }) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="secondary"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onActionClick(action)}
        >
          {action.type === "navigate" && <Navigation className="h-3 w-3 mr-1" />}
          {action.type === "help" && <HelpCircle className="h-3 w-3 mr-1" />}
          {action.label}
        </Button>
      ))}
    </div>
  );

  if (!isOpen) {
    return (
      <div className="fixed left-6 bottom-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl w-16 h-16 border-0"
            size="icon"
          >
            <div className="relative">
              <Brain className="h-7 w-7 text-white" />
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                connectionStatus === "connected" ? "bg-green-400 animate-pulse" :
                connectionStatus === "connecting" ? "bg-yellow-400 animate-pulse" :
                "bg-red-400"
              }`}></div>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed left-6 bottom-6 z-50 w-[420px]">
        <Card className="shadow-2xl border border-slate-200 bg-white">
          {/* Enhanced Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">AI Career Assistant</CardTitle>
                <div className="flex items-center gap-2 text-xs opacity-90">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected" ? "bg-green-400 animate-pulse" :
                    connectionStatus === "connecting" ? "bg-yellow-400 animate-pulse" :
                    "bg-red-400"
                  }`}></div>
                  <span>
                    {connectionStatus === "connected" ? "Connected" :
                     connectionStatus === "connecting" ? "Connecting..." :
                     "Connection Error"}
                  </span>
                  {sessionId && <span>• Session: {sessionId.slice(-4)}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {/* <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10 rounded-lg"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button> */}
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
              {/* Current Page Indicator */}
              <div className="px-4 py-2 bg-slate-50 border-b text-sm text-slate-600 flex items-center justify-between">
                <span>📍 Current page: <span className="font-medium">{location.pathname}</span></span>
                {connectionStatus === "error" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={retryConnection}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
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
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {message.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className={`max-w-[280px] ${
                        message.sender === "user" ? "ml-auto" : ""
                      }`}>
                        {/* Message Content */}
                        <div className={`rounded-2xl p-4 ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : message.type === "error"
                            ? "bg-red-50 border border-red-200 text-red-800"
                            : "bg-slate-50 border border-slate-200 text-slate-800"
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                          </p>
                          
                          {/* Confidence Score */}
                          {message.sender === "bot" && message.confidence !== undefined && (
                            <div className="mt-3 flex items-center gap-2">
                              <div className="text-xs text-slate-600">Confidence:</div>
                              <Progress value={message.confidence} className="h-1 flex-1" />
                              <div className="text-xs font-medium">{message.confidence}%</div>
                            </div>
                          )}
                        </div>

                        {/* Options */}
                        {message.options && message.options.length > 0 && (
                          <OptionsRenderer 
                            options={message.options} 
                            onOptionSelect={handleOptionSelect} 
                          />
                        )}

                        {/* Actions */}
                        {message.actions && message.actions.length > 0 && (
                          <ActionsRenderer 
                            actions={message.actions} 
                            onActionClick={handleActionClick} 
                          />
                        )}

                        {/* Follow-up Options */}
                        {message.follow_up_options && message.follow_up_options.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-slate-600 mb-2">Quick Actions:</div>
                            <div className="flex flex-wrap gap-1">
                              {message.follow_up_options.map((option) => (
                                <Button
                                  key={option.id}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs px-2"
                                  onClick={() => handleOptionSelect(option.id)}
                                >
                                  {option.text}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Message Footer */}
                        <div className={`flex items-center justify-between mt-2 px-2 ${
                          message.sender === "user" ? "flex-row-reverse" : ""
                        }`}>
                          <div className="text-xs text-slate-500">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                          <span className="text-xs text-slate-600 ml-2">Processing with AI...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Enhanced Input Section */}
              <div className="p-4 bg-slate-50">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={connectionStatus === "connected" ? "Ask me anything about your career..." : "Connecting..."}
                    className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isTyping || connectionStatus !== "connected"}
                  />
                  
                  {/* Voice Button */}
                  {/* <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 ${isListening ? 'bg-red-100 border-red-300' : ''}`}
                    onClick={isListening ? stopVoiceRecording : startVoiceRecording}
                    disabled={isTyping || connectionStatus !== "connected"}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4 text-red-600" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button> */}
                  
                  {/* Send Button */}
                  <Button
                    onClick={() => sendMessage()}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 h-10 w-10"
                    disabled={!inputValue.trim() || isTyping || connectionStatus !== "connected"}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {isListening && (
                      <Badge variant="secondary" className="bg-red-100 text-red-600">
                        
                      </Badge>
                    )}
                    {audioEnabled && (
                      <Badge variant="secondary" className="bg-green-100 text-green-600">
                       
                      </Badge>
                    )}
                    {connectionStatus === "error" && (
                      <Badge variant="secondary" className="bg-red-100 text-red-600">
                       
                      </Badge>
                    )}
                  </div>
                  <div>Enhanced AI • Voice Enabled</div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />
    </>
  );
};

export default EnhancedChatbot;