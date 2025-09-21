from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

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
            "file_storage": "GCP Storage" if DOCUMENT_ROUTES_ENABLED else "Not configured"
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
        logger.warning("🚧 Using temporary document upload endpoint")
        
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
    
    logger.info(f"🚀 Starting server on {settings.HOST}:{settings.PORT}")
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )