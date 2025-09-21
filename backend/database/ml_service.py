import json
import httpx
import logging
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
        This is the first call to the model using Firestore data
        """
        try:
            # Call the Cloud Run model with longer timeout
            async with httpx.AsyncClient(timeout=120.0) as client:  # Increased timeout
                logger.info(f"Calling Cloud Run model at {self.model_url}/chat with Firestore data")
                
                # Prepare the message for the model using Firestore data
                message = self._prepare_firestore_input(career_data)
                logger.info(f"Prepared message length: {len(message)} characters")
                
                response = await client.post(
                    f"{self.model_url}/chat",
                    json={"message": message},
                    headers={"Content-Type": "application/json"}
                )
                
                logger.info(f"Cloud Run response status: {response.status_code}")
                
                if response.status_code == 200:
                    model_data = response.json()
                    
                    # Store the model response
                    self.roadmap_response = model_data.get("roadmap", {})
                    
                    logger.info("Successfully received response from Cloud Run model")
                    return self.roadmap_response
                else:
                    logger.error(f"Cloud Run model returned status {response.status_code}: {response.text}")
                    raise Exception(f"Model API error: {response.status_code} - {response.text}")
                    
        except httpx.TimeoutException:
            logger.error("Timeout calling Cloud Run model - try increasing Cloud Run timeout settings")
            raise Exception("Model API timeout - the model is taking too long to respond")
        except Exception as e:
            logger.error(f"Error calling Cloud Run model: {str(e)}")
            raise Exception(f"Model API error: {str(e)}")
    
    def _prepare_firestore_input(self, career_data: Dict[str, Any]) -> str:
        """Prepare input message for the Cloud Run model using Firestore career_recommendation data"""
        
        # Start with a shorter, simpler message for testing
        message_parts = ["Create a career roadmap for me."]
        
        # Add career recommendations if available
        if "recommendations" in career_data and career_data["recommendations"]:
            rec = career_data["recommendations"]
            if isinstance(rec, list) and len(rec) > 0:
                first_rec = rec[0]
                if "career_name" in first_rec:
                    message_parts.append(f"I'm interested in {first_rec['career_name']}.")
        
        # Add resume text (but keep it short for now)
        if "resume_text" in career_data and career_data["resume_text"]:
            resume_preview = career_data["resume_text"][:300]  # First 300 chars only
            message_parts.append(f"Resume preview: {resume_preview}")
        
        # Keep the message concise to avoid timeouts
        message_parts.append("Please provide a detailed learning roadmap.")
        
        final_message = " ".join(message_parts)
        logger.info(f"Prepared message for Cloud Run: {len(final_message)} characters")
        
        return final_message
    
    async def continue_chat(self, message: str) -> Dict[str, Any]:
        """Continue conversation with the Cloud Run model"""
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                logger.info(f"Continuing chat with Cloud Run model")
                
                response = await client.post(
                    f"{self.model_url}/chat",
                    json={"message": message},
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    model_data = response.json()
                    logger.info("Successfully received chat response from Cloud Run model")
                    return {
                        "response": model_data.get("response", ""),
                        "roadmap": model_data.get("roadmap", {})
                    }
                else:
                    logger.error(f"Cloud Run model returned status {response.status_code}: {response.text}")
                    raise Exception(f"Chat API error: {response.status_code}")
                    
        except httpx.TimeoutException:
            logger.error("Timeout in chat with Cloud Run model")
            raise Exception("Chat API timeout")
        except Exception as e:
            logger.error(f"Error in chat with Cloud Run model: {str(e)}")
            raise Exception(f"Chat API error: {str(e)}")

# Create global instance
ml_service = MLService()