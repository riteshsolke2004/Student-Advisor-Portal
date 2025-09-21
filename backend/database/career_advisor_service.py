import logging
import httpx
import asyncio
from typing import Optional, Dict, Any
from datetime import datetime
import json

# Firebase imports
from .firestore import firestore_db
from .document_service import document_service

logger = logging.getLogger(__name__)

class CareerAdvisorService:
    def __init__(self):
        # Your Cloud Run endpoint
        self.model_url = "https://career-advisor-278398219986.asia-south1.run.app"
        self.timeout = 60.0  # 60 seconds timeout for ML model
        
    def _get_db(self):
        """Get Firestore database instance"""
        return firestore_db.get_db()
    
    async def get_user_profile_data(self, user_email: str) -> Optional[Dict[str, Any]]:
        """Get user profile data from Firebase"""
        try:
            db = self._get_db()
            doc_ref = db.collection("user_profiles").document(user_email)
            doc = doc_ref.get()
            
            if not doc.exists:
                logger.warning(f"Profile not found for user: {user_email}")
                return None
                
            profile_data = doc.to_dict()
            logger.info(f"Retrieved profile data for {user_email}")
            
            return profile_data
            
        except Exception as e:
            logger.error(f"Failed to get profile data for {user_email}: {str(e)}")
            return None
    
    async def get_user_resume_path(self, user_email: str) -> Optional[str]:
        """Get user resume GCP path from Firebase"""
        try:
            document_info = await document_service.get_user_documents(user_email)
            
            if document_info and document_info.resume:
                gcp_path = document_info.resume.file_metadata.gcp_file_path
                logger.info(f"Found resume for {user_email}: {gcp_path}")
                return gcp_path
            else:
                logger.warning(f"No resume found for user: {user_email}")
                return None
                
        except Exception as e:
            logger.error(f"Failed to get resume path for {user_email}: {str(e)}")
            return None
    
    def _prepare_profile_text(self, profile_data: Dict[str, Any]) -> str:
        """Convert Firebase profile data to text for the model"""
        try:
            profile = profile_data.get("profile", {})
            
            # Personal Info
            personal_info = profile.get("personalInfo", {})
            name = personal_info.get("name", "")
            email = personal_info.get("email", "")
            location = personal_info.get("location", "")
            
            # Academic Background
            academic = profile.get("academicBackground", {})
            education_level = academic.get("educationLevel", "")
            field_of_study = academic.get("fieldOfStudy", "")
            years_experience = academic.get("yearsOfExperience", "")
            interests = academic.get("interests", [])
            
            # Career Info
            career = profile.get("careerInfo", {})
            current_role = career.get("currentRole", "")
            industry = career.get("industry", "")
            expected_salary = career.get("expectedSalary", "")
            preferred_location = career.get("preferredLocation", "")
            
            # Format as text for the model
            profile_text = f"""
            Name: {name}
            Email: {email}
            Location: {location}
            
            Education Level: {education_level}
            Field of Study: {field_of_study}
            Years of Experience: {years_experience}
            Interests: {', '.join(interests)}
            
            Current Role: {current_role}
            Industry: {industry}
            Expected Salary: {expected_salary}
            Preferred Location: {preferred_location}
            """.strip()
            
            logger.info(f"Prepared profile text for model: {len(profile_text)} characters")
            return profile_text
            
        except Exception as e:
            logger.error(f"Failed to prepare profile text: {str(e)}")
            return ""
    
    async def download_resume_from_gcp(self, gcp_path: str) -> Optional[bytes]:
        """Download resume file from GCP Storage"""
        try:
            if document_service.storage_client and document_service.bucket:
                blob = document_service.bucket.blob(gcp_path)
                
                if not blob.exists():
                    logger.error(f"Resume file not found in GCP: {gcp_path}")
                    return None
                
                file_content = blob.download_as_bytes()
                logger.info(f"Downloaded resume from GCP: {len(file_content)} bytes")
                return file_content
            else:
                logger.error("GCP Storage not available")
                return None
                
        except Exception as e:
            logger.error(f"Failed to download resume from GCP: {str(e)}")
            return None
    
    async def call_model_with_profile(self, profile_text: str) -> Optional[Dict[str, Any]]:
        """Call the model with profile text"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.model_url}/analyze-profile/",
                    params={"profile_text": profile_text},
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info("Successfully called model with profile")
                    return result
                else:
                    logger.error(f"Model API error: {response.status_code} - {response.text}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error("Model API timeout")
            return None
        except Exception as e:
            logger.error(f"Failed to call model API: {str(e)}")
            return None
    
    async def call_model_with_resume(self, resume_content: bytes, filename: str) -> Optional[Dict[str, Any]]:
        """Call the model with resume file"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                files = {"file": (filename, resume_content, "application/pdf")}
                
                response = await client.post(
                    f"{self.model_url}/analyze-resume/",
                    files=files
                )
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info("Successfully called model with resume")
                    return result
                else:
                    logger.error(f"Model API error: {response.status_code} - {response.text}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error("Model API timeout")
            return None
        except Exception as e:
            logger.error(f"Failed to call model API with resume: {str(e)}")
            return None
    
    async def get_career_recommendations(self, user_email: str, use_resume: bool = True) -> Dict[str, Any]:
        """
        Main method to get career recommendations for a user
        
        Args:
            user_email: User's email
            use_resume: If True, try to use resume first, fallback to profile
        """
        try:
            logger.info(f"Getting career recommendations for {user_email}")
            
            # Get profile data
            profile_data = await self.get_user_profile_data(user_email)
            if not profile_data:
                return {
                    "success": False,
                    "error": "User profile not found",
                    "user_email": user_email
                }
            
            model_result = None
            method_used = None
            
            # Try resume-based analysis first if requested
            if use_resume:
                resume_path = await self.get_user_resume_path(user_email)
                if resume_path:
                    resume_content = await self.download_resume_from_gcp(resume_path)
                    if resume_content:
                        filename = resume_path.split('/')[-1]  # Extract filename from path
                        model_result = await self.call_model_with_resume(resume_content, filename)
                        method_used = "resume_analysis"
                        logger.info("Used resume for model analysis")
            
            # Fallback to profile-based analysis
            if not model_result:
                profile_text = self._prepare_profile_text(profile_data)
                if profile_text:
                    model_result = await self.call_model_with_profile(profile_text)
                    method_used = "profile_analysis"
                    logger.info("Used profile text for model analysis")
            
            if not model_result:
                return {
                    "success": False,
                    "error": "Failed to get recommendations from model",
                    "user_email": user_email
                }
            
            # Save recommendations to Firebase (optional)
            await self._save_recommendations_to_firebase(user_email, model_result, method_used)
            
            return {
                "success": True,
                "user_email": user_email,
                "method_used": method_used,
                "recommendations": model_result.get("recommendations", ""),
                "resume_text_preview": model_result.get("resume_text", "")[:500] if method_used == "resume_analysis" else None,
                "generated_at": datetime.utcnow().isoformat(),
                "model_url": self.model_url
            }
            
        except Exception as e:
            logger.error(f"Failed to get career recommendations for {user_email}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "user_email": user_email
            }
    
    async def _save_recommendations_to_firebase(self, user_email: str, model_result: Dict[str, Any], method_used: str):
        """Save recommendations to Firebase for caching/history"""
        try:
            db = self._get_db()
            doc_ref = db.collection("career_recommendations").document(user_email)
            
            recommendation_data = {
                "user_email": user_email,
                "recommendations": model_result.get("recommendations", ""),
                "method_used": method_used,
                "generated_at": datetime.utcnow(),
                "model_response": model_result
            }
            
            doc_ref.set(recommendation_data)
            logger.info(f"Saved recommendations to Firebase for {user_email}")
            
        except Exception as e:
            logger.error(f"Failed to save recommendations to Firebase: {str(e)}")
            # Don't raise error - this is optional
    
    async def get_cached_recommendations(self, user_email: str) -> Optional[Dict[str, Any]]:
        """Get cached recommendations from Firebase"""
        try:
            db = self._get_db()
            doc_ref = db.collection("career_recommendations").document(user_email)
            doc = doc_ref.get()
            
            if doc.exists:
                data = doc.to_dict()
                logger.info(f"Found cached recommendations for {user_email}")
                return data
            else:
                return None
                
        except Exception as e:
            logger.error(f"Failed to get cached recommendations: {str(e)}")
            return None
        
    async def get_career_recommendations_data(self, user_email: str) -> Optional[Dict[str, Any]]:
        """
        Get career recommendations data from Firestore
        """
        try:
            logger.info(f"Getting career recommendations from Firestore for {user_email}")
            
            # Use your existing method
            cached_data = await self.get_cached_recommendations(user_email)
            
            if cached_data:
                logger.info(f"Found career recommendations for {user_email}")
                return cached_data
            else:
                logger.warning(f"No career recommendations found for {user_email}")
                return None
            
        except Exception as e:
            logger.error(f"Failed to get career recommendations from Firestore: {str(e)}")
            return None





        
    async def generate_roadmap_from_firestore(self, user_email: str) -> Dict[str, Any]:
        try:
            logger.info(f"Generating roadmap from Firestore data for user: {user_email}")
            
            career_data = await self.get_career_recommendations_data(user_email)
            
            if not career_data:
                return {
                    "success": False,
                    "error": "No career recommendations found for user",
                    "roadmap": {}
                }
        
            # FIXED IMPORT - same directory
            from .ml_service import ml_service
            
            roadmap_result = await ml_service.generate_career_roadmap_from_firestore(career_data)
            
            return {
                "success": True,
                "roadmap": roadmap_result,
                "response": "Roadmap generated successfully from your career recommendations"
            }
        
        except Exception as e:
            logger.error(f"Roadmap generation from Firestore failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "roadmap": {}
            }

    async def continue_chat(self, message: str, user_email: Optional[str] = None) -> Dict[str, Any]:
        try:
            logger.info(f"Processing chat message for user: {user_email}")
            
            # FIXED IMPORT - same directory  
            from .ml_service import ml_service
            
            chat_result = await ml_service.continue_chat(message)
            
            return {
                "success": True,
                "response": chat_result.get("response", ""),
                "roadmap": chat_result.get("roadmap", {})
            }
            
        except Exception as e:
            logger.error(f"Chat continuation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response": "I'm sorry, I encountered an error processing your message. Please try again.",
                "roadmap": {}
            }



# Global service instance
career_advisor_service = CareerAdvisorService()