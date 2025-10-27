import os
import uuid
import json
from fastapi import FastAPI, UploadFile, Form, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google.cloud import speech
from gtts import gTTS
import vertexai
from vertexai.generative_models import GenerativeModel
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

# Settings
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/app/key.json"
PROJECT_ID = "electric-medium-472710-f8"
LOCATION = "us-central1"

# Initialize Vertex AI
vertexai.init(project=PROJECT_ID, location=LOCATION)
model = GenerativeModel("gemini-2.5-flash")

app = FastAPI(title="Enhanced Career Chatbot", version="2.0.0")

# CORS for your FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this to your FastAPI backend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load static knowledge base
knowledge_base = {
    "website_info": {
        "name": "Student Advisor Portal",
        "description": "AI-powered career guidance platform",
        "features": [
            "Career path exploration",
            "Skills analysis and development",
            "Resume building with ATS optimization", 
            "Job market insights",
            "Professional mentorship",
            "Community collaboration"
        ]
    },
    "pages": {
        "/dashboard": {
            "name": "Dashboard",
            "description": "Personal career development hub with progress tracking",
            "features": ["Progress tracking", "Quick actions", "Personalized insights"]
        },
        "/career-paths": {
            "name": "Career Paths", 
            "description": "Explore career options and industry insights",
            "features": ["Industry exploration", "Career roadmaps", "Salary insights"]
        },
        "/skills-analysis": {
            "name": "Skills Analysis",
            "description": "Comprehensive skill assessment and development",
            "features": ["Skill assessment", "Gap analysis", "Learning recommendations"]
        },
        "/resume-builder": {
            "name": "Resume Builder",
            "description": "AI-powered resume creation and ATS optimization", 
            "features": ["ATS optimization", "Template selection", "Content suggestions"]
        },
        "/job-market": {
            "name": "Job Market",
            "description": "Real-time job market trends and opportunities",
            "features": ["Job listings", "Market analysis", "Salary trends"]
        },
        "/mentorship": {
            "name": "Mentorship",
            "description": "Connect with industry professionals",
            "features": ["Mentor matching", "Session booking", "Expert advice"]
        },
        "/community": {
            "name": "Community", 
            "description": "Peer collaboration and knowledge sharing",
            "features": ["Discussion forums", "Peer support", "Networking"]
        },
        "/profile": {
            "name": "Profile",
            "description": "Account management and preferences",
            "features": ["Personal settings", "Achievements", "Goals"]
        },
        "/ats": {
            "name": "ATS Analysis",
            "description": "Resume ATS compatibility checking",
            "features": ["ATS scoring", "Optimization suggestions", "Keyword analysis"]
        }
    },
    "main_menu": {
        "greeting": "👋 Welcome to Student Advisor Portal! I'm your AI career assistant. How can I help you today?",
        "options": [
            {
                "id": "explore_features",
                "text": "🔍 Explore Platform Features",
                "description": "Learn about our career development tools"
            },
            {
                "id": "navigate_pages", 
                "text": "🧭 Navigate to Specific Page",
                "description": "Quick access to different sections"
            },
            {
                "id": "career_help",
                "text": "💼 Get Career Guidance", 
                "description": "Personalized career advice"
            },
            {
                "id": "quick_actions",
                "text": "⚡ Quick Actions",
                "description": "Popular tasks and features"
            },
            {
                "id": "free_text",
                "text": "💬 Ask Me Anything",
                "description": "Type your own question"
            }
        ]
    },
    "navigate_options": [
        {"id": "go_dashboard", "text": "🏠 Dashboard", "page": "/dashboard"},
        {"id": "go_career_paths", "text": "🛤️ Career Paths", "page": "/career-paths"},
        {"id": "go_skills", "text": "🎯 Skills Analysis", "page": "/skills-analysis"},
        {"id": "go_resume", "text": "📄 Resume Builder", "page": "/resume-builder"},
        {"id": "go_jobs", "text": "💼 Job Market", "page": "/job-market"},
        {"id": "go_mentorship", "text": "👥 Mentorship", "page": "/mentorship"},
        {"id": "go_community", "text": "🤝 Community", "page": "/community"},
        {"id": "go_profile", "text": "👤 Profile", "page": "/profile"},
        {"id": "go_ats", "text": "📊 ATS Analysis", "page": "/ats"}
    ]
}

# Request Models
class ChatRequest(BaseModel):
    message: Optional[str] = None
    option_id: Optional[str] = None
    current_page: Optional[str] = None
    input_type: str = "text"

class OptionResponse(BaseModel):
    type: str = "options"
    message: str
    options: List[Dict[str, Any]]
    confidence: int = 100

# Helper Functions
def get_main_menu():
    return {
        "type": "options",
        "message": knowledge_base["main_menu"]["greeting"],
        "options": knowledge_base["main_menu"]["options"],
        "confidence": 100
    }

def handle_navigation_option(option_id: str):
    nav_options = knowledge_base["navigate_options"]
    selected = next((opt for opt in nav_options if opt["id"] == option_id), None)
    
    if selected:
        page_info = knowledge_base["pages"].get(selected["page"], {})
        return {
            "type": "navigation",
            "message": f"🧭 Taking you to **{page_info.get('name', 'page')}**...\n\n{page_info.get('description', 'Loading...')}",
            "page": selected["page"],
            "confidence": 95,
            "follow_up_options": [
                {"id": "main_menu", "text": "🏠 Main Menu"},
                {"id": "navigate_pages", "text": "🧭 Go Somewhere Else"}
            ]
        }
    
    return {"type": "error", "message": "Page not found", "confidence": 0}

def handle_option_selection(option_id: str):
    if option_id == "main_menu":
        return get_main_menu()
    
    elif option_id == "navigate_pages":
        return {
            "type": "options",
            "message": "🧭 **Quick Navigation** - Where would you like to go?",
            "options": [
                {"id": opt["id"], "text": opt["text"], "description": f"Go to {opt['text']}"} 
                for opt in knowledge_base["navigate_options"]
            ] + [{"id": "main_menu", "text": "⬅️ Back to Main Menu"}],
            "confidence": 100
        }
    
    elif option_id.startswith("go_"):
        return handle_navigation_option(option_id)
    
    elif option_id == "explore_features":
        return {
            "type": "options", 
            "message": "🔍 **Platform Features** - What would you like to explore?",
            "options": [
                {"id": "feature_career", "text": "🎯 Career Development Tools", "description": "Career planning and guidance"},
                {"id": "feature_analysis", "text": "📊 Analysis Tools", "description": "Skills and resume analysis"},
                {"id": "feature_networking", "text": "🤝 Networking Tools", "description": "Mentorship and community"},
                {"id": "main_menu", "text": "⬅️ Back to Main Menu"}
            ],
            "confidence": 98
        }
    
    elif option_id == "career_help":
        return {
            "type": "advice",
            "message": "💼 **Career Guidance Available:**\n\n• **Career Planning** - Set goals and create roadmaps\n• **Skill Development** - Identify gaps and learning paths\n• **Job Search** - Market insights and opportunities\n• **Resume Optimization** - ATS-friendly resume building\n• **Interview Prep** - Practice and feedback\n\nWhat specific area would you like help with?",
            "confidence": 95,
            "follow_up_options": [
                {"id": "go_career_paths", "text": "🛤️ Explore Careers"},
                {"id": "go_skills", "text": "🎯 Analyze Skills"},
                {"id": "go_resume", "text": "📄 Build Resume"},
                {"id": "main_menu", "text": "🏠 Main Menu"}
            ]
        }
    
    elif option_id == "quick_actions":
        return {
            "type": "options",
            "message": "⚡ **Quick Actions** - Popular features:",
            "options": [
                {"id": "go_skills", "text": "🎯 Skills Assessment", "description": "Evaluate your abilities"},
                {"id": "go_ats", "text": "📊 Check Resume ATS", "description": "ATS compatibility check"},
                {"id": "go_jobs", "text": "💼 Browse Jobs", "description": "Current opportunities"},
                {"id": "go_dashboard", "text": "📈 View Progress", "description": "Your career dashboard"},
                {"id": "main_menu", "text": "⬅️ Back to Main Menu"}
            ],
            "confidence": 100
        }
    
    else:
        return {
            "type": "error",
            "message": "I didn't understand that option. Let me show you the main menu.",
            "confidence": 0,
            "follow_up_options": [{"id": "main_menu", "text": "🏠 Main Menu"}]
        }

def process_text_with_ai(text: str, current_page: str = None):
    context = f"""
    You are an AI career advisor for Student Advisor Portal.
    
    WEBSITE INFO: {json.dumps(knowledge_base['website_info'])}
    AVAILABLE PAGES: {json.dumps(knowledge_base['pages'])}
    
    USER QUESTION: {text}
    CURRENT PAGE: {current_page or 'Unknown'}
    
    Provide helpful career advice and suggest relevant pages if appropriate.
    Keep response concise (2-3 sentences max).
    """
    
    try:
        chat = model.start_chat()
        response = chat.send_message(context)
        
        # Extract page suggestions
        suggested_pages = []
        text_lower = text.lower()
        if "skill" in text_lower: suggested_pages.append("/skills-analysis")
        if "resume" in text_lower: suggested_pages.append("/resume-builder") 
        if "job" in text_lower: suggested_pages.append("/job-market")
        if "career" in text_lower: suggested_pages.append("/career-paths")
        
        result = {
            "type": "text",
            "message": response.text,
            "confidence": 85,
            "follow_up_options": [{"id": "main_menu", "text": "🏠 Main Menu"}]
        }
        
        if suggested_pages:
            page = suggested_pages[0]
            page_info = knowledge_base["pages"].get(page, {})
            result["actions"] = [{
                "type": "navigate",
                "page": page,
                "label": f"Go to {page_info.get('name', page)}"
            }]
        
        return result
        
    except Exception as e:
        return {
            "type": "error", 
            "message": "I'm having trouble processing your request. Please try the menu options.",
            "confidence": 0,
            "follow_up_options": [{"id": "main_menu", "text": "🏠 Main Menu"}]
        }

# API Endpoints
@app.get("/")
def root():
    return {
        "message": "Enhanced Career Chatbot API 🤖",
        "version": "2.0.0",
        "features": ["Option-based chat", "AI text processing", "Voice support", "Page navigation"],
        "endpoints": {
            "/chat/enhanced": "Enhanced chat with options",
            "/voice": "Voice input processing", 
            "/chat/status": "Service status"
        }
    }

@app.post("/chat/enhanced")
def enhanced_chat(request: ChatRequest):
    try:
        if request.input_type == "option" and request.option_id:
            if request.option_id == "main_menu" or not request.option_id:
                response = get_main_menu()
            else:
                response = handle_option_selection(request.option_id)
        
        elif request.input_type == "text" and request.message:
            response = process_text_with_ai(request.message, request.current_page)
        
        else:
            response = get_main_menu()
        
        return {
            "success": True,
            "response": response,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        return {
            "success": False,
            "response": {
                "type": "error",
                "message": "Service error. Please try again.",
                "confidence": 0
            }
        }

@app.post("/voice")
async def voice_chat(file: UploadFile, current_page: str = Form(None)):
    try:
        # Save uploaded audio
        audio_path = f"temp_{uuid.uuid4().hex}.wav"
        with open(audio_path, "wb") as f:
            f.write(await file.read())
        
        # Transcribe audio
        client = speech.SpeechClient()
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
        
        audio = speech.RecognitionAudio(content=audio_bytes)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )
        
        response = client.recognize(config=config, audio=audio)
        transcript = " ".join([r.alternatives[0].transcript for r in response.results])
        
        # Process transcript with AI
        ai_response = process_text_with_ai(transcript, current_page)
        
        # Generate speech response
        speech_text = ai_response["message"]
        # Clean text for speech (remove emojis and markdown)
        import re
        speech_text = re.sub(r'[🔍🚀🧭💼⚡💬🎯📊🤝💼🏠📄👥]', '', speech_text)
        speech_text = re.sub(r'\*\*(.*?)\*\*', r'\1', speech_text)
        
        mp3_file = f"reply_{uuid.uuid4().hex}.mp3"
        tts = gTTS(text=speech_text, lang="en")
        tts.save(mp3_file)
        
        # Cleanup
        os.remove(audio_path)
        
        return {
            "success": True,
            "transcript": transcript,
            "response": ai_response,
            "audio_url": f"/audio/{mp3_file}"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Voice processing failed"
        }

@app.get("/audio/{filename}")
def get_audio(filename: str):
    return FileResponse(filename, media_type="audio/mpeg")

@app.get("/chat/status")
def chat_status():
    return {
        "status": "operational",
        "version": "2.0.0",
        "capabilities": {
            "text_chat": True,
            "voice_chat": True,
            "option_navigation": True,
            "page_routing": True
        },
        "knowledge_base": {
            "pages": len(knowledge_base["pages"]),
            "menu_options": len(knowledge_base["main_menu"]["options"])
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=False)