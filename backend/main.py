from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import httpx
import asyncio
from fastapi import HTTPException, UploadFile, File, Form, Response


# Import configuration
from config.settings import get_settings
from config.cors import get_cors_origins

# Import core components
from core.logging import setup_logging
from core.lifespan import lifespan

# Import routers
from auth.routes import router as auth_router
from users.routes import router as users_router
from api.health import router as health_router
from api.config import router as config_router
from api.version import router as version_router
from database.route import router as career_router
from database.routes.profile_routes import router as profile_router 
from database.routes.career_form_router import router as career_form_router
from database.routes.career_recommendations_routes import router as career_recommendations_router

# Import new resume routes
from database.routes.resume_routes import router as resume_router

# Import document routes (with fallback for development)
try:
    from database.routes.documents_routes import router as document_router
    DOCUMENT_ROUTES_ENABLED = True
    logging.info("✅ Document routes loaded")
except ImportError as e:
    logging.warning(f"⚠️ Document routes not loaded: {e}")
    DOCUMENT_ROUTES_ENABLED = False

# Import chat routes (with fallback)
try:
    from chat.routes import router as chat_router
    CHAT_ENABLED = True
except ImportError as e:
    logging.warning(f"⚠️ Chat routes not loaded: {e}")
    CHAT_ENABLED = False

# Initialize settings
settings = get_settings()

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Student Advisor Portal",
    description="Community chat platform with Firestore backend and resume analysis",
    version="1.0.0",
    lifespan=lifespan
)

CHATBOT_SERVICE_URL = "https://chatbot-app-278398219986.us-central1.run.app"

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(users_router, prefix="/api/user", tags=["users"])
app.include_router(health_router, tags=["health"])
app.include_router(config_router, prefix="/api", tags=["configuration"])
app.include_router(version_router, prefix="/api", tags=["version"])
app.include_router(career_router, tags=["career"])
app.include_router(profile_router, tags=["profile"])
app.include_router(career_form_router, tags=["career-form"])
app.include_router(career_recommendations_router, tags=["career-recommendations"])

# Include resume analysis router
app.include_router(resume_router, tags=["resume-analysis"])
logger.info("✅ Resume analysis routes loaded")

# Include document router if available
if DOCUMENT_ROUTES_ENABLED:
    app.include_router(document_router, tags=["documents"])
    logger.info("✅ Document routes included")
else:
    logger.warning("⚠️ Document routes not available")

# Include chat router if available
if CHAT_ENABLED:
    app.include_router(chat_router, tags=["chat"])
    logger.info("✅ Chat routes loaded")

# Debug endpoint to list all routes
@app.get("/debug/routes")
def list_routes():
    """Debug endpoint to list all available routes"""
    routes = []
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": getattr(route, 'name', 'Unknown')
            })
    return {"routes": routes}

@app.get("/debug/chatbot-service")
async def debug_chatbot_service():
    """Debug endpoint to check chatbot service availability"""
    
    results = {}
    
    # Test different possible endpoints
    endpoints_to_test = [
        "/",
        "/chat", 
        "/chat/enhanced",
        "/voice",
        "/health",
        "/docs"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"{CHATBOT_SERVICE_URL}{endpoint}"
                response = await client.get(url)
                results[endpoint] = {
                    "status_code": response.status_code,
                    "available": response.status_code < 400,
                    "url": url,
                    "response_preview": response.text[:200] if response.text else None
                }
        except Exception as e:
            results[endpoint] = {
                "status_code": None,
                "available": False,
                "url": f"{CHATBOT_SERVICE_URL}{endpoint}",
                "error": str(e)
            }
    
    return {
        "chatbot_service_url": CHATBOT_SERVICE_URL,
        "endpoint_tests": results
    }

@app.get("/test/deployed-chatbot")
async def test_deployed_chatbot():
    """Test different request formats with your deployed chatbot service"""
    
    results = {}
    base_url = CHATBOT_SERVICE_URL
    
    # Test different request formats
    test_formats = [
        {
            "name": "format_1_simple_text",
            "data": {"message": "hello"}
        },
        {
            "name": "format_2_with_options",
            "data": {
                "message": "hello",
                "option_id": None,
                "input_type": "text"
            }
        },
        {
            "name": "format_3_menu_option",
            "data": {
                "option_id": "main_menu",
                "input_type": "option"
            }
        }
    ]
    
    for test_format in test_formats:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{base_url}/chat",
                    json=test_format["data"],
                    headers={"Content-Type": "application/json"}
                )
                
                results[test_format["name"]] = {
                    "status_code": response.status_code,
                    "success": response.status_code == 200,
                    "response_preview": response.text[:300] if response.text else None
                }
                
        except Exception as e:
            results[test_format["name"]] = {
                "error": str(e),
                "success": False
            }
    
    return {
        "service_url": base_url,
        "test_results": results
    }

# Complete fallback response system
def get_fallback_response(request_data):
    """Complete fallback chatbot logic"""
    
    option_id = request_data.get("option_id")
    message = request_data.get("message", "").lower() if request_data.get("message") else ""
    input_type = request_data.get("input_type", "text")
    
    # Handle menu options
    if option_id == "main_menu" or (not option_id and not message):
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "👋 Welcome to Student Advisor Portal! I'm your AI career assistant. How can I help you today?",
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
                ],
                "confidence": 95
            }
        }
    
    elif option_id == "explore_features":
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "🔍 **Platform Features** - What would you like to explore?",
                "options": [
                    {"id": "go_career_paths", "text": "🛤️ Career Paths", "description": "Explore career options and industry insights"},
                    {"id": "go_skills", "text": "🎯 Skills Analysis", "description": "Comprehensive skill assessment and development"},
                    {"id": "go_resume", "text": "📄 Resume Builder", "description": "AI-powered resume creation and ATS optimization"},
                    {"id": "go_jobs", "text": "💼 Job Market", "description": "Real-time job market trends and opportunities"},
                    {"id": "go_mentorship", "text": "👥 Mentorship", "description": "Connect with industry professionals"},
                    {"id": "main_menu", "text": "⬅️ Back to Main Menu"}
                ],
                "confidence": 95
            }
        }
    
    elif option_id == "navigate_pages":
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "🧭 **Quick Navigation** - Where would you like to go?",
                "options": [
                    {"id": "go_dashboard", "text": "🏠 Dashboard", "description": "Personal career development hub"},
                    {"id": "go_career_paths", "text": "🛤️ Career Paths", "description": "Explore career options"},
                    {"id": "go_skills", "text": "🎯 Skills Analysis", "description": "Skill assessment and gap analysis"},
                    {"id": "go_resume", "text": "📄 Resume Builder", "description": "Build ATS-optimized resumes"},
                    {"id": "go_jobs", "text": "💼 Job Market", "description": "Browse job opportunities"},
                    {"id": "go_mentorship", "text": "👥 Mentorship", "description": "Find mentors and advisors"},
                    {"id": "go_community", "text": "🤝 Community", "description": "Peer collaboration and networking"},
                    {"id": "go_profile", "text": "👤 Profile", "description": "Manage your account and preferences"},
                    {"id": "main_menu", "text": "⬅️ Back to Main Menu"}
                ],
                "confidence": 95
            }
        }
    
    elif option_id == "career_help":
        return {
            "success": True,
            "response": {
                "type": "advice",
                "message": "💼 **Career Guidance Available:**\n\n• **Career Planning** - Set goals and create personalized roadmaps\n• **Skill Development** - Identify skill gaps and get learning recommendations\n• **Job Search Strategy** - Market insights and opportunity discovery\n• **Resume Optimization** - ATS-friendly resume building and improvement\n• **Interview Preparation** - Practice sessions and expert feedback\n• **Networking** - Connect with mentors and industry professionals\n\nWhat specific area would you like help with today?",
                "confidence": 95,
                "follow_up_options": [
                    {"id": "go_career_paths", "text": "🛤️ Explore Careers"},
                    {"id": "go_skills", "text": "🎯 Analyze Skills"},
                    {"id": "go_resume", "text": "📄 Build Resume"},
                    {"id": "go_jobs", "text": "💼 Find Jobs"},
                    {"id": "main_menu", "text": "🏠 Main Menu"}
                ]
            }
        }
    
    elif option_id == "quick_actions":
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "⚡ **Quick Actions** - Popular features and tasks:",
                "options": [
                    {"id": "go_skills", "text": "🎯 Take Skills Assessment", "description": "Evaluate your current abilities"},
                    {"id": "go_resume", "text": "📊 Check Resume ATS Score", "description": "ATS compatibility analysis"},
                    {"id": "go_jobs", "text": "💼 Browse Latest Jobs", "description": "Current job opportunities"},
                    {"id": "go_dashboard", "text": "📈 View My Progress", "description": "Career development dashboard"},
                    {"id": "go_mentorship", "text": "👥 Find a Mentor", "description": "Connect with industry experts"},
                    {"id": "main_menu", "text": "⬅️ Back to Main Menu"}
                ],
                "confidence": 100
            }
        }
    
    elif option_id == "free_text":
        return {
            "success": True,
            "response": {
                "type": "text",
                "message": "💬 **Ask Me Anything!** I can help you with:\n\n• Career planning and goal setting\n• Skill development and learning paths\n• Resume writing and optimization\n• Job search strategies\n• Interview preparation\n• Industry insights and trends\n• Networking and mentorship\n\nWhat would you like to know about your career development?",
                "confidence": 90,
                "follow_up_options": [
                    {"id": "career_help", "text": "💼 Career Guidance"},
                    {"id": "explore_features", "text": "🔍 Platform Features"},
                    {"id": "main_menu", "text": "🏠 Main Menu"}
                ]
            }
        }
    
    # Handle navigation options
    elif option_id and option_id.startswith("go_"):
        page_mapping = {
            "go_dashboard": ("/dashboard", "Dashboard", "Personal career development hub with progress tracking"),
            "go_career_paths": ("/career-paths", "Career Paths", "Explore career options and industry insights"),
            "go_skills": ("/skills-analysis", "Skills Analysis", "Comprehensive skill assessment and development"),
            "go_resume": ("/resume-builder", "Resume Builder", "AI-powered resume creation and ATS optimization"),
            "go_jobs": ("/job-market", "Job Market", "Real-time job market trends and opportunities"),
            "go_mentorship": ("/mentorship", "Mentorship", "Connect with industry professionals and experts"),
            "go_community": ("/community", "Community", "Peer collaboration and knowledge sharing"),
            "go_profile": ("/profile", "Profile", "Account management and personal preferences")
        }
        
        if option_id in page_mapping:
            page, name, description = page_mapping[option_id]
            return {
                "success": True,
                "response": {
                    "type": "navigation",
                    "message": f"🧭 Taking you to **{name}**...\n\n{description}\n\nYou'll find tools and resources to help advance your career goals.",
                    "page": page,
                    "confidence": 95,
                    "follow_up_options": [
                        {"id": "main_menu", "text": "🏠 Main Menu"},
                        {"id": "navigate_pages", "text": "🧭 Go Somewhere Else"},
                        {"id": "career_help", "text": "💼 Get Career Help"}
                    ]
                }
            }
    
    # Handle text input with intelligent responses
    elif message:
        # Skill-related queries
        if any(word in message for word in ["skill", "skills", "ability", "abilities", "competenc", "talent"]):
            return {
                "success": True,
                "response": {
                    "type": "text",
                    "message": "🎯 **Skills Development Help**\n\nI can help you:\n• Assess your current skill level\n• Identify skill gaps for your target role\n• Find learning resources and courses\n• Track your skill development progress\n• Get personalized recommendations\n\nOur Skills Analysis tool provides comprehensive assessments and personalized development plans.",
                    "confidence": 88,
                    "actions": [{"type": "navigate", "page": "/skills-analysis", "label": "Go to Skills Analysis"}],
                    "follow_up_options": [
                        {"id": "go_skills", "text": "🎯 Start Skills Assessment"},
                        {"id": "career_help", "text": "💼 More Career Help"},
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
        
        # Resume-related queries
        elif any(word in message for word in ["resume", "cv", "curriculum vitae", "ats", "optimize"]):
            return {
                "success": True,
                "response": {
                    "type": "text",
                    "message": "📄 **Resume Building & Optimization**\n\nI can help you:\n• Create ATS-optimized resumes\n• Choose the right template for your industry\n• Write compelling content and descriptions\n• Optimize keywords for better visibility\n• Check ATS compatibility scores\n\nOur Resume Builder uses AI to ensure your resume gets noticed by both ATS systems and hiring managers.",
                    "confidence": 90,
                    "actions": [{"type": "navigate", "page": "/resume-builder", "label": "Go to Resume Builder"}],
                    "follow_up_options": [
                        {"id": "go_resume", "text": "📄 Build Resume"},
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
        
        # Job/Career-related queries
        elif any(word in message for word in ["job", "jobs", "career", "work", "employment", "opportunity", "position"]):
            return {
                "success": True,
                "response": {
                    "type": "text",
                    "message": "💼 **Career & Job Search Support**\n\nI can help you:\n• Explore different career paths and opportunities\n• Understand industry trends and salary ranges\n• Find job openings that match your skills\n• Develop job search strategies\n• Prepare for interviews and networking\n\nExplore our Career Paths section for industry insights or Job Market for current opportunities.",
                    "confidence": 87,
                    "actions": [{"type": "navigate", "page": "/career-paths", "label": "Explore Career Paths"}],
                    "follow_up_options": [
                        {"id": "go_career_paths", "text": "🛤️ Career Paths"},
                        {"id": "go_jobs", "text": "💼 Job Market"},
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
        
        # General greetings and help
        elif any(word in message for word in ["hello", "hi", "hey", "help", "start", "begin"]):
            return {
                "success": True,
                "response": {
                    "type": "text",
                    "message": "👋 **Hello! Welcome to Student Advisor Portal**\n\nI'm your AI career assistant, ready to help you advance your professional journey. I can assist with:\n\n• Career planning and exploration\n• Skills assessment and development\n• Resume building and optimization\n• Job search strategies\n• Interview preparation\n• Professional networking\n\nWhat aspect of your career would you like to focus on today?",
                    "confidence": 92,
                    "follow_up_options": [
                        {"id": "explore_features", "text": "🔍 Explore Features"},
                        {"id": "career_help", "text": "💼 Career Guidance"},
                        {"id": "quick_actions", "text": "⚡ Quick Actions"},
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
        
        # Default intelligent response for other text
        else:
            return {
                "success": True,
                "response": {
                    "type": "text",
                    "message": f"🤔 **I understand you're asking about career development.**\n\nI'm here to help with your professional growth! I can assist you with:\n\n• Career planning and goal setting\n• Skills development and assessment\n• Resume writing and optimization\n• Job search and interview preparation\n• Professional networking and mentorship\n\nCould you tell me more about what specific career help you're looking for?",
                    "confidence": 75,
                    "follow_up_options": [
                        {"id": "career_help", "text": "💼 Career Guidance"},
                        {"id": "explore_features", "text": "🔍 Platform Features"},
                        {"id": "free_text", "text": "💬 Ask Differently"},
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
    
    # Final fallback
    return {
        "success": True,
        "response": {
            "type": "options",
            "message": "I'm here to help with your career development! What would you like to explore?",
            "options": [
                {"id": "career_help", "text": "💼 Get Career Guidance"},
                {"id": "explore_features", "text": "🔍 Explore Platform Features"},
                {"id": "navigate_pages", "text": "🧭 Navigate to Pages"},
                {"id": "quick_actions", "text": "⚡ Quick Actions"}
            ],
            "confidence": 80
        }
    }

@app.post("/api/chat/enhanced")
async def proxy_enhanced_chat(request: dict):
    """Enhanced chatbot proxy with comprehensive fallback"""
    try:
        logger.info(f"Received chatbot request: {request}")
        
        # Transform request
        transformed_request = {
            "message": request.get("message"),
            "option_id": request.get("option_id") or request.get("optionId"),
            "current_page": request.get("current_page") or request.get("currentPage"),
            "input_type": request.get("input_type", "text") or request.get("inputType", "text"),
            "session_id": request.get("session_id")
        }
        
        logger.info(f"Transformed request: {transformed_request}")
        
        # Try deployed service first, but always fall back on any error
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{CHATBOT_SERVICE_URL}/chat",  # Use /chat endpoint (not /chat/enhanced)
                    json=transformed_request,
                    headers={"Content-Type": "application/json"}
                )
                
                logger.info(f"Chatbot service response status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    # Check if the response is in expected format
                    if result.get("success") and result.get("response"):
                        logger.info("Using deployed service response")
                        return result
                    else:
                        logger.warning("Deployed service returned unexpected format, using fallback")
                        raise ValueError("Unexpected response format")
                else:
                    logger.warning(f"Deployed service error: {response.status_code}, using fallback")
                    raise httpx.RequestError("Service returned error")
                    
        except Exception as service_error:
            logger.info(f"Using fallback due to service issue: {service_error}")
            # Always use fallback - it's comprehensive and works well
            fallback_response = get_fallback_response(transformed_request)
            return fallback_response
        
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        # Even if there's an unexpected error, provide a working response
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "👋 Welcome! I'm your AI career assistant. How can I help you today?",
                "options": [
                    {"id": "career_help", "text": "💼 Career Guidance"},
                    {"id": "explore_features", "text": "🔍 Platform Features"},
                    {"id": "navigate_pages", "text": "🧭 Quick Navigation"}
                ],
                "confidence": 85
            }
        }

@app.post("/api/chat/voice")
async def proxy_voice_chat(file: UploadFile = File(...), current_page: str = Form(None)):
    """Enhanced voice processing with fallback to text suggestions"""
    try:
        logger.info(f"Received voice chat request for file: {file.filename}")
        
        if not file.filename:
            return {
                "success": False,
                "error": "No file provided",
                "message": "Please select an audio file to upload.",
                "response": {
                    "type": "error",
                    "message": "No audio file was provided. Please try recording again.",
                    "confidence": 0,
                    "follow_up_options": [{"id": "main_menu", "text": "🏠 Main Menu"}]
                }
            }
        
        file_content = await file.read()
        if len(file_content) == 0:
            return {
                "success": False,
                "error": "Empty file",
                "message": "The uploaded file is empty. Please try recording again.",
                "response": {
                    "type": "error",
                    "message": "The audio file appears to be empty. Please try recording again.",
                    "confidence": 0,
                    "follow_up_options": [{"id": "main_menu", "text": "🏠 Main Menu"}]
                }
            }
        
        logger.info(f"Processing voice file: {file.filename}, size: {len(file_content)} bytes")
        
        # Try deployed voice service first
        try:
            files = {
                "file": (file.filename, file_content, file.content_type or "audio/wav")
            }
            data = {
                "current_page": current_page or "/"
            }
            
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(
                    f"{CHATBOT_SERVICE_URL}/voice",
                    files=files,
                    data=data
                )
                
                logger.info(f"Voice service response status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info("Voice processing successful via deployed service")
                    return result
                else:
                    error_text = response.text
                    logger.warning(f"Voice service error: {response.status_code} - {error_text}")
                    raise httpx.RequestError(f"Voice service returned {response.status_code}")
                    
        except Exception as voice_error:
            logger.warning(f"Voice service failed: {voice_error}, providing fallback response")
            
            # Provide helpful fallback response for voice
            return {
                "success": False,
                "error": "Voice service temporarily unavailable",
                "message": "Voice processing is currently offline. Please use text input instead.",
                "transcript": "Voice processing unavailable",
                "response": {
                    "type": "text",
                    "message": "🎤 **Voice processing is temporarily unavailable.**\n\nI heard you trying to use voice input, but our voice recognition service is currently offline. Don't worry - I'm still here to help!\n\n**Alternative ways to get help:**\n• Type your question in the text box below\n• Use the menu options I provide\n• Ask me about career development topics\n\nWhat would you like to know about your career development?",
                    "confidence": 80,
                    "follow_up_options": [
                        {"id": "career_help", "text": "💼 Career Guidance"},
                        {"id": "explore_features", "text": "🔍 Platform Features"},
                        {"id": "free_text", "text": "💬 Ask Me Anything"},
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
                
    except Exception as e:
        logger.error(f"Voice chat error: {str(e)}")
        return {
            "success": False,
            "error": f"Voice processing failed: {str(e)}",
            "message": "Voice processing failed. Please try text input instead.",
            "response": {
                "type": "error",
                "message": "Sorry, I couldn't process your voice message. Please try typing your question instead.",
                "confidence": 0,
                "follow_up_options": [
                    {"id": "main_menu", "text": "🏠 Main Menu"},
                    {"id": "free_text", "text": "💬 Ask Me Anything"}
                ]
            }
        }

@app.get("/api/chat/status")
async def get_chatbot_status():
    """Get chatbot service status"""
    try:
        # Try /health endpoint first (from your debug test)
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{CHATBOT_SERVICE_URL}/health")
            if response.status_code == 200:
                health_data = response.json()
                return {
                    "status": "operational",
                    "service_health": health_data,
                    "proxy_status": "connected",
                    "service_url": CHATBOT_SERVICE_URL,
                    "available_endpoints": ["/chat", "/voice", "/health"]
                }
            else:
                return {
                    "status": "service_error",
                    "proxy_status": "fallback_active",
                    "message": f"Health check returned {response.status_code}",
                    "service_url": CHATBOT_SERVICE_URL
                }
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        return {
            "status": "offline",
            "proxy_status": "fallback_active", 
            "error": str(e),
            "service_url": CHATBOT_SERVICE_URL,
            "message": "Chatbot service is offline, using fallback responses"
        }

@app.get("/api/chat/audio/{filename}")
async def proxy_audio(filename: str):
    """Proxy audio file requests"""
    try:
        # Check if your deployed service has an audio endpoint
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Try different possible audio endpoints
            possible_endpoints = [
                f"/audio/{filename}",
                f"/files/{filename}",
                f"/static/{filename}"
            ]
            
            for endpoint in possible_endpoints:
                try:
                    response = await client.get(f"{CHATBOT_SERVICE_URL}{endpoint}")
                    if response.status_code == 200:
                        return Response(
                            content=response.content,
                            media_type="audio/mpeg",
                            headers={"Content-Disposition": f"inline; filename={filename}"}
                        )
                except:
                    continue
                    
            # If no audio endpoint works
            raise HTTPException(status_code=404, detail=f"Audio file not found: {filename}")
                
    except Exception as e:
        logger.error(f"Audio proxy error: {e}")
        raise HTTPException(status_code=404, detail="Audio not available")

# Root endpoint
@app.get("/")
def root():
    """API root endpoint"""
    return {
        "message": "Student Advisor Portal API",
        "version": "1.0.0",
        "database": "Firestore",
        "storage": "Google Cloud Storage" if DOCUMENT_ROUTES_ENABLED else "Not configured",
        "status": "running",
        "websocket_url": "/api/chat/ws/{user_id}" if CHAT_ENABLED else None,
        "docs": "/docs",
        "debug_routes": "/debug/routes",
        "features": {
            "chat": CHAT_ENABLED,
            "authentication": True,
            "user_management": True,
            "career_guidance": True,
            "profile_management": True,
            "career_forms": True,
            "resume_analysis": True,
            "document_management": DOCUMENT_ROUTES_ENABLED,
            "file_storage": "GCP Storage" if DOCUMENT_ROUTES_ENABLED else "Not configured",
            "enhanced_chatbot": True,
            "voice_chat": True,
            "option_based_navigation": True,
        },
        "chatbot_endpoints": {
            "enhanced_chat": "/api/chat/enhanced",
            "voice_chat": "/api/chat/voice", 
            "chat_status": "/api/chat/status",
            "audio_files": "/api/chat/audio/{filename}"
        },
        "available_endpoints": {
            "resume_analysis": "/api/resume/analyze",
            "resume_health": "/api/resume/health",
            "resume_test": "/api/resume/test",
            "documents": "/api/documents/upload/{user_email}" if DOCUMENT_ROUTES_ENABLED else "Not available",
            "health": "/health",
            "docs": "/docs"
        }
    }

# Temporary document upload endpoint for development (remove after proper setup)
if not DOCUMENT_ROUTES_ENABLED:
    from fastapi import HTTPException, UploadFile, File, Form
    from typing import List, Optional
    
    @app.post("/api/documents/upload/{user_email}")
    async def temp_upload_documents(
        user_email: str,
        domain: str = Form(...),
        portfolio_url: Optional[str] = Form(None),
        linkedin_url: Optional[str] = Form(None),
        github_url: Optional[str] = Form(None),
        personal_portfolio_url: Optional[str] = Form(None),
        resume: Optional[UploadFile] = File(None),
        certificates: List[UploadFile] = File(default=[])
    ):
        """Temporary document upload endpoint for development"""
        logger.warning("Using temporary document upload endpoint")
        
        # Simulate processing
        uploaded_files = []
        total_size = 0
        
        if resume and resume.filename:
            content = await resume.read()
            uploaded_files.append({
                "type": "resume",
                "filename": resume.filename,
                "size": len(content)
            })
            total_size += len(content)
        
        for cert in certificates:
            if cert.filename:
                content = await cert.read()
                uploaded_files.append({
                    "type": "certificate", 
                    "filename": cert.filename,
                    "size": len(content)
                })
                total_size += len(content)
        
        return {
            "success": True,
            "message": f"Development mode: {len(uploaded_files)} file(s) received but not stored",
            "user_email": user_email,
            "uploaded_files": uploaded_files,
            "total_files": len(uploaded_files),
            "total_size": total_size,
            "note": "Files are not actually stored in development mode. Set up GCP Storage for production.",
            "data_received": {
                "domain": domain,
                "portfolio_url": portfolio_url,
                "linkedin_url": linkedin_url,
                "github_url": github_url,
                "personal_portfolio_url": personal_portfolio_url
            }
        }

# Run configuration
if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )