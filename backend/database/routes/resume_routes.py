# database/routes/resume_routes.py
from fastapi import APIRouter, HTTPException, Form
import httpx
import logging
from datetime import datetime
from firebase_admin import firestore

router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

# ✅ YOUR HOSTED SERVICE
CLOUD_RUN_MODEL_URL = "https://skill-recommendation-service.onrender.com"

@router.post("/analyze_resume")
async def analyze_resume(email: str = Form(...)):
    """Analyze resume from Cloudinary via hosted ML service"""
    try:
        logger.info(f"📊 Starting resume analysis for: {email}")
        
        # Get resume URL from Firestore
        db = firestore.client()
        doc_ref = db.collection('user_documents').document(email)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="No resume found")
        
        doc_data = doc.to_dict()
        resume_url = doc_data.get('resumeUrl')
        resume_filename = doc_data.get('resumeFilename', 'resume.pdf')
        
        if not resume_url:
            raise HTTPException(status_code=404, detail="Resume URL not found")
        
        logger.info(f"📄 Resume URL: {resume_url}")
        
        # Download from Cloudinary
        async with httpx.AsyncClient(timeout=30.0) as client:
            download_response = await client.get(resume_url)
            resume_content = download_response.content
            logger.info(f"✅ Downloaded ({len(resume_content)} bytes)")
        
        # ✅ FIXED: Use correct endpoint with DASH
        async with httpx.AsyncClient(timeout=120.0) as client:
            files = {"file": (resume_filename, resume_content, "application/pdf")}
            
            # ✅ CORRECT: /analyze-resume/ (with dash)
            response = await client.post(
                f"{CLOUD_RUN_MODEL_URL}/analyze-resume/",
                files=files
            )
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"ML Model error {response.status_code}: {error_text}")
                raise HTTPException(status_code=500, detail=f"Analysis failed: {error_text}")
            
            analysis_result = response.json()
            logger.info("✅ Analysis completed")
        
        # Save to Firestore
        db.collection('resume_analysis').document(email).set({
            "userEmail": email,
            "resumeUrl": resume_url,
            "analysis": analysis_result,
            "analyzedAt": firestore.SERVER_TIMESTAMP,
            "status": "completed"
        })
        
        return {
            "success": True,
            "user_email": email,
            "analysis": analysis_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analysis/{email}")
async def get_analysis_results(email: str):
    """Get saved analysis results"""
    try:
        db = firestore.client()
        doc = db.collection('resume_analysis').document(email).get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="No analysis found")
        
        return {"success": True, "data": doc.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/resume/test")
async def test_resume_routes():
    """Test endpoint"""
    return {
        "message": "Resume analysis routes working!",
        "timestamp": datetime.now().isoformat(),
        "model_url": CLOUD_RUN_MODEL_URL
    }
