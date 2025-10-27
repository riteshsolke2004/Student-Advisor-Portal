import os
import sys
import json
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn
from typing import Dict, Any, Optional, List
from datetime import datetime
import traceback
import asyncio

# Import roadmap generator
try:
    from roadmap import generate_roadmap
    print("✅ Successfully imported roadmap generator")
except ImportError as e:
    print(f"❌ Failed to import roadmap.py: {e}")
    sys.exit(1)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================
# ENHANCED SESSION STORAGE
# ============================================================

# In-memory storage with better structure
sessions: Dict[str, Dict[str, Any]] = {}

def get_session(session_id: str) -> Dict[str, Any]:
    """Get or create a session with enhanced structure"""
    if session_id not in sessions:
        sessions[session_id] = {
            "roadmap": None,
            "history": [],
            "metadata": {
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "total_queries": 0,
                "last_query": None
            },
            "user_preferences": {
                "difficulty_level": "beginner",
                "learning_style": "visual",
                "time_commitment": "part-time"
            }
        }
        logger.info(f"Created new session: {session_id}")
    return sessions[session_id]

def save_session(session_id: str, data: Dict[str, Any]):
    """Save session data with metadata update"""
    sessions[session_id] = data
    sessions[session_id]["metadata"]["updated_at"] = datetime.utcnow().isoformat()

def clear_session(session_id: str):
    """Clear a session"""
    if session_id in sessions:
        del sessions[session_id]
        logger.info(f"Cleared session: {session_id}")

def cleanup_old_sessions(max_age_hours: int = 24):
    """Clean up sessions older than max_age_hours"""
    try:
        current_time = datetime.utcnow()
        sessions_to_remove = []
        
        for session_id, session_data in sessions.items():
            created_at = datetime.fromisoformat(session_data["metadata"]["created_at"])
            age_hours = (current_time - created_at).total_seconds() / 3600
            
            if age_hours > max_age_hours:
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del sessions[session_id]
            logger.info(f"Cleaned up old session: {session_id}")
            
        return len(sessions_to_remove)
    except Exception as e:
        logger.error(f"Session cleanup error: {e}")
        return 0

# ============================================================
# FASTAPI APP WITH ENHANCED FEATURES
# ============================================================

api = FastAPI(
    title="Dynamic Career Roadmap API",
    version="3.0",
    description="AI-powered personalized learning roadmap generation with session management",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enhanced CORS configuration
# Enhanced CORS configuration
api.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "https://frontend-app-278398219986.asia-south1.run.app",  # Your frontend URL
        "https://*.run.app",  # Allow all Cloud Run domains
        "*"  # Allow all origins for development - remove in production
    ],
    allow_credentials=False,  # Set to False for broader compatibility
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=[
        "Accept",
        "Accept-Language", 
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    expose_headers=["*"],
)


# Request logging middleware
@api.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.utcnow()
    response = await call_next(request)
    process_time = (datetime.utcnow() - start_time).total_seconds()
    
    logger.info(
        f"Request: {request.method} {request.url.path} "
        f"completed in {process_time:.3f}s with status {response.status_code}"
    )
    return response

# ============================================================
# ENHANCED PYDANTIC MODELS
# ============================================================

class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Unique session identifier")
    query: str = Field(..., min_length=3, max_length=500, description="Learning goal or edit request")
    reset: bool = Field(False, description="Reset session before processing")
    user_preferences: Optional[Dict[str, str]] = Field(None, description="User learning preferences")

class ChatResponse(BaseModel):
    session_id: str
    message: str
    roadmap: Optional[Dict] = None
    status: str = "success"
    timestamp: str
    metadata: Optional[Dict] = None

class SessionInfo(BaseModel):
    session_id: str
    has_roadmap: bool
    history_count: int
    created_at: str
    updated_at: str
    total_queries: int
    last_query: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    active_sessions: int
    uptime_seconds: float
    version: str

class ErrorResponse(BaseModel):
    error: str
    message: str
    timestamp: str
    session_id: Optional[str] = None

# ============================================================
# ENHANCED API ENDPOINTS
# ============================================================

@api.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "service": "Dynamic Career Roadmap API",
        "version": "3.0",
        "status": "running",
        "active_sessions": len(sessions),
        "features": [
            "AI-powered roadmap generation",
            "Session-based memory",
            "Resource enrichment",
            "Project suggestions",
            "Career insights"
        ],
        "endpoints": {
            "POST /chat": "Generate or edit roadmap",
            "POST /reset": "Clear session",
            "GET /health": "Health check",
            "GET /session/{session_id}": "Get session data",
            "POST /cleanup": "Cleanup old sessions",
            "GET /stats": "API statistics"
        }
    }

@api.get("/health", response_model=HealthResponse)
def health():
    """Enhanced health check"""
    import time
    uptime = time.time() - start_time
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        active_sessions=len(sessions),
        uptime_seconds=uptime,
        version="3.0"
    )

@api.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Enhanced chat endpoint with better error handling and features
    """
    try:
        logger.info(f"Chat request - Session: {request.session_id}, Query: {request.query[:100]}...")
        
        # Validate session_id
        if not request.session_id or len(request.session_id) < 3:
            raise HTTPException(status_code=400, detail="Invalid session_id")
        
        # Get or create session
        session = get_session(request.session_id)
        
        # Reset if requested
        if request.reset:
            clear_session(request.session_id)
            session = get_session(request.session_id)
            logger.info(f"Session reset: {request.session_id}")
        
        # Update user preferences if provided
        if request.user_preferences:
            session["user_preferences"].update(request.user_preferences)
        
        # Get existing roadmap (if any)
        existing_roadmap = session.get("roadmap")
        
        # Generate roadmap (run in background if needed)
        logger.info("Generating roadmap...")
        roadmap = generate_roadmap(
            query=request.query,
            existing_roadmap=existing_roadmap
        )
        
        # Validate roadmap structure
        if not roadmap or not isinstance(roadmap, dict):
            raise ValueError("Invalid roadmap generated")
        
        # Determine response message
        if existing_roadmap:
            message = "I've updated your roadmap based on your request. The changes have been integrated with your existing learning path."
        else:
            topic_count = len(roadmap.get("roadmap", {}).get("phases", []))
            node_count = roadmap.get("metadata", {}).get("total_nodes", 0)
            message = f"I've generated your personalized learning roadmap with {topic_count} phases and {node_count} learning modules!"
        
        # Update session
        session["roadmap"] = roadmap
        session["history"].append({
            "query": request.query,
            "timestamp": datetime.utcnow().isoformat(),
            "reset": request.reset
        })
        session["metadata"]["total_queries"] += 1
        session["metadata"]["last_query"] = request.query
        
        save_session(request.session_id, session)
        
        logger.info(f"✅ Roadmap generated successfully for session: {request.session_id}")
        
        return ChatResponse(
            session_id=request.session_id,
            message=message,
            roadmap=roadmap,
            status="success",
            timestamp=datetime.utcnow().isoformat(),
            metadata={
                "nodes_count": roadmap.get("metadata", {}).get("total_nodes", 0),
                "phases_count": len(roadmap.get("roadmap", {}).get("phases", [])),
                "estimated_duration": roadmap.get("metadata", {}).get("total_duration", "Unknown"),
                "is_update": existing_roadmap is not None
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error in chat endpoint: {e}")
        logger.error(traceback.format_exc())
        
        error_message = "I encountered an issue generating your roadmap. Please try again with a simpler query."
        if "quota" in str(e).lower() or "limit" in str(e).lower():
            error_message = "I've reached my API limits. Please try again in a few minutes."
        elif "connection" in str(e).lower():
            error_message = "I'm having connectivity issues. Please check your connection and try again."
        
        return ChatResponse(
            session_id=request.session_id,
            message=error_message,
            roadmap=None,
            status="error",
            timestamp=datetime.utcnow().isoformat(),
            metadata={"error_type": type(e).__name__}
        )

@api.post("/reset")
def reset_session(request: ChatRequest):
    """Reset a session with confirmation"""
    try:
        session_exists = request.session_id in sessions
        clear_session(request.session_id)
        
        return {
            "success": True,
            "message": f"Session {request.session_id} {'reset' if session_exists else 'initialized'} successfully",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Reset session error: {e}")
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@api.get("/session/{session_id}", response_model=SessionInfo)
def get_session_info(session_id: str):
    """Get detailed session information"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    metadata = session.get("metadata", {})
    
    return SessionInfo(
        session_id=session_id,
        has_roadmap=session.get("roadmap") is not None,
        history_count=len(session.get("history", [])),
        created_at=metadata.get("created_at", ""),
        updated_at=metadata.get("updated_at", ""),
        total_queries=metadata.get("total_queries", 0),
        last_query=metadata.get("last_query")
    )

@api.post("/cleanup")
def cleanup_sessions(max_age_hours: int = 24):
    """Cleanup old sessions"""
    try:
        cleaned_count = cleanup_old_sessions(max_age_hours)
        return {
            "success": True,
            "cleaned_sessions": cleaned_count,
            "remaining_sessions": len(sessions),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Cleanup error: {e}")
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@api.get("/stats")
def get_api_stats():
    """Get API usage statistics"""
    try:
        total_queries = sum(
            session.get("metadata", {}).get("total_queries", 0) 
            for session in sessions.values()
        )
        
        sessions_with_roadmaps = sum(
            1 for session in sessions.values() 
            if session.get("roadmap") is not None
        )
        
        return {
            "active_sessions": len(sessions),
            "sessions_with_roadmaps": sessions_with_roadmaps,
            "total_queries_processed": total_queries,
            "average_queries_per_session": total_queries / len(sessions) if sessions else 0,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return {"error": str(e)}

# ============================================================
# ERROR HANDLERS
# ============================================================

@api.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error="HTTP Error",
            message=exc.detail,
            timestamp=datetime.utcnow().isoformat()
        ).dict()
    )

@api.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    logger.error(traceback.format_exc())
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            message="An unexpected error occurred. Please try again.",
            timestamp=datetime.utcnow().isoformat()
        ).dict()
    )

# ============================================================
# STARTUP AND SHUTDOWN EVENTS
# ============================================================

start_time = 0

@api.on_event("startup")
async def startup_event():
    """Startup event handler"""
    global start_time
    import time
    start_time = time.time()
    
    logger.info("🚀 Dynamic Career Roadmap API starting up...")
    logger.info("✅ Enhanced session management enabled")
    logger.info("🔄 CORS configured for all origins")
    logger.info("📊 Health monitoring active")
    logger.info("🤖 AI roadmap generation ready")

@api.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("🛑 Dynamic Career Roadmap API shutting down...")
    logger.info(f"📈 Total sessions handled: {len(sessions)}")

# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":
    print("🚀 Starting Dynamic Career Roadmap API...")
    print("✅ Enhanced architecture with session management")
    print("🔄 CORS enabled for all origins")
    print("📊 Health monitoring and stats endpoints active")
    print("🤖 AI-powered roadmap generation ready")
    
    uvicorn.run(
        "main:api",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),  # Changed from 8081 to 8080
        reload=False,
        log_level="info"
    )

