from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
import logging
import httpx
import asyncio
from typing import List, Optional
import uuid
from datetime import timedelta

# Import configuration
from config.settings import get_settings
from config.cors import get_cors_origins

# Import core components
from core.logging import setup_logging
from core.lifespan import lifespan

# Import Firebase
import firebase_admin
from firebase_admin import credentials, storage, firestore

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

# Initialize Firebase Storage
firebase_bucket = None
FIREBASE_STORAGE_ENABLED = False

try:
    # Check if Firebase is already initialized
    if not firebase_admin._apps:
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'ai-advisor-86f45.firebasestorage.app'
        })
    
    firebase_bucket = storage.bucket()
    FIREBASE_STORAGE_ENABLED = True
    logger.info("✅ Firebase Storage initialized successfully")
    logger.info(f"✅ Storage bucket: {firebase_bucket.name}")
except Exception as e:
    logger.error(f"❌ Firebase Storage initialization failed: {e}")
    FIREBASE_STORAGE_ENABLED = False

# Create FastAPI app
app = FastAPI(
    title="Student Advisor Portal",
    description="Community chat platform with Firestore backend and Firebase Storage",
    version="1.0.0",
    lifespan=lifespan
)

CHATBOT_SERVICE_URL = "https://chatbot-service-i0vy.onrender.com"

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8000",
        "https://your-frontend-domain.com",
        "*"
    ],
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
app.include_router(resume_router, tags=["resume-analysis"])

logger.info("✅ Resume analysis routes loaded")

# Include chat router if available
if CHAT_ENABLED:
    app.include_router(chat_router, tags=["chat"])
    logger.info("✅ Chat routes loaded")

# ==================== FIREBASE STORAGE DOCUMENT UPLOAD ====================

@app.post("/api/documents/upload/{user_email}")
async def upload_documents_firebase(
    user_email: str,
    resume: UploadFile = File(...),
    certificates: List[UploadFile] = File(default=[]),
    domain: str = Form(...),
    portfolioUrl: str = Form(default=""),
    linkedinUrl: str = Form(default=""),
    githubUrl: str = Form(default=""),
    personalPortfolioUrl: str = Form(default="")
):
    """
    Upload user documents to Firebase Storage
    """
    try:
        if not FIREBASE_STORAGE_ENABLED or firebase_bucket is None:
            raise HTTPException(
                status_code=503,
                detail="Firebase Storage not available. Please check configuration."
            )
        
        logger.info(f"📤 Starting document upload for user: {user_email}")
        
        # Sanitize email for folder name
        user_folder = user_email.replace("@", "_at_").replace(".", "_")
        
        # Upload Resume
        resume_url = None
        resume_filename = None
        if resume and resume.filename:
            logger.info(f"📄 Uploading resume: {resume.filename}")
            
            # Create unique filename
            file_extension = resume.filename.split('.')[-1]
            resume_filename = f"resumes/{user_folder}/{uuid.uuid4()}.{file_extension}"
            
            # Read file content
            resume_content = await resume.read()
            
            # Create blob and upload
            resume_blob = firebase_bucket.blob(resume_filename)
            resume_blob.upload_from_string(
                resume_content,
                content_type=resume.content_type or 'application/pdf'
            )
            
            # Generate signed URL (valid for 1 year)
            resume_url = resume_blob.generate_signed_url(
                expiration=timedelta(days=365),
                version="v4"
            )
            
            logger.info(f"✅ Resume uploaded successfully: {resume_filename}")
        
        # Upload Certificates
        certificate_urls = []
        if certificates:
            logger.info(f"📜 Uploading {len(certificates)} certificate(s)")
            
            for idx, cert in enumerate(certificates):
                if cert.filename:
                    # Create unique filename
                    file_extension = cert.filename.split('.')[-1]
                    cert_filename = f"certificates/{user_folder}/{uuid.uuid4()}.{file_extension}"
                    
                    # Read certificate content
                    cert_content = await cert.read()
                    
                    # Create blob and upload
                    cert_blob = firebase_bucket.blob(cert_filename)
                    cert_blob.upload_from_string(
                        cert_content,
                        content_type=cert.content_type or 'application/pdf'
                    )
                    
                    # Generate signed URL
                    cert_url = cert_blob.generate_signed_url(
                        expiration=timedelta(days=365),
                        version="v4"
                    )
                    
                    certificate_urls.append({
                        "filename": cert.filename,
                        "url": cert_url,
                        "storage_path": cert_filename
                    })
                    
                    logger.info(f"✅ Certificate {idx + 1} uploaded: {cert.filename}")
        
        # Save metadata to Firestore
        try:
            db = firestore.client()
            
            doc_data = {
                "userEmail": user_email,
                "domain": domain,
                "portfolioUrl": portfolioUrl,
                "linkedinUrl": linkedinUrl,
                "githubUrl": githubUrl,
                "personalPortfolioUrl": personalPortfolioUrl,
                "resumeUrl": resume_url,
                "resumeFilename": resume.filename if resume else None,
                "resumeStoragePath": resume_filename,
                "certificates": certificate_urls,
                "uploadedAt": firestore.SERVER_TIMESTAMP,
                "totalCertificates": len(certificate_urls)
            }
            
            # Save to Firestore
            db.collection('user_documents').document(user_email).set(doc_data)
            logger.info(f"✅ Metadata saved to Firestore for {user_email}")
            
        except Exception as firestore_error:
            logger.warning(f"⚠️ Failed to save metadata to Firestore: {firestore_error}")
        
        return {
            "success": True,
            "message": "Documents uploaded successfully to Firebase Storage",
            "user_email": user_email,
            "resume": {
                "filename": resume.filename if resume else None,
                "url": resume_url,
                "storage_path": resume_filename
            },
            "certificates": certificate_urls,
            "certificate_count": len(certificate_urls),
            "metadata": {
                "domain": domain,
                "portfolioUrl": portfolioUrl,
                "socialLinks": {
                    "linkedin": linkedinUrl,
                    "github": githubUrl,
                    "portfolio": personalPortfolioUrl
                }
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Upload error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Resume upload failed: {str(e)}"
        )


@app.get("/api/documents/{user_email}")
async def get_user_documents(user_email: str):
    """Get user's uploaded documents from Firestore"""
    try:
        db = firestore.client()
        
        # Get document metadata from Firestore
        doc_ref = db.collection('user_documents').document(user_email)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail="User documents not found"
            )
        
        return {
            "success": True,
            "user_email": user_email,
            "documents": doc.to_dict()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/documents/{user_email}/resume")
async def delete_resume(user_email: str):
    """Delete user's resume from Firebase Storage"""
    try:
        if not FIREBASE_STORAGE_ENABLED or firebase_bucket is None:
            raise HTTPException(
                status_code=503,
                detail="Firebase Storage not available"
            )
        
        user_folder = user_email.replace("@", "_at_").replace(".", "_")
        
        # List all blobs in user's resume folder
        blobs = list(firebase_bucket.list_blobs(prefix=f"resumes/{user_folder}/"))
        
        if not blobs:
            raise HTTPException(
                status_code=404,
                detail="No resume found for this user"
            )
        
        # Delete all resume files
        for blob in blobs:
            blob.delete()
            logger.info(f"🗑️ Deleted: {blob.name}")
        
        # Update Firestore
        try:
            db = firestore.client()
            db.collection('user_documents').document(user_email).update({
                "resumeUrl": None,
                "resumeFilename": None,
                "resumeStoragePath": None
            })
        except Exception as e:
            logger.warning(f"⚠️ Failed to update Firestore: {e}")
        
        return {
            "success": True,
            "message": "Resume deleted successfully",
            "deleted_files": len(blobs)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CHATBOT PROXY ENDPOINTS ====================

# Complete fallback response system
def get_fallback_response(request_data):
    """Complete fallback chatbot logic"""
    option_id = request_data.get("option_id")
    message = request_data.get("message", "").lower() if request_data.get("message") else ""
    input_type = request_data.get("input_type", "text")
    
    # Handle main menu
    if option_id == "main_menu" or (not option_id and not message):
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "👋 Welcome to Student Advisor Portal! I'm your AI career assistant. How can I help you today?",
                "options": [
                    {"id": "explore_features", "text": "🔍 Explore Platform Features", "description": "Learn about our career development tools"},
                    {"id": "navigate_pages", "text": "🧭 Navigate to Specific Page", "description": "Quick access to different sections"},
                    {"id": "career_help", "text": "💼 Get Career Guidance", "description": "Personalized career advice"},
                    {"id": "quick_actions", "text": "⚡ Quick Actions", "description": "Popular tasks and features"},
                    {"id": "free_text", "text": "💬 Ask Me Anything", "description": "Type your own question"}
                ],
                "confidence": 95
            }
        }
    
    # Handle explore features
    elif option_id == "explore_features":
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "🔍 **Platform Features** - What would you like to explore?",
                "options": [
                    {"id": "go_career_paths", "text": "🚀 Career Paths", "description": "Explore career options and industry insights"},
                    {"id": "go_skills", "text": "🎯 Skills Analysis", "description": "Comprehensive skill assessment and development"},
                    {"id": "go_resume", "text": "📄 Resume Builder", "description": "AI-powered resume creation and ATS optimization"},
                    {"id": "go_jobs", "text": "💼 Job Market", "description": "Real-time job market trends and opportunities"},
                    {"id": "go_mentorship", "text": "🤝 Mentorship", "description": "Connect with industry professionals"},
                    {"id": "main_menu", "text": "🏠 Back to Main Menu"}
                ],
                "confidence": 95
            }
        }
    
    # Handle navigation
    elif option_id == "navigate_pages":
        return {
            "success": True,
            "response": {
                "type": "options",
                "message": "🧭 **Quick Navigation** - Where would you like to go?",
                "options": [
                    {"id": "go_dashboard", "text": "📊 Dashboard", "description": "Personal career development hub"},
                    {"id": "go_career_paths", "text": "🚀 Career Paths", "description": "Explore career options"},
                    {"id": "go_skills", "text": "🎯 Skills Analysis", "description": "Skill assessment and gap analysis"},
                    {"id": "go_resume", "text": "📄 Resume Builder", "description": "Build ATS-optimized resumes"},
                    {"id": "go_jobs", "text": "💼 Job Market", "description": "Browse job opportunities"},
                    {"id": "go_mentorship", "text": "🤝 Mentorship", "description": "Find mentors and advisors"},
                    {"id": "go_community", "text": "👥 Community", "description": "Peer collaboration and networking"},
                    {"id": "go_profile", "text": "⚙️ Profile", "description": "Manage your account and preferences"},
                    {"id": "main_menu", "text": "🏠 Back to Main Menu"}
                ],
                "confidence": 95
            }
        }
    
    # Default fallback
    return {
        "success": True,
        "response": {
            "type": "options",
            "message": "👋 I'm here to help with your career development! What would you like to explore?",
            "options": [
                {"id": "career_help", "text": "💼 Get Career Guidance"},
                {"id": "explore_features", "text": "🔍 Explore Platform Features"},
                {"id": "navigate_pages", "text": "🧭 Navigate to Pages"},
                {"id": "quick_actions", "text": "⚡ Quick Actions"}
            ],
            "confidence": 80
        }
    }


@app.post("/chat/enhanced")
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
        
        # Try deployed service, fallback on error
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{CHATBOT_SERVICE_URL}/chat",
                    json=transformed_request,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success") and result.get("response"):
                        return result
                    else:
                        raise ValueError("Unexpected response format")
                else:
                    raise httpx.RequestError("Service returned error")
                    
        except Exception as service_error:
            logger.info(f"Using fallback: {service_error}")
            return get_fallback_response(transformed_request)
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return get_fallback_response({})


@app.post("/api/chat/voice")
async def proxy_voice_chat(file: UploadFile = File(...), current_page: str = Form(None)):
    """Voice processing with fallback"""
    try:
        logger.info(f"Voice request: {file.filename}")
        
        file_content = await file.read()
        
        # Try deployed service
        try:
            files = {"file": (file.filename, file_content, file.content_type or "audio/wav")}
            data = {"current_page": current_page or "/"}
            
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(
                    f"{CHATBOT_SERVICE_URL}/voice",
                    files=files,
                    data=data
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    raise httpx.RequestError("Voice service error")
                    
        except Exception:
            return {
                "success": False,
                "error": "Voice service unavailable",
                "message": "Please use text input instead",
                "response": {
                    "type": "text",
                    "message": "🎤 Voice processing temporarily unavailable. Please type your question.",
                    "confidence": 80,
                    "follow_up_options": [
                        {"id": "main_menu", "text": "🏠 Main Menu"}
                    ]
                }
            }
                
    except Exception as e:
        logger.error(f"Voice error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/chat/status")
async def get_chatbot_status():
    """Get chatbot service status"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{CHATBOT_SERVICE_URL}/health")
            if response.status_code == 200:
                return {
                    "status": "operational",
                    "service_health": response.json(),
                    "service_url": CHATBOT_SERVICE_URL
                }
    except Exception as e:
        return {
            "status": "offline",
            "error": str(e),
            "message": "Using fallback responses"
        }


# ==================== DEBUG & ROOT ENDPOINTS ====================

@app.get("/debug/routes")
def list_routes():
    """List all available routes"""
    routes = []
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": getattr(route, 'name', 'Unknown')
            })
    return {"routes": routes}


@app.get("/")
def root():
    """API root endpoint"""
    return {
        "message": "Student Advisor Portal API",
        "version": "1.0.0",
        "database": "Firestore",
        "storage": "Firebase Storage" if FIREBASE_STORAGE_ENABLED else "Not configured",
        "status": "running",
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
            "document_management": FIREBASE_STORAGE_ENABLED,
            "file_storage": "Firebase Storage" if FIREBASE_STORAGE_ENABLED else "Not configured",
            "enhanced_chatbot": True,
            "voice_chat": True,
        },
        "chatbot_endpoints": {
            "enhanced_chat": "/chat/enhanced",
            "voice_chat": "/api/chat/voice",
            "chat_status": "/api/chat/status",
        },
        "available_endpoints": {
            "resume_analysis": "/api/analyze_resume",
            "documents_upload": "/api/documents/upload/{user_email}" if FIREBASE_STORAGE_ENABLED else "Not available",
            "documents_get": "/api/documents/{user_email}" if FIREBASE_STORAGE_ENABLED else "Not available",
            "health": "/health",
            "docs": "/docs"
        }
    }
