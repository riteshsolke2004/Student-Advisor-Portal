from fastapi import APIRouter, HTTPException, Path, Query, BackgroundTasks
from typing import Optional
import logging
from datetime import datetime
from pydantic import BaseModel
from ..career_advisor_service import career_advisor_service

router = APIRouter(prefix="/api/career-recommendations")
logger = logging.getLogger(__name__)

class ChatMessage(BaseModel):
    message: str
    user_email: Optional[str] = None


@router.post("/generate/{user_email}")
async def generate_career_recommendations(
    user_email: str = Path(..., description="User email as identifier"),
    use_resume: bool = Query(True, description="Whether to use resume for analysis"),
    force_refresh: bool = Query(False, description="Force new analysis, ignore cache")
):
    """
    Generate career recommendations for a user using ML model
    
    This endpoint:
    1. Gets user profile data from Firebase
    2. Downloads resume from GCP (if available and requested)
    3. Calls your Cloud Run ML model
    4. Returns formatted recommendations
    """
    try:
        logger.info(f"Generating career recommendations for {user_email}")
        
        # Check cache first if not forcing refresh
        if not force_refresh:
            cached_recommendations = await career_advisor_service.get_cached_recommendations(user_email)
            if cached_recommendations:
                logger.info(f"Returning cached recommendations for {user_email}")
                return {
                    "success": True,
                    "cached": True,
                    "user_email": user_email,
                    "recommendations": cached_recommendations.get("recommendations", ""),
                    "method_used": cached_recommendations.get("method_used", "unknown"),
                    "generated_at": cached_recommendations.get("generated_at", "").isoformat() if cached_recommendations.get("generated_at") else None,
                    "model_url": career_advisor_service.model_url
                }
        
        # Generate new recommendations
        result = await career_advisor_service.get_career_recommendations(user_email, use_resume)
        
        if result["success"]:
            logger.info(f"Successfully generated recommendations for {user_email}")
            result["cached"] = False
            return result
        else:
            logger.error(f"Failed to generate recommendations: {result.get('error')}")
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to generate recommendations: {result.get('error')}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Career recommendations generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@router.get("/cached/{user_email}")
async def get_cached_recommendations(
    user_email: str = Path(..., description="User email as identifier")
):
    """Get cached career recommendations if available"""
    try:
        cached_recommendations = await career_advisor_service.get_cached_recommendations(user_email)
        
        if cached_recommendations:
            return {
                "success": True,
                "found": True,
                "user_email": user_email,
                "recommendations": cached_recommendations.get("recommendations", ""),
                "method_used": cached_recommendations.get("method_used", "unknown"),
                "generated_at": cached_recommendations.get("generated_at", "").isoformat() if cached_recommendations.get("generated_at") else None,
                "cached": True
            }
        else:
            return {
                "success": True,
                "found": False,
                "user_email": user_email,
                "message": "No cached recommendations found"
            }
            
    except Exception as e:
        logger.error(f"Failed to get cached recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get cached recommendations: {str(e)}")

@router.get("/status/{user_email}")
async def get_recommendation_status(
    user_email: str = Path(..., description="User email as identifier")
):
    """Get status of user's data for recommendations"""
    try:
        # Check if profile exists
        profile_data = await career_advisor_service.get_user_profile_data(user_email)
        has_profile = profile_data is not None
        
        # Check if resume exists
        resume_path = await career_advisor_service.get_user_resume_path(user_email)
        has_resume = resume_path is not None
        
        # Check if cached recommendations exist
        cached = await career_advisor_service.get_cached_recommendations(user_email)
        has_cached = cached is not None
        
        return {
            "success": True,
            "user_email": user_email,
            "data_status": {
                "has_profile": has_profile,
                "has_resume": has_resume,
                "has_cached_recommendations": has_cached,
                "can_generate_recommendations": has_profile,  # At minimum need profile
                "recommended_method": "resume" if has_resume else "profile"
            },
            "last_recommendation_date": cached.get("generated_at", "").isoformat() if cached and cached.get("generated_at") else None
        }
        
    except Exception as e:
        logger.error(f"Failed to get recommendation status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")

@router.delete("/cache/{user_email}")
async def clear_cached_recommendations(
    user_email: str = Path(..., description="User email as identifier")
):
    """Clear cached recommendations for a user"""
    try:
        db = career_advisor_service._get_db()
        doc_ref = db.collection("career_recommendations").document(user_email)
        doc = doc_ref.get()
        
        if doc.exists:
            doc_ref.delete()
            logger.info(f"Cleared cached recommendations for {user_email}")
            return {
                "success": True,
                "message": f"Cached recommendations cleared for {user_email}",
                "user_email": user_email
            }
        else:
            return {
                "success": True,
                "message": f"No cached recommendations found for {user_email}",
                "user_email": user_email
            }
            
    except Exception as e:
        logger.error(f"Failed to clear cached recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {str(e)}")

@router.get("/health")
async def recommendation_service_health():
    """Check health of recommendation service and dependencies"""
    try:
        health_status = {
            "service": "career_recommendations",
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "dependencies": {}
        }
        
        # Check model connectivity
        try:
            import httpx
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{career_advisor_service.model_url}/")
                if response.status_code == 200:
                    health_status["dependencies"]["ml_model"] = {
                        "status": "connected",
                        "url": career_advisor_service.model_url,
                        "response": response.json()
                    }
                else:
                    health_status["dependencies"]["ml_model"] = {
                        "status": "error",
                        "url": career_advisor_service.model_url,
                        "status_code": response.status_code
                    }
        except Exception as e:
            health_status["dependencies"]["ml_model"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Check Firebase
        try:
            db = career_advisor_service._get_db()
            test_collection = db.collection("health_check").limit(1).get()
            health_status["dependencies"]["firebase"] = {"status": "connected"}
        except Exception as e:
            health_status["dependencies"]["firebase"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Check GCP Storage
        try:
            from ..document_service import document_service
            if document_service.storage_client and document_service.bucket:
                health_status["dependencies"]["gcp_storage"] = {"status": "connected"}
            else:
                health_status["dependencies"]["gcp_storage"] = {"status": "not_configured"}
        except Exception as e:
            health_status["dependencies"]["gcp_storage"] = {
                "status": "error",
                "error": str(e)
            }
        
        # Set overall status based on dependencies
        failed_deps = [dep for dep, status in health_status["dependencies"].items() 
                      if status.get("status") != "connected"]
        
        if failed_deps:
            health_status["status"] = "degraded"
            health_status["failed_dependencies"] = failed_deps
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "service": "career_recommendations",
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
    
@router.post("/roadmap/{user_email}")
async def generate_roadmap_from_recommendations(
    user_email: str = Path(..., description="User email as identifier")
):
    """
    Generate career roadmap using existing career recommendations from Firestore
    
    This endpoint:
    1. Gets career recommendations from Firestore career_recommendation collection
    2. Sends this data to Cloud Run ML model to generate detailed roadmap
    3. Returns the roadmap data structure
    """
    try:
        logger.info(f"Generating roadmap from recommendations for {user_email}")
        
        # Call the career advisor service to generate roadmap from Firestore data
        result = await career_advisor_service.generate_roadmap_from_firestore(user_email)
        
        if result.get("success", True):
            logger.info(f"Successfully generated roadmap for {user_email}")
            return {
                "success": True,
                "user_email": user_email,
                "roadmap": result.get("roadmap", {}),
                "response": result.get("response", ""),
                "timestamp": datetime.utcnow().isoformat(),
                "model_url": career_advisor_service.model_url
            }
        else:
            logger.error(f"Failed to generate roadmap: {result.get('error')}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate roadmap: {result.get('error')}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Roadmap generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")

@router.post("/chat")
async def chat_with_model(chat_input: ChatMessage):
    """
    Continue conversation with the career roadmap model
    
    This endpoint allows users to ask follow-up questions or get additional
    guidance from the ML model after receiving their initial roadmap.
    """
    try:
        logger.info(f"Processing chat message: {chat_input.message[:50]}...")
        
        # Call the career advisor service to continue the chat
        result = await career_advisor_service.continue_chat(chat_input.message, chat_input.user_email)
        
        if result.get("success", True):
            logger.info("Successfully processed chat message")
            return {
                "success": True,
                "response": result.get("response", ""),
                "roadmap": result.get("roadmap", {}),
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            logger.error(f"Failed to process chat: {result.get('error')}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process chat: {result.get('error')}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")