import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageCircle, 
  Hash, 
  Send, 
  Plus, 
  Search,
  Settings,
  UserPlus,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Video,
  Phone,
  Info,
  Bell,
  Star,
  Archive,
  Trash2,
  Edit3,
  Share,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  ChevronDown,
  Check,
  CheckCheck,
  Menu,
  X,
  MicOff,
  Upload,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

// Import emoji picker - make it optional in case it's not installed
let EmojiPicker: any = null;
let EmojiClickData: any = null;
try {
  const emojiPickerReact = require('emoji-picker-react');
  EmojiPicker = emojiPickerReact.default || emojiPickerReact;
  EmojiClickData = emojiPickerReact.EmojiClickData;
} catch (error) {
  console.warn('emoji-picker-react not installed. Emoji functionality will be limited.');
}

// Types
interface ChatRoom {
  _id: string;
  room_id: string;
  name: string;
  description: string;
  room_type: string;
  members: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_members?: number;
  member_count: number;
}

interface Message {
  _id: string;
  message_id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: string;
  timestamp: string;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
}

interface User {
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  is_online?: boolean;
  last_seen?: string;
}

interface Notification {
  id: string;
  type: 'message' | 'mention' | 'room_invite';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  room_id?: string;
  sender_id?: string;
}

// Real-time timestamp hook
const useRealTimeTimestamp = (timestamp: string) => {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const messageTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo('now');
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)}m ago`);
      } else if (diffInSeconds < 86400) {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)}h ago`);
      } else {
        setTimeAgo(messageTime.toLocaleDateString());
      }
    };
    
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timestamp]);
  
  return timeAgo;
};

// Google Chat-style Auto-Scroll Hook
const useFixedChatScroll = (messages: Message[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  
  useEffect(() => {
    if (!isUserScrolled && messagesEndRef.current && containerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolled]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    
    setIsUserScrolled(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsUserScrolled(false);
    }
  };

  return { containerRef, messagesEndRef, isUserScrolled, handleScroll, scrollToBottom };
};

// Enhanced WebSocket Hook with notifications
const useWebSocket = (userId: string, onMessage: (msg: Message) => void, onNotification?: (notification: Notification) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const isManualDisconnect = useRef(false);
  
  const onMessageRef = useRef(onMessage);
  const onNotificationRef = useRef(onNotification);
  
  useEffect(() => {
    onMessageRef.current = onMessage;
    onNotificationRef.current = onNotification;
  }, [onMessage, onNotification]);

  const connect = useRef(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || 
        wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      return;
    }

    try {
      const wsUrl = `ws://localhost:8000/api/chat/ws/${encodeURIComponent(userId)}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        isManualDisconnect.current = false;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            onMessageRef.current(data.data);
            
            // Create notification for new messages
            if (onNotificationRef.current && data.data.sender_id !== userId) {
              onNotificationRef.current({
                id: Date.now().toString(),
                type: 'message',
                title: `New message from ${data.data.sender_name}`,
                content: data.data.content,
                timestamp: data.data.timestamp,
                read: false,
                room_id: data.data.room_id,
                sender_id: data.data.sender_id
              });
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        
        if (!isManualDisconnect.current && 
            reconnectAttempts.current < maxReconnectAttempts &&
            event.code !== 1000) {
          
          reconnectAttempts.current++;
          const delay = Math.min(2000 * reconnectAttempts.current, 10000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect.current();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  });

  const sendMessage = useRef((roomId: string, content: string, senderName: string, messageType = 'text', fileData?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        data: { 
          room_id: roomId, 
          content, 
          sender_name: senderName, 
          message_type: messageType,
          ...fileData
        }
      }));
    }
  });

  const joinRoom = useRef((roomId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join_room',
        data: { room_id: roomId }
      }));
    }
  });

  const disconnect = useRef(() => {
    isManualDisconnect.current = true;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'User disconnected');
    }
    
    wsRef.current = null;
    setIsConnected(false);
    reconnectAttempts.current = 0;
  });

  useEffect(() => {
    if (userId) {
      connect.current();
    }

    return () => {
      disconnect.current();
    };
  }, [userId]);

  return { 
    isConnected, 
    sendMessage: sendMessage.current, 
    joinRoom: joinRoom.current 
  };
};

const Community: React.FC = () => {
  // State management
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomType, setNewRoomType] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // File upload
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  // Audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);

  // User management - Initialize as empty array to prevent map error
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const [totalUserCount, setTotalUserCount] = useState(0);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Refs
  const activeRoomRef = useRef(activeRoom);
  const soundEnabledRef = useRef(soundEnabled);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Google Chat-style scroll
  const { containerRef, messagesEndRef, isUserScrolled, handleScroll, scrollToBottom } = useFixedChatScroll(messages);

  // User data
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const currentUser: User = user
    ? {
        user_id: user.email,
        username: user.firstName,
        email: user.email,
        avatar_url: "",
        is_online: true
      }
    : {
        user_id: "",
        username: "",
        email: "",
        avatar_url: "",
        is_online: false
      };

  const navigate = useNavigate();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setShowSidebar(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notification permissions
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/sign-in');
    }
  }, [navigate]);

  // Update refs when state changes
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Handle notifications
  const handleNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Browser notification
    if (notificationPermission === 'granted' && document.hidden) {
      new Notification(notification.title, {
        body: notification.content,
        icon: '/favicon.ico',
        tag: 'chat-message'
      });
    }
    
    // Audio notification
    if (soundEnabledRef.current) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(console.error);
    }
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // WebSocket connection with notifications
  const { isConnected, sendMessage, joinRoom } = useWebSocket(
    currentUser.user_id,
    React.useCallback((message: Message) => {
      if (message.room_id === activeRoomRef.current) {
        setMessages(prev => [...prev, message]);
      }
    }, []),
    React.useCallback(handleNotification, [notificationPermission])
  );

  // Emoji handling - with fallback if emoji picker not available
  const handleEmojiClick = (emojiData: any) => {
    if (!EmojiPicker) return;
    
    const emoji = emojiData.emoji;
    const textBeforeCursor = newMessage.slice(0, cursorPosition);
    const textAfterCursor = newMessage.slice(cursorPosition);
    const newText = textBeforeCursor + emoji + textAfterCursor;
    
    setNewMessage(newText);
    setCursorPosition(cursorPosition + emoji.length);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  // Simple emoji fallback
  const insertSimpleEmoji = (emoji: string) => {
    const textBeforeCursor = newMessage.slice(0, cursorPosition);
    const textAfterCursor = newMessage.slice(cursorPosition);
    const newText = textBeforeCursor + emoji + textAfterCursor;
    
    setNewMessage(newText);
    setCursorPosition(cursorPosition + emoji.length);
    messageInputRef.current?.focus();
  };

  // File upload handling
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);
    
    for (const file of fileArray) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('room_id', activeRoom);
      formData.append('sender_id', currentUser.user_id);
      
      try {
        const response = await fetch('http://localhost:8000/api/chat/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          sendMessage(activeRoom, `📎 ${file.name}`, currentUser.username, 'file', {
            file_url: result.file_url,
            file_name: file.name,
            file_type: file.type
          });
        } else {
          // Fallback: send file name as regular message
          sendMessage(activeRoom, `📎 ${file.name} (upload not available)`, currentUser.username);
        }
      } catch (error) {
        console.error('File upload error:', error);
        // Fallback: send file name as regular message
        sendMessage(activeRoom, `📎 ${file.name} (upload failed)`, currentUser.username);
        toast({
          title: "Upload Not Available",
          description: `File upload service unavailable. Sent as text.`,
          variant: "destructive",
        });
      }
    }
    
    setUploadingFiles([]);
    setUploadProgress(0);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setRecordingTime(0);
      
      recorder.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data]);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Send audio message
        sendMessage(activeRoom, `🎤 Voice message (${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')})`, currentUser.username, 'audio', {
          file_url: audioUrl,
          file_type: 'audio/wav'
        });
        setAudioChunks([]);
        setRecordingTime(0);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Fetch online users with proper error handling
  

  // Generate mock users as fallback
  const generateMockUsers = () => {
    const mockUsers: User[] = [
      {
        user_id: currentUser.user_id,
        username: currentUser.username,
        email: currentUser.email,
        is_online: true
      },
      {
        user_id: 'user_2',
        username: 'Alice Johnson',
        email: 'alice@example.com',
        is_online: true
      },
      {
        user_id: 'user_3',
        username: 'Bob Smith',
        email: 'bob@example.com',
        is_online: true
      },
      {
        user_id: 'user_4',
        username: 'Carol Davis',
        email: 'carol@example.com',
        is_online: true
      }
    ];
    
    setOnlineUsers(mockUsers);
    setTotalUserCount(mockUsers.length);
  };

  // Extract unique users from current room members as another fallback
  const getUsersFromRoomMembers = () => {
    const activeRoomData = getActiveRoomData();
    if (activeRoomData && Array.isArray(activeRoomData.members)) {
      const roomUsers: User[] = activeRoomData.members.map((memberId, index) => ({
        user_id: memberId,
        username: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        is_online: true
      }));
      
      // Add current user if not in the list
      if (!roomUsers.some(u => u.user_id === currentUser.user_id)) {
        roomUsers.unshift({
          user_id: currentUser.user_id,
          username: currentUser.username,
          email: currentUser.email,
          is_online: true
        });
      }
      
      setOnlineUsers(roomUsers);
      setTotalUserCount(roomUsers.length);
    }
  };

  // API functions
  const fetchRooms = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/chat/rooms');
      const data = await response.json();
      setRooms(data);
      if (data.length > 0 && !activeRoom) {
        setActiveRoom(data[0].room_id);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Connection Error",
        description: "Failed to load chat rooms.",
        variant: "destructive",
      });
    }
  }, [activeRoom, toast]);

  const fetchMessages = React.useCallback(async (roomId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/chat/rooms/${roomId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  // Create new room
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newRoomName,
          description: newRoomDescription,
          room_type: newRoomType
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setRooms(prev => [result.data.room, ...prev]);
        setShowCreateRoom(false);
        setNewRoomName("");
        setNewRoomDescription("");
        setNewRoomType("general");
        toast({
          title: "Room Created",
          description: `${newRoomName} created successfully!`,
        });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room.",
        variant: "destructive",
      });
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeRoom || !isConnected) return;

    sendMessage(activeRoom, newMessage.trim(), currentUser.username);
    setNewMessage("");
    messageInputRef.current?.focus();
  };

  // Handle room change
  const handleRoomChange = (roomId: string) => {
    setActiveRoom(roomId);
    joinRoom(roomId);
    fetchMessages(roomId);
    if (isMobile) setShowSidebar(false);
    
    // Try to get users from room members as fallback
    setTimeout(() => {
      if (onlineUsers.length === 0) {
        getUsersFromRoomMembers();
      }
    }, 1000);
  };

  // Effects
  useEffect(() => {
    fetchRooms();
   
  }, [fetchRooms]);

  useEffect(() => {
    if (activeRoom && isConnected) {
      joinRoom(activeRoom);
      fetchMessages(activeRoom);
    }
  }, [activeRoom, isConnected, joinRoom, fetchMessages]);

  useEffect(() => {
    if (rooms.length > 0) {
      setIsLoading(false);
    }
  }, [rooms]);

  // Refresh online users every 30 seconds, with fallback
  useEffect(() => {
    const interval = setInterval(() => {
     
      
      // If still no users after API call, use room members fallback
      setTimeout(() => {
        if (onlineUsers.length === 0) {
          getUsersFromRoomMembers();
        }
      }, 2000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize users on component mount
  useEffect(() => {
    // Try to get users immediately
    
    
    // Fallback after 3 seconds if no users loaded
    const fallbackTimeout = setTimeout(() => {
      if (onlineUsers.length === 0) {
        generateMockUsers();
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, []);

  // Utility functions
  const getActiveRoomData = () => rooms.find(room => room.room_id === activeRoom);
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoomIcon = (roomType: string) => {
    const icons = {
      general: 'tag',
      course: 'chat',
      study_group: 'groups',
      help: 'help',
      project: 'star'
    };
    return icons[roomType as keyof typeof icons] || 'tag';
  };

  // Real-time timestamp component
  const RealTimeTimestamp: React.FC<{ timestamp: string }> = ({ timestamp }) => {
    const timeAgo = useRealTimeTimestamp(timestamp);
    return (
      <span className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
        {timeAgo}
      </span>
    );
  };

  // User list dialog component with proper error handling
  const UserListDialog = () => {
    // Ensure onlineUsers is always an array
    const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];
    const displayCount = totalUserCount || safeOnlineUsers.length || getActiveRoomData()?.member_count || 1;
    
    return (
      <Dialog open={showUserList} onOpenChange={setShowUserList}>
        <DialogContent className="sm:max-w-md border-0 rounded-3xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Google Sans, sans-serif' }}>
              Room Members ({displayCount})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {safeOnlineUsers.length > 0 ? (
              safeOnlineUsers.map((user, index) => (
                <div key={user.user_id || index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-500 text-white">
                      {getInitials(user.username || `User ${index + 1}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {user.username || `User ${index + 1}`}
                      {user.user_id === currentUser.user_id && " (You)"}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      {user.is_online ? 'Online' : 'Away'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No users found. You're the first one here!
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Simple emoji selector as fallback
  const SimpleEmojiSelector = () => (
    <div className="absolute bottom-16 left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
      <div className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
        Quick Emojis
      </div>
      <div className="grid grid-cols-6 gap-2">
        {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '😢', '😡', '🔥', '✨'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => insertSimpleEmoji(emoji)}
            className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="mt-3 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(false)}
          className="text-xs"
        >
          Close
        </Button>
      </div>
    </div>
  );

  // Notification center component
  const NotificationCenter = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.slice(-3).map(notification => (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <Bell className="text-blue-600 h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-sm" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                {notification.title}
              </div>
              <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {notification.content}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications(prev => 
                prev.filter(n => n.id !== notification.id)
              )}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
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
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div 
                className="text-2xl text-gray-700 mb-2"
                style={{ fontFamily: 'Google Sans, sans-serif' }}
              >
                Loading Community
              </div>
              <div 
                className="text-gray-500"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Connecting to Chat...
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

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

      {/* Add CSS for mobile and animations */}
      <style>{`
        @media (max-width: 1024px) {
          .chat-container {
            padding: 1rem;
          }
          
          .message-input {
            font-size: 16px;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
        <Header />
        
        {/* Notification Center */}
        <NotificationCenter />
        
        {/* User List Dialog */}
        <UserListDialog />
        
        <main className="container mx-auto px-6 py-8 max-w-8xl">
          {/* Google Chat-style Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-icons text-white text-2xl">forum</span>
                  </div>
                  <div>
                    <h1 
                      className="text-4xl font-medium text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      Student Community
                    </h1>
                    <p 
                      className="text-lg text-gray-600"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Connect, collaborate, and learn together
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    isConnected 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {isConnected ? (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <Wifi className="h-4 w-4" />
                      Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4" />
                      Offline
                    </>
                  )}
                </Badge>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 rounded-full border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 h-10 px-4"
                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4" />
                  Notifications {notifications.length > 0 && (
                    <Badge className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile and Desktop Layout */}
          <div className={`${isMobile ? 'block' : 'grid grid-cols-12 gap-8'}`} style={{ height: '700px' }}>
            {/* Mobile sidebar overlay */}
            {isMobile && showSidebar && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
                <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
                  <Card className="h-full flex flex-col border-0 rounded-none">
                    <CardHeader className="p-6 border-b border-gray-100 flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <CardTitle 
                          className="text-xl font-medium flex items-center gap-3 text-gray-900"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          <span className="material-icons text-blue-600 text-xl">chat</span>
                          Chat Rooms
                        </CardTitle>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSidebar(false)}
                          className="h-10 w-10"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search rooms..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        />
                      </div>
                    </CardHeader>
                    
                    {/* Mobile Room List */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-2 p-4">
                        {filteredRooms.map((room) => (
                          <div
                            key={room.room_id}
                            onClick={() => handleRoomChange(room.room_id)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                              activeRoom === room.room_id
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                : 'hover:bg-gray-50 border border-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${
                                activeRoom === room.room_id 
                                  ? 'bg-white/20' 
                                  : 'bg-blue-50 text-blue-600'
                              }`}>
                                <span className="material-icons text-lg">
                                  {getRoomIcon(room.room_type)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div 
                                  className="font-medium text-base truncate"
                                  style={{ fontFamily: 'Google Sans, sans-serif' }}
                                >
                                  {room.name}
                                </div>
                                <div 
                                  className={`text-sm truncate ${
                                    activeRoom === room.room_id ? 'text-blue-100' : 'text-gray-500'
                                  }`}
                                  style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {room.member_count} members • {room.room_type}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Sidebar - hidden on mobile unless toggled */}
            <div className={`${isMobile ? 'hidden' : 'col-span-12 lg:col-span-4'} h-full`}>
              <Card className="h-full flex flex-col border-0 rounded-3xl shadow-lg bg-white">
                <CardHeader className="p-6 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle 
                      className="text-xl font-medium flex items-center gap-3 text-gray-900"
                      style={{ fontFamily: 'Google Sans, sans-serif' }}
                    >
                      <span className="material-icons text-blue-600 text-xl">chat</span>
                      Chat Rooms
                    </CardTitle>
                    
                    <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg border-0 rounded-3xl shadow-2xl">
                        <DialogHeader className="p-6">
                          <DialogTitle 
                            style={{ fontFamily: 'Google Sans, sans-serif' }}
                            className="text-2xl font-medium text-gray-900"
                          >
                            Create New Room
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 p-6 pt-0">
                          <div>
                            <Label 
                              htmlFor="roomName"
                              className="text-base font-medium text-gray-900"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              Room Name
                            </Label>
                            <Input
                              id="roomName"
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                              placeholder="Enter room name"
                              className="mt-2 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            />
                          </div>
                          <div>
                            <Label 
                              htmlFor="roomDescription"
                              className="text-base font-medium text-gray-900"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              Description
                            </Label>
                            <Textarea
                              id="roomDescription"
                              value={newRoomDescription}
                              onChange={(e) => setNewRoomDescription(e.target.value)}
                              placeholder="Describe your room"
                              className="mt-2 rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            />
                          </div>
                          <div>
                            <Label 
                              className="text-base font-medium text-gray-900"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              Room Type
                            </Label>
                            <RadioGroup value={newRoomType} onValueChange={setNewRoomType} className="mt-3">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="general" id="general" />
                                <Label htmlFor="general" style={{ fontFamily: 'Roboto, sans-serif' }}>General</Label>
                              </div>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="course" id="course" />
                                <Label htmlFor="course" style={{ fontFamily: 'Roboto, sans-serif' }}>Course</Label>
                              </div>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="study_group" id="study_group" />
                                <Label htmlFor="study_group" style={{ fontFamily: 'Roboto, sans-serif' }}>Study Group</Label>
                              </div>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="help" id="help" />
                                <Label htmlFor="help" style={{ fontFamily: 'Roboto, sans-serif' }}>Help & Support</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button 
                              onClick={handleCreateRoom} 
                              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              Create Room
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCreateRoom(false)}
                              className="flex-1 h-12 rounded-2xl border-2 border-gray-300"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search rooms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>
                </CardHeader>
                
                {/* Room List */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-2 p-4">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.room_id}
                        onClick={() => handleRoomChange(room.room_id)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                          activeRoom === room.room_id
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                            : 'hover:bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${
                            activeRoom === room.room_id 
                              ? 'bg-white/20' 
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            <span className="material-icons text-lg">
                              {getRoomIcon(room.room_type)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div 
                              className="font-medium text-base truncate"
                              style={{ fontFamily: 'Google Sans, sans-serif' }}
                            >
                              {room.name}
                            </div>
                            <div 
                              className={`text-sm truncate ${
                                activeRoom === room.room_id ? 'text-blue-100' : 'text-gray-500'
                              }`}
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {room.member_count} members • {room.room_type}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Main chat - full width on mobile */}
            <div className={`${isMobile ? 'h-full' : 'col-span-12 lg:col-span-8'} h-full`}>
              <Card className="h-full flex flex-col border-0 rounded-3xl shadow-lg bg-white">
                {/* Add mobile header with menu button */}
                {isMobile && (
                  <div className="lg:hidden p-4 border-b flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSidebar(true)}
                      className="h-10 w-10"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-semibold" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                      {getActiveRoomData()?.name || "Select a room"}
                    </h1>
                  </div>
                )}
                
                {/* Google Chat Header */}
                <CardHeader className="p-6 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-blue-50">
                        <span className="material-icons text-blue-600 text-xl">
                          {getRoomIcon(getActiveRoomData()?.room_type || "general")}
                        </span>
                      </div>
                      <div>
                        <CardTitle 
                          className="text-2xl font-medium text-gray-900"
                          style={{ fontFamily: 'Google Sans, sans-serif' }}
                        >
                          {getActiveRoomData()?.name || "Select a room"}
                        </CardTitle>
                        <p 
                          className="text-gray-600"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {getActiveRoomData()?.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        onClick={() => setShowUserList(true)}
                      >
                        <Users className="h-4 w-4" />
                        {totalUserCount || Array.isArray(onlineUsers) ? onlineUsers.length : getActiveRoomData()?.member_count || 1} members
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-10 w-10 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl shadow-lg border-0">
                          <DropdownMenuItem onClick={() => setSoundEnabled(!soundEnabled)}>
                            {soundEnabled ? <Volume2 className="mr-2 h-4 w-4 text-blue-600" /> : <VolumeX className="mr-2 h-4 w-4 text-gray-400" />}
                            {soundEnabled ? "Mute Sounds" : "Enable Sounds"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" />
                            Share Room
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {/* Google Chat Messages Container */}
                <div 
                  className="flex-1 relative bg-gradient-to-b from-gray-50/30 to-white overflow-hidden"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {/* Drag overlay */}
                  {dragActive && (
                    <div className="absolute inset-0 bg-blue-50/90 border-2 border-dashed border-blue-400 rounded-3xl z-10 flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <div className="text-lg font-medium text-blue-700" style={{ fontFamily: 'Google Sans, sans-serif' }}>
                          Drop files here to upload
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="absolute inset-0 overflow-y-auto px-6 py-4"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    <div className="space-y-6 min-h-full flex flex-col justify-end">
                      {messages.map((message, index) => {
                        const isOwnMessage = message.sender_id === currentUser.user_id;
                        
                        return (
                          <div key={message.message_id || index} className="group">
                            <div className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              {!isOwnMessage && (
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                  <AvatarImage src="" />
                                  <AvatarFallback 
                                    className="text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                  >
                                    {getInitials(message.sender_name)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-center gap-2 mb-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <span 
                                    className="font-medium text-sm text-gray-700"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                  >
                                    {isOwnMessage ? 'You' : message.sender_name}
                                  </span>
                                  <RealTimeTimestamp timestamp={message.timestamp} />
                                  {message.is_edited && (
                                    <Badge variant="secondary" className="text-xs">edited</Badge>
                                  )}
                                </div>
                                
                                <div className={`px-4 py-3 rounded-2xl shadow-sm break-words ${
                                  isOwnMessage 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                  <div 
                                    className="text-sm leading-relaxed"
                                    style={{ fontFamily: 'Roboto, sans-serif' }}
                                  >
                                    {message.content}
                                  </div>
                                  
                                  {/* File preview */}
                                  {message.message_type === 'file' && message.file_url && (
                                    <div className="mt-2 p-2 rounded-lg bg-white/10">
                                      <a 
                                        href={message.file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <Paperclip className="h-4 w-4" />
                                        {message.file_name}
                                      </a>
                                    </div>
                                  )}
                                  
                                  {/* Audio preview */}
                                  {message.message_type === 'audio' && message.file_url && (
                                    <div className="mt-2">
                                      <audio controls className="w-full">
                                        <source src={message.file_url} type="audio/wav" />
                                      </audio>
                                    </div>
                                  )}
                                  
                                  {isOwnMessage && (
                                    <div className="flex justify-end mt-1">
                                      <CheckCheck className="h-4 w-4 text-blue-200" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {isOwnMessage && (
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                  <AvatarImage src="" />
                                  <AvatarFallback 
                                    className="text-sm bg-gradient-to-br from-green-500 to-green-600 text-white"
                                    style={{ fontFamily: 'Google Sans, sans-serif' }}
                                  >
                                    {getInitials(currentUser.username)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Scroll to Bottom Button */}
                  {isUserScrolled && (
                    <div className="absolute bottom-20 right-6">
                      <Button
                        onClick={scrollToBottom}
                        className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute bottom-20 left-6">
                      <div className="flex items-center gap-3 text-sm text-white bg-red-500 rounded-full px-4 py-2 shadow-md">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="absolute bottom-20 left-6">
                      <div className="flex items-center gap-3 text-sm text-gray-500 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                        <span style={{ fontFamily: 'Roboto, sans-serif' }}>Someone is typing...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Chat-style Message Input */}
                <div className="border-t border-gray-100 bg-white p-6 flex-shrink-0 relative">
                  {/* File upload progress */}
                  {uploadingFiles.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {uploadingFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            Uploading {file.name}...
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-end gap-3">
                    <div className="flex gap-2">
                      {/* File upload */}
                      <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <Button 
                        variant="ghost" 
                        className="h-10 w-10 rounded-full hover:bg-gray-100 touch-target"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-5 w-5 text-gray-500" />
                      </Button>
                      
                      {/* Emoji picker */}
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          className="h-10 w-10 rounded-full hover:bg-gray-100 touch-target"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-5 w-5 text-gray-500" />
                        </Button>
                        
                        {showEmojiPicker && (
                          EmojiPicker ? (
                            <div className="absolute bottom-16 left-0 z-50">
                              <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                searchDisabled={false}
                                skinTonesDisabled={false}
                                width={350}
                                height={400}
                              />
                            </div>
                          ) : (
                            <SimpleEmojiSelector />
                          )
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 relative">
                      <Textarea
                        ref={messageInputRef}
                        placeholder={`Message ${getActiveRoomData()?.name || 'this room'}...`}
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          setCursorPosition(e.target.selectionStart || 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[48px] max-h-32 resize-none pr-14 rounded-3xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 message-input"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        disabled={!activeRoom || !isConnected}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !activeRoom || !isConnected}
                        className="absolute bottom-2 right-2 h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full shadow-md disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Microphone recording */}
                    <Button 
                      variant="ghost" 
                      className={`h-10 w-10 rounded-full hover:bg-gray-100 touch-target ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-gray-500" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Community;
