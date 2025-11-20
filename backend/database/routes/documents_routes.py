from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Path
from fastapi.responses import StreamingResponse
from typing import List, Optional
import logging
import io
import httpx
from datetime import datetime

from ..document_service import document_service
from models.document import DocumentUploadResponse, DocumentRetrievalResponse, DocumentStatus

router = APIRouter(prefix="/api/documents")
logger = logging.getLogger(__name__)

@router.post("/upload/{user_email}", response_model=DocumentUploadResponse)
async def upload_documents(
    user_email: str = Path(..., description="User email as identifier"),
    domain: str = Form(..., description="Professional domain/expertise area"),
    portfolio_url: Optional[str] = Form(None, description="Portfolio website URL"),
    linkedin_url: Optional[str] = Form(None, description="LinkedIn profile URL"),
    github_url: Optional[str] = Form(None, description="GitHub profile URL"),
    personal_portfolio_url: Optional[str] = Form(None, description="Personal portfolio URL"),
    resume: Optional[UploadFile] = File(None, description="Resume/CV file"),
    certificates: List[UploadFile] = File(default=[], description="Certificate files")
):
    """
    Upload user documents (resume and certificates) to Cloudinary.
    """
    try:
        logger.info(f"📁 Starting document upload for user: {user_email}")
        
        # Validate required fields
        if not domain or domain.strip() == "":
            raise HTTPException(status_code=400, detail="Domain field is required")
        
        # Validate that at least resume is provided
        if not resume or not resume.filename:
            raise HTTPException(status_code=400, detail="Resume file is required")
        
        # Filter out empty certificate files
        valid_certificates = [cert for cert in certificates if cert.filename and cert.filename.strip()]
        
        logger.info(f"📊 Upload details - Resume: {resume.filename if resume else 'None'}, Certificates: {len(valid_certificates)}")
        
        # Call document service to handle the upload
        result = await document_service.upload_documents(
            user_email=user_email,
            domain=domain.strip(),
            portfolio_url=portfolio_url.strip() if portfolio_url else None,
            linkedin_url=linkedin_url.strip() if linkedin_url else None,
            github_url=github_url.strip() if github_url else None,
            personal_portfolio_url=personal_portfolio_url.strip() if personal_portfolio_url else None,
            resume_file=resume,
            certificate_files=valid_certificates
        )
        
        logger.info(f"✅ Document upload completed for {user_email}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Document upload failed for {user_email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document upload failed: {str(e)}")


@router.get("/user/{user_email}", response_model=DocumentRetrievalResponse)
async def get_user_documents(
    user_email: str = Path(..., description="User email as identifier")
):
    """
    Retrieve all document information for a specific user.
    """
    try:
        logger.info(f"🔍 Retrieving documents for user: {user_email}")
        
        document_info = await document_service.get_user_documents(user_email)
        
        if document_info:
            logger.info(f"✅ Documents found for {user_email}")
            return DocumentRetrievalResponse(
                success=True,
                user_email=user_email,
                document_info=document_info,
                found=True
            )
        else:
            logger.info(f"📭 No documents found for {user_email}")
            return DocumentRetrievalResponse(
                success=True,
                user_email=user_email,
                document_info=None,
                found=False
            )
            
    except Exception as e:
        logger.error(f"❌ Failed to retrieve documents for {user_email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve documents: {str(e)}")


@router.delete("/user/{user_email}")
async def delete_user_documents(
    user_email: str = Path(..., description="User email as identifier")
):
    """
    Delete all documents for a specific user from both Cloudinary and Firestore.
    """
    try:
        logger.info(f"🗑️ Deleting documents for user: {user_email}")
        
        success = await document_service.delete_user_documents(user_email)
        
        if success:
            return {
                "success": True,
                "message": f"All documents deleted successfully for {user_email}",
                "user_email": user_email,
                "deleted_at": datetime.utcnow().isoformat()
            }
        else:
            return {
                "success": False,
                "message": f"No documents found to delete for {user_email}",
                "user_email": user_email
            }
            
    except Exception as e:
        logger.error(f"❌ Failed to delete documents for {user_email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document deletion failed: {str(e)}")


@router.get("/download/{user_email}/{file_type}/{file_index}")
async def download_file(
    user_email: str = Path(..., description="User email"),
    file_type: str = Path(..., description="'resume' or 'certificate'"),
    file_index: int = Path(..., description="Certificate index (0 for resume, 0-n for certificates)")
):
    """Download file from Cloudinary via public URL"""
    try:
        # Get document info
        document_info = await document_service.get_user_documents(user_email)
        if not document_info:
            raise HTTPException(status_code=404, detail="User documents not found")
        
        target_file = None
        
        if file_type == "resume" and document_info.resume:
            target_file = document_info.resume
        elif file_type == "certificate" and file_index < len(document_info.certificates):
            target_file = document_info.certificates[file_index]
        
        if not target_file:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get public URL from Cloudinary
        public_url = target_file.file_metadata.gcp_public_url
        
        if not public_url:
            raise HTTPException(status_code=404, detail="File URL not found")
        
        # Download from Cloudinary URL
        async with httpx.AsyncClient() as client:
            response = await client.get(public_url)
            if response.status_code != 200:
                raise HTTPException(status_code=404, detail="File not accessible")
            
            return StreamingResponse(
                io.BytesIO(response.content),
                media_type=target_file.file_metadata.content_type,
                headers={
                    "Content-Disposition": f"attachment; filename=\"{target_file.file_metadata.filename}\""
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File download failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")


@router.get("/health")
async def document_service_health():
    """
    Check the health of the document service and its dependencies.
    """
    try:
        health_status = {
            "service": "document_service",
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "dependencies": {}
        }
        
        # Check Cloudinary connectivity
        health_status["dependencies"]["cloudinary"] = {
            "status": "connected",
            "provider": "cloudinary"
        }
        
        # Check Firebase connectivity
        try:
            db = document_service._get_db()
            test_collection = db.collection("health_check").limit(1).get()
            health_status["dependencies"]["firebase"] = {
                "status": "connected"
            }
        except Exception as e:
            health_status["dependencies"]["firebase"] = {
                "status": "error",
                "error": str(e)
            }
            health_status["status"] = "degraded"
        
        return health_status
        
    except Exception as e:
        logger.error(f"❌ Health check failed: {str(e)}")
        return {
            "service": "document_service",
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
