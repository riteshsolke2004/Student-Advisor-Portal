from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import random

# Remove database and auth imports for now
from .ml_service import ml_service

router = APIRouter()

class CareerAssessmentRequest(BaseModel):
    name: str
    career_goal: str
    experience_level: str = "Fresher"

# Simplified career paths for testing
CAREER_PATHS_DATA = [
    {
        "title": "AI Engineer",
        "description": "Design and develop artificial intelligence systems and machine learning models",
        "icon": "Brain",
        "match": random.randint(85, 95),
        "salary": "₹8-20 LPA",
        "growth": "Very High",
        "demand": "Very High",
        "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Deep Learning"],
        "companies": ["Google", "Microsoft", "Amazon", "OpenAI", "NVIDIA"],
        "gradient": "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
        "title": "Full Stack Developer",
        "description": "Build complete web applications from frontend to backend",
        "icon": "Code",
        "match": random.randint(75, 85),
        "salary": "₹6-15 LPA",
        "growth": "High",
        "demand": "Very High",
        "skills": ["React", "Node.js", "JavaScript", "MongoDB", "Python"],
        "companies": ["TCS", "Infosys", "Flipkart", "Swiggy", "Zomato"],
        "gradient": "gradient-primary"
    },
    {
        "title": "Data Scientist",
        "description": "Extract insights from data to drive business decisions",
        "icon": "BarChart3",
        "match": random.randint(80, 90),
        "salary": "₹8-18 LPA",
        "growth": "Very High",
        "demand": "Very High",
        "skills": ["Python", "Machine Learning", "SQL", "Statistics", "Tableau"],
        "companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Jio"],
        "gradient": "bg-gradient-to-br from-warning to-orange-400"
    },
    {
        "title": "DevOps Engineer",
        "description": "Implement and manage CI/CD pipelines and cloud infrastructure",
        "icon": "Server",
        "match": random.randint(80, 90),
        "salary": "₹10-15 LPA",
        "growth": "Very High",
        "demand": "Very High",
        "skills": ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
        "companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Jio"],
        "gradient": "bg-gradient-to-br from-warning to-orange-400"
    }
]

@router.get("/api/career-paths")
async def get_career_paths():
    """Get career paths (simplified for testing - no auth needed)"""
    try:
        return {
            "career_paths": CAREER_PATHS_DATA,
            "message": "Career paths retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/api/generate-career-roadmap")
async def generate_career_roadmap(request: CareerAssessmentRequest):
    """Generate career roadmap using your test JSON data (no auth needed)"""
    
    try:
        # Prepare input for ML service
        ml_input = {
            "name": request.name,
            "career_goal": request.career_goal,
            "experience_level": request.experience_level
        }
        
        # Get roadmap from ML service (returns your test JSON)
        roadmap_data = await ml_service.generate_career_roadmap(ml_input)
        
        return roadmap_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {str(e)}")
