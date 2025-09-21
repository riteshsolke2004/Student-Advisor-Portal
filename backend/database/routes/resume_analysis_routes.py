from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
import httpx
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

# Your Cloud Run model URL
CLOUD_RUN_MODEL_URL = "https://resume-ats-app-278398219986.us-central1.run.app"

@router.post("/api/resume/analyze")
async def analyze_resume(
    email: str = Form(..., description="User email"),
    resume: UploadFile = File(..., description="Resume file (PDF/DOC/DOCX)")
):
    """
    Analyze resume using Cloud Run model
    """
    try:
        logger.info(f"=== Starting resume analysis for: {email} ===")
        
        # Validate file type
        allowed_types = [
            'application/pdf', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if resume.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Please upload PDF, DOC, or DOCX files only."
            )
        
        # Validate file size (max 10MB)
        content = await resume.read()
        if len(content) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB."
            )
        
        logger.info(f"Processing file: {resume.filename}, Size: {len(content)} bytes")
        
        # Send to Cloud Run model for analysis
        logger.info(f"Sending to Cloud Run model: {CLOUD_RUN_MODEL_URL}")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            files = {
                "file": (
                    resume.filename,
                    content,
                    resume.content_type
                )
            }
            
            logger.info("Making POST request to Cloud Run...")
            response = await client.post(
                f"{CLOUD_RUN_MODEL_URL}/analyze_resume/", 
                files=files
            )
            
            logger.info(f"Cloud Run response status: {response.status_code}")
            
            if response.status_code != 200:
                logger.error(f"Cloud Run analysis failed: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Analysis failed: {response.text}"
                )
            
            analysis_result = response.json()
            logger.info("Analysis completed successfully")
        
        # Structure the response
        result = {
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
        
        logger.info(f"=== Analysis complete for: {email} ===")
        return JSONResponse(content=result)
        
    except HTTPException as he:
        logger.error(f"HTTP Exception: {he.detail}")
        raise he
    except httpx.TimeoutException:
        logger.error("Request timeout")
        raise HTTPException(
            status_code=408, 
            detail="Analysis request timeout. Please try again."
        )
    except httpx.RequestError as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(
            status_code=503, 
            detail="Unable to connect to analysis service. Please try again later."
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/api/resume/health")
async def health_check():
    """Health check for resume analysis service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{CLOUD_RUN_MODEL_URL}/")
            return {
                "status": "healthy",
                "model_service": "available" if response.status_code == 200 else "unavailable",
                "timestamp": datetime.now().isoformat(),
                "cloud_run_url": CLOUD_RUN_MODEL_URL
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "model_service": "unavailable",
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
            "cloud_run_url": CLOUD_RUN_MODEL_URL
        }

@router.get("/api/resume/test")
async def test_endpoint():
    """Simple test endpoint to verify route is working"""
    return {
        "message": "Resume analysis route is working!",
        "timestamp": datetime.now().isoformat(),
        "cloud_run_url": CLOUD_RUN_MODEL_URL
    }