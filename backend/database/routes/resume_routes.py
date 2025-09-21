# database/routes/resume_routes.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
import httpx
import logging
from datetime import datetime

# Create router instance
router = APIRouter()
logger = logging.getLogger(__name__)

# Cloud Run URL
CLOUD_RUN_MODEL_URL = "https://resume-ats-app-278398219986.us-central1.run.app"

@router.post("/api/resume/analyze")
async def analyze_resume(
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    """Analyze resume using Cloud Run model"""
    try:
        logger.info(f"Starting resume analysis for: {email}")
        
        # Read file content
        content = await resume.read()
        
        # Basic validation
        if len(content) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
        
        logger.info(f"Sending file to Cloud Run: {resume.filename}")
        
        # Forward to Cloud Run
        async with httpx.AsyncClient(timeout=120.0) as client:
            files = {
                "file": (
                    resume.filename,
                    content,
                    resume.content_type or "application/pdf"
                )
            }
            
            response = await client.post(
                f"{CLOUD_RUN_MODEL_URL}/analyze_resume/", 
                files=files
            )
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"Cloud Run error {response.status_code}: {error_text}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"Analysis service error: {response.status_code}"
                )
            
            analysis_result = response.json()
            logger.info("Analysis completed successfully")
        
        # Return formatted response
        return {
            "success": True,
            "user_email": email,
            "resume_filename": resume.filename,
            "file_size": len(content),
            "analysis": analysis_result,
            "metadata": {
                "analyzed_at": datetime.now().isoformat(),
                "content_type": resume.content_type
            }
        }
        
    except HTTPException:
        raise
    except httpx.TimeoutException:
        logger.error("Request timeout")
        raise HTTPException(status_code=408, detail="Analysis request timeout")
    except httpx.RequestError as e:
        logger.error(f"Request error: {e}")
        raise HTTPException(status_code=503, detail="Unable to connect to analysis service")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/api/resume/test")
async def test_resume_routes():
    """Test endpoint to verify routes are working"""
    return {
        "message": "Resume analysis routes are working!",
        "timestamp": datetime.now().isoformat(),
        "cloud_run_url": CLOUD_RUN_MODEL_URL
    }

@router.get("/api/resume/health")
async def health_check():
    """Health check for Cloud Run service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{CLOUD_RUN_MODEL_URL}/")
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "cloud_run_status": response.status_code,
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }