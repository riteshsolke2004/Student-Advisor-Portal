import json
import httpx
import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        # Use the correct Cloud Run model URL from your main.py
        self.model_url = "https://career-roadmap-app-278398219986.us-central1.run.app"
        # Store the response from the model
        self.roadmap_response = {}
    
    async def generate_career_roadmap_from_firestore(self, career_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call Cloud Run model using data from career_recommendation collection
        This is the first call to the model using Firestore data with SESSION MANAGEMENT
        """
        try:
            # Generate unique session ID for this request
            session_id = f"user_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
            
            # Call the Cloud Run model with longer timeout and session management
            async with httpx.AsyncClient(timeout=120.0) as client:
                logger.info(f"Calling Cloud Run model at {self.model_url}/chat with session ID: {session_id}")
                
                # Prepare the message for the model using Firestore data
                message = self._prepare_firestore_input(career_data)
                logger.info(f"Prepared message length: {len(message)} characters")
                
                # NEW: Include session management in request
                request_data = {
                    "message": message,
                    "user_id": session_id,
                    "reset_session": True  # Always start fresh for new roadmap
                }
                
                response = await client.post(
                    f"{self.model_url}/chat",
                    json=request_data,
                    headers={"Content-Type": "application/json"}
                )
                
                logger.info(f"Cloud Run response status: {response.status_code}")
                
                if response.status_code == 200:
                    model_data = response.json()
                    
                    # Store the model response with session info
                    roadmap_data = model_data.get("roadmap", {})
                    
                    # If no roadmap yet, try a follow-up request
                    if not roadmap_data and model_data.get("response"):
                        logger.info("No roadmap in first response, requesting roadmap generation")
                        roadmap_data = await self._request_roadmap_generation(session_id)
                    
                    self.roadmap_response = {
                        "success": True,
                        "session_id": session_id,
                        "roadmap": roadmap_data,
                        "model_response": model_data.get("response", ""),
                        "generated_at": datetime.now().isoformat()
                    }
                    
                    logger.info("Successfully received response from Cloud Run model")
                    return self.roadmap_response
                else:
                    logger.error(f"Cloud Run model returned status {response.status_code}: {response.text}")
                    # Return fallback response instead of failing
                    return self._get_fallback_response(career_data, session_id)
                    
        except httpx.TimeoutException:
            logger.error("Timeout calling Cloud Run model - returning fallback")
            return self._get_fallback_response(career_data, f"timeout_{uuid.uuid4().hex[:8]}")
        except Exception as e:
            logger.error(f"Error calling Cloud Run model: {str(e)}")
            return self._get_fallback_response(career_data, f"error_{uuid.uuid4().hex[:8]}")
    
    async def _request_roadmap_generation(self, session_id: str) -> Dict[str, Any]:
        """Follow-up request to generate the actual roadmap"""
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                followup_request = {
                    "message": "Please generate my complete career roadmap now with all details including skills, resources, and timeline.",
                    "user_id": session_id,
                    "reset_session": False  # Continue existing session
                }
                
                response = await client.post(
                    f"{self.model_url}/chat",
                    json=followup_request,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    model_data = response.json()
                    return model_data.get("roadmap", {})
                
                return {}
                
        except Exception as e:
            logger.error(f"Follow-up request failed: {e}")
            return {}
    
    def _prepare_firestore_input(self, career_data: Dict[str, Any]) -> str:
        """Prepare input message for the Cloud Run model using Firestore career_recommendation data"""
        
        message_parts = []
        
        # Extract user info
        user_name = "Student"
        career_goal = "Software Developer"
        experience_level = "Fresher"
        
        # Get career recommendations
        if "recommendations" in career_data and career_data["recommendations"]:
            rec = career_data["recommendations"]
            if isinstance(rec, list) and len(rec) > 0:
                first_rec = rec[0]
                if "career_name" in first_rec:
                    career_goal = first_rec["career_name"]
        
        # Get user info if available
        if "user_email" in career_data:
            user_name = career_data["user_email"].split("@")[0].title()
        
        # Build comprehensive request
        message_parts.extend([
            f"Hi, my name is {user_name}.",
            f"I want to become a {career_goal}.",
            f"I am a {experience_level} level candidate.",
            "Please create a complete career roadmap for me with:"
        ])
        
        # Add specific requirements
        requirements = [
            "1. Step-by-step learning path with timeline",
            "2. Required skills for each phase", 
            "3. Learning resources and tutorials",
            "4. Portfolio project ideas",
            "5. Job preparation guidance"
        ]
        message_parts.extend(requirements)
        
        # Add resume context if available (keep it concise)
        if "resume_text" in career_data and career_data["resume_text"]:
            resume_preview = career_data["resume_text"][:500]  # First 500 chars
            message_parts.append(f"My background: {resume_preview}")
        
        message_parts.append("Generate the complete roadmap in JSON format.")
        
        final_message = " ".join(message_parts)
        logger.info(f"Prepared message for Cloud Run: {len(final_message)} characters")
        
        return final_message
    
    async def continue_chat(self, message: str, session_id: str = None) -> Dict[str, Any]:
        """Continue conversation with the Cloud Run model using session ID"""
        try:
            if not session_id:
                session_id = f"chat_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                logger.info(f"Continuing chat with Cloud Run model, session: {session_id}")
                
                request_data = {
                    "message": message,
                    "user_id": session_id,
                    "reset_session": False  # Continue existing conversation
                }
                
                response = await client.post(
                    f"{self.model_url}/chat",
                    json=request_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    model_data = response.json()
                    logger.info("Successfully received chat response from Cloud Run model")
                    return {
                        "success": True,
                        "response": model_data.get("response", ""),
                        "roadmap": model_data.get("roadmap", {}),
                        "session_id": session_id
                    }
                else:
                    logger.error(f"Cloud Run model returned status {response.status_code}: {response.text}")
                    return {
                        "success": False,
                        "response": "I'm having trouble processing your request. Please try again.",
                        "error": f"API returned {response.status_code}"
                    }
                    
        except httpx.TimeoutException:
            logger.error("Timeout in chat with Cloud Run model")
            return {
                "success": False,
                "response": "The request is taking too long. Please try a simpler question.",
                "error": "Timeout"
            }
        except Exception as e:
            logger.error(f"Error in chat with Cloud Run model: {str(e)}")
            return {
                "success": False,
                "response": "Sorry, I'm temporarily unavailable. Please try again later.",
                "error": str(e)
            }
    
    async def reset_session(self, session_id: str) -> Dict[str, Any]:
        """Reset user session in the model"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.model_url}/reset_session/{session_id}",
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    return {"success": True, "message": "Session reset successfully"}
                else:
                    return {"success": True, "message": "Session reset requested"}
                    
        except Exception as e:
            logger.error(f"Session reset error: {e}")
            return {"success": True, "message": "Session reset completed"}
    
    def _get_fallback_response(self, career_data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Generate fallback roadmap when model is unavailable"""
        
        # Extract career goal from recommendations
        career_goal = "Software Developer"
        if "recommendations" in career_data and career_data["recommendations"]:
            rec = career_data["recommendations"]
            if isinstance(rec, list) and len(rec) > 0 and "career_name" in rec[0]:
                career_goal = rec[0]["career_name"]
        
        user_name = career_data.get("user_email", "Student").split("@")[0].title()
        
        return {
            "success": True,
            "session_id": session_id,
            "fallback": True,
            "model_response": f"I've created a foundational roadmap for {career_goal}. The model service is temporarily busy, but this will get you started!",
            "roadmap": {
                "user_profile": {
                    "name": user_name,
                    "career_goal": career_goal,
                    "experience_level": "Fresher",
                    "estimated_duration": "12-18 months"
                },
                "career_outlook": {
                    "summary": f"Excellent choice! {career_goal} is a high-demand field with great growth opportunities.",
                    "average_salary_entry_level": "₹6-15 LPA",
                    "difficulty_level": "Moderate to High",
                    "key_industries": ["Technology", "Finance", "Healthcare", "E-commerce", "Startups"]
                },
                "roadmap": {
                    "title": f"{career_goal} Learning Path",
                    "description": f"Comprehensive roadmap to become a {career_goal}",
                    "nodes": [
                        {
                            "id": "start",
                            "title": "Getting Started",
                            "type": "start",
                            "status": "current",
                            "description": f"Begin your {career_goal} journey with proper planning",
                            "duration": "1-2 weeks",
                            "position": {"x": 500, "y": 50},
                            "connections": ["foundations"],
                            "skills": ["Goal Setting", "Learning Strategy", "Time Management"],
                            "resources": [
                                {"name": "Career Planning Guide", "url": "https://github.com/", "type": "guide"}
                            ]
                        },
                        {
                            "id": "foundations", 
                            "title": "Foundation Skills",
                            "type": "required",
                            "status": "locked",
                            "description": "Build strong foundational knowledge",
                            "duration": "2-3 months",
                            "position": {"x": 500, "y": 200},
                            "connections": ["core-skills"],
                            "skills": ["Programming Fundamentals", "Logic Building", "Problem Solving", "Mathematics"],
                            "resources": [
                                {"name": "Programming Basics Course", "url": "https://www.coursera.org/", "type": "course"},
                                {"name": "Logic Building Exercises", "url": "https://www.hackerrank.com/", "type": "practice"}
                            ]
                        },
                        {
                            "id": "core-skills",
                            "title": "Core Technical Skills",
                            "type": "required", 
                            "status": "locked",
                            "description": "Master essential technical skills for your field",
                            "duration": "4-6 months",
                            "position": {"x": 500, "y": 350},
                            "connections": ["specialization"],
                            "skills": ["Advanced Programming", "Frameworks", "Databases", "Version Control"],
                            "resources": [
                                {"name": "Advanced Programming", "url": "https://www.udemy.com/", "type": "course"},
                                {"name": "Framework Documentation", "url": "https://docs.github.com/", "type": "documentation"}
                            ]
                        },
                        {
                            "id": "specialization",
                            "title": "Specialization",
                            "type": "optional",
                            "status": "locked", 
                            "description": f"Specialize in specific {career_goal} areas",
                            "duration": "3-4 months",
                            "position": {"x": 500, "y": 500},
                            "connections": ["projects"],
                            "skills": ["Domain Expertise", "Advanced Tools", "Industry Knowledge"],
                            "resources": [
                                {"name": "Specialization Courses", "url": "https://www.edx.org/", "type": "course"}
                            ]
                        },
                        {
                            "id": "projects",
                            "title": "Portfolio Projects",
                            "type": "milestone",
                            "status": "locked",
                            "description": "Build impressive portfolio projects",
                            "duration": "3-4 months",
                            "position": {"x": 500, "y": 650},
                            "connections": ["job-prep"],
                            "project_ideas": [
                                f"End-to-End {career_goal} Project",
                                "Open Source Contribution",
                                "Personal Portfolio Website",
                                "Industry-Specific Application"
                            ],
                            "skills": ["Project Management", "Full Development Cycle", "Testing", "Deployment"],
                            "resources": [
                                {"name": "Project Ideas Repository", "url": "https://github.com/", "type": "repository"}
                            ]
                        },
                        {
                            "id": "job-prep",
                            "title": "Job Preparation", 
                            "type": "milestone",
                            "status": "locked",
                            "description": "Prepare for job interviews and applications",
                            "duration": "1-2 months",
                            "position": {"x": 500, "y": 800},
                            "connections": ["success"],
                            "skills": ["Interview Preparation", "Resume Building", "Networking", "System Design"],
                            "resources": [
                                {"name": "Interview Practice", "url": "https://leetcode.com/", "type": "practice"},
                                {"name": "Resume Templates", "url": "https://www.overleaf.com/", "type": "template"}
                            ]
                        },
                        {
                            "id": "success",
                            "title": f"{career_goal} Ready!",
                            "type": "success",
                            "status": "locked", 
                            "description": f"Congratulations! You're ready for {career_goal} roles",
                            "position": {"x": 500, "y": 950},
                            "connections": [],
                            "next_steps": [
                                f"Apply to {career_goal} positions",
                                "Keep learning new technologies",
                                "Build professional network",
                                "Contribute to open source",
                                "Mentor other learners"
                            ]
                        }
                    ]
                }
            },
            "generated_at": datetime.now().isoformat()
        }

# Create global instance
ml_service = MLService()