import logging
import uuid
import os
from datetime import datetime
from typing import List, Optional, Tuple
from fastapi import UploadFile, HTTPException
from pathlib import Path
from dotenv import load_dotenv

# Cloudinary imports
import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError

from .firestore import firestore_db
from models.document import (
    DocumentUploadInfo, 
    DocumentFile, 
    FileMetadata, 
    SocialLinks,
    DocumentType, 
    DocumentStatus,
    FileUploadValidation,
    DocumentUploadResponse
)

load_dotenv()
logger = logging.getLogger(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

class DocumentService:
    def __init__(self):
        self.collection_name = "user_documents"
        self.validation_rules = FileUploadValidation()
        
        # Verify Cloudinary configuration
        try:
            if not all([
                os.getenv("CLOUDINARY_CLOUD_NAME"),
                os.getenv("CLOUDINARY_API_KEY"),
                os.getenv("CLOUDINARY_API_SECRET")
            ]):
                raise Exception("Cloudinary credentials not configured")
            logger.info(f"✅ Cloudinary initialized - Cloud: {os.getenv('CLOUDINARY_CLOUD_NAME')}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Cloudinary: {e}")
    
    def _get_db(self):
        """Get Firestore database instance"""
        return firestore_db.get_db()
    
    def _generate_upload_session_id(self) -> str:
        """Generate unique session ID for upload tracking"""
        return str(uuid.uuid4())
    
    def _get_file_extension(self, filename: str) -> str:
        """Extract file extension from filename"""
        return Path(filename).suffix.lower()
    
    def _validate_file(self, file: UploadFile, document_type: DocumentType) -> Tuple[bool, List[str]]:
        """Validate uploaded file"""
        errors = []
        
        # Check file type
        if not self.validation_rules.validate_file_type(file.content_type, document_type):
            errors.append(f"Invalid file type: {file.content_type} for {document_type.value}")
        
        # Check file extension
        extension = self._get_file_extension(file.filename)
        if document_type == DocumentType.RESUME and extension not in ['.pdf', '.doc', '.docx']:
            errors.append(f"Invalid file extension for resume: {extension}")
        elif document_type == DocumentType.CERTIFICATE and extension not in ['.pdf', '.jpg', '.jpeg', '.png']:
            errors.append(f"Invalid file extension for certificate: {extension}")
        
        return len(errors) == 0, errors
    
    def _generate_cloudinary_folder(self, user_email: str, document_type: DocumentType) -> str:
        """Generate Cloudinary folder path - FIXED METHOD NAME"""
        safe_email = user_email.replace("@", "_").replace(".", "_")
        return f"ai-advisor/documents/{safe_email}/{document_type.value}"
    
    async def _upload_to_cloudinary(
        self, 
        file: UploadFile, 
        folder_path: str
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Upload file to Cloudinary
        Returns: (success, public_url, public_id, error_msg)
        """
        try:
            # Read file content
            file_content = await file.read()
            await file.seek(0)  # Reset file pointer
            
            # Determine resource type based on file extension
            extension = self._get_file_extension(file.filename)
            resource_type = "raw"  # For PDFs and documents
            if extension in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                resource_type = "image"
            
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file_content,
                folder=folder_path,
                resource_type=resource_type,
                use_filename=True,
                unique_filename=True,
                overwrite=False
            )
            
            public_url = upload_result.get('secure_url')
            public_id = upload_result.get('public_id')
            
            logger.info(f"✅ File uploaded to Cloudinary: {public_id}")
            return True, public_url, public_id, None
            
        except CloudinaryError as e:
            logger.error(f"❌ Cloudinary upload failed: {str(e)}")
            return False, None, None, f"Cloudinary error: {str(e)}"
        except Exception as e:
            logger.error(f"❌ Upload failed: {str(e)}")
            return False, None, None, f"Upload error: {str(e)}"
    
    async def upload_documents(
        self, 
        user_email: str,
        domain: str,
        portfolio_url: Optional[str],
        linkedin_url: Optional[str],
        github_url: Optional[str],
        personal_portfolio_url: Optional[str],
        resume_file: Optional[UploadFile],
        certificate_files: List[UploadFile]
    ) -> DocumentUploadResponse:
        """Upload user documents to Cloudinary and save metadata to Firestore"""
        
        upload_session_id = self._generate_upload_session_id()
        logger.info(f"🚀 Starting document upload for {user_email} - Session: {upload_session_id}")
        
        try:
            uploaded_files = []
            total_size = 0
            file_urls = []
            
            # Validate and upload resume
            resume_document = None
            if resume_file:
                is_valid, errors = self._validate_file(resume_file, DocumentType.RESUME)
                if not is_valid:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Resume validation failed: {', '.join(errors)}"
                    )
                
                # Generate Cloudinary folder path - USING FIXED METHOD
                folder_path = self._generate_cloudinary_folder(user_email, DocumentType.RESUME)
                
                # Upload to Cloudinary
                upload_success, public_url, public_id, error_msg = await self._upload_to_cloudinary(
                    resume_file, 
                    folder_path
                )
                
                if not upload_success:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Resume upload failed: {error_msg}"
                    )
                
                # Get file size
                file_content = await resume_file.read()
                file_size = len(file_content)
                await resume_file.seek(0)
                total_size += file_size
                
                # Create file metadata
                file_metadata = FileMetadata(
                    filename=resume_file.filename,
                    file_size=file_size,
                    content_type=resume_file.content_type,
                    file_extension=self._get_file_extension(resume_file.filename),
                    gcp_bucket_name="cloudinary",
                    gcp_file_path=public_id,
                    gcp_public_url=public_url,
                    is_valid=True,
                    validation_errors=[]
                )
                
                resume_document = DocumentFile(
                    document_type=DocumentType.RESUME,
                    file_metadata=file_metadata,
                    status=DocumentStatus.UPLOADED,
                    document_title="Resume/CV"
                )
                
                uploaded_files.append({
                    "type": "resume",
                    "filename": resume_file.filename,
                    "size": file_size,
                    "public_id": public_id,
                    "url": public_url
                })
                
                if public_url:
                    file_urls.append(public_url)
                
                logger.info(f"✅ Resume uploaded: {resume_file.filename}")
            
            # Validate and upload certificates
            certificate_documents = []
            if certificate_files:
                for i, cert_file in enumerate(certificate_files):
                    if cert_file.filename:
                        is_valid, errors = self._validate_file(cert_file, DocumentType.CERTIFICATE)
                        if not is_valid:
                            logger.warning(f"Certificate {cert_file.filename} validation failed: {errors}")
                            continue
                        
                        # Generate Cloudinary folder path - USING FIXED METHOD
                        folder_path = self._generate_cloudinary_folder(user_email, DocumentType.CERTIFICATE)
                        
                        # Upload to Cloudinary
                        upload_success, public_url, public_id, error_msg = await self._upload_to_cloudinary(
                            cert_file, 
                            folder_path
                        )
                        
                        if not upload_success:
                            logger.error(f"Certificate upload failed: {error_msg}")
                            continue
                        
                        # Get file size
                        file_content = await cert_file.read()
                        file_size = len(file_content)
                        await cert_file.seek(0)
                        total_size += file_size
                        
                        # Create file metadata
                        file_metadata = FileMetadata(
                            filename=cert_file.filename,
                            file_size=file_size,
                            content_type=cert_file.content_type,
                            file_extension=self._get_file_extension(cert_file.filename),
                            gcp_bucket_name="cloudinary",
                            gcp_file_path=public_id,
                            gcp_public_url=public_url,
                            is_valid=True,
                            validation_errors=[]
                        )
                        
                        certificate_document = DocumentFile(
                            document_type=DocumentType.CERTIFICATE,
                            file_metadata=file_metadata,
                            status=DocumentStatus.UPLOADED,
                            document_title=f"Certificate {i+1}"
                        )
                        
                        certificate_documents.append(certificate_document)
                        
                        uploaded_files.append({
                            "type": "certificate",
                            "filename": cert_file.filename,
                            "size": file_size,
                            "public_id": public_id,
                            "url": public_url
                        })
                        
                        if public_url:
                            file_urls.append(public_url)
                        
                        logger.info(f"✅ Certificate uploaded: {cert_file.filename}")
            
            # Create social links object
            social_links = SocialLinks(
                linkedin_url=linkedin_url or None,
                github_url=github_url or None,
                personal_portfolio_url=personal_portfolio_url or None
            )
            
            # Create document upload info
            document_info = DocumentUploadInfo(
                user_email=user_email,
                domain=domain,
                portfolio_url=portfolio_url,
                social_links=social_links,
                resume=resume_document,
                certificates=certificate_documents,
                upload_session_id=upload_session_id,
                total_files_count=len(uploaded_files),
                total_files_size=total_size,
                overall_status=DocumentStatus.COMPLETED,
                completion_percentage=100.0,
                completed_at=datetime.utcnow()
            )
            
            # Save to Firestore
            await self._save_to_firestore(document_info)
            
            return DocumentUploadResponse(
                success=True,
                message=f"Successfully uploaded {len(uploaded_files)} file(s) to Cloudinary",
                user_email=user_email,
                upload_session_id=upload_session_id,
                uploaded_files=uploaded_files,
                total_files=len(uploaded_files),
                total_size=total_size,
                gcp_urls=file_urls,
                created_at=document_info.created_at,
                status=DocumentStatus.COMPLETED
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ Document upload failed for {user_email}: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Document upload failed: {str(e)}"
            )
    
    async def _save_to_firestore(self, document_info: DocumentUploadInfo):
        """Save document info to Firestore"""
        try:
            db = self._get_db()
            doc_ref = db.collection(self.collection_name).document(document_info.user_email)
            
            # Convert to dict for Firestore storage
            document_data = document_info.model_dump(by_alias=True)
            
            # Convert datetime objects to timestamp
            document_data["created_at"] = document_info.created_at
            document_data["updated_at"] = document_info.updated_at
            if document_info.completed_at:
                document_data["completed_at"] = document_info.completed_at
            
            # Save to Firestore
            doc_ref.set(document_data)
            
            logger.info(f"✅ Document info saved to Firestore for {document_info.user_email}")
            
        except Exception as e:
            logger.error(f"❌ Failed to save document info to Firestore: {str(e)}")
            raise Exception(f"Firestore save failed: {str(e)}")
    
    async def get_user_documents(self, user_email: str) -> Optional[DocumentUploadInfo]:
        """Retrieve user document information from Firestore"""
        try:
            db = self._get_db()
            doc_ref = db.collection(self.collection_name).document(user_email)
            doc = doc_ref.get()
            
            if not doc.exists:
                logger.info(f"No documents found for user: {user_email}")
                return None
            
            data = doc.to_dict()
            document_info = DocumentUploadInfo.model_validate(data)
            
            logger.info(f"✅ Retrieved documents for {user_email}")
            return document_info
            
        except Exception as e:
            logger.error(f"❌ Failed to retrieve documents for {user_email}: {str(e)}")
            raise Exception(f"Failed to retrieve documents: {str(e)}")
    
    async def delete_user_documents(self, user_email: str) -> bool:
        """Delete user documents from both Cloudinary and Firestore"""
        try:
            document_info = await self.get_user_documents(user_email)
            if not document_info:
                logger.warning(f"No documents found to delete for {user_email}")
                return False
            
            # Delete from Cloudinary
            public_ids_to_delete = []
            
            if document_info.resume:
                public_ids_to_delete.append(document_info.resume.file_metadata.gcp_file_path)
            
            for cert in document_info.certificates:
                public_ids_to_delete.append(cert.file_metadata.gcp_file_path)
            
            # Delete files from Cloudinary
            for public_id in public_ids_to_delete:
                try:
                    cloudinary.uploader.destroy(public_id, resource_type="raw")
                    logger.info(f"✅ Deleted from Cloudinary: {public_id}")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to delete from Cloudinary {public_id}: {e}")
            
            # Delete from Firestore
            db = self._get_db()
            doc_ref = db.collection(self.collection_name).document(user_email)
            doc_ref.delete()
            
            logger.info(f"✅ Deleted all documents for {user_email}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to delete documents for {user_email}: {str(e)}")
            raise Exception(f"Document deletion failed: {str(e)}")

    async def update_document_status(self, user_email: str, status: DocumentStatus):
        """Update document status in Firestore"""
        try:
            db = self._get_db()
            doc_ref = db.collection(self.collection_name).document(user_email)
            
            doc_ref.update({
                "overall_status": status.value,
                "updated_at": datetime.utcnow()
            })
            
            logger.info(f"✅ Updated status for {user_email} to {status.value}")
            
        except Exception as e:
            logger.error(f"❌ Failed to update status for {user_email}: {str(e)}")
            raise Exception(f"Status update failed: {str(e)}")

# Global document service instance
document_service = DocumentService()
