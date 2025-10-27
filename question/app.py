# app.py - Enhanced MCQ Generator (Corrected)
import json
import re
from typing import Dict, Any, List
from fastapi import FastAPI, Query, HTTPException, Body
from pydantic import BaseModel
import uvicorn
import vertexai
from vertexai.generative_models import GenerativeModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MCQ Generator API", version="1.0.0")

# ✅ Fixed CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080","*","https://mcq-generator-278398219986.us-central1.run.app"],  # allow all origins for now (change in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class QuizRequest(BaseModel):
    topic: str
    domain: str
    difficulty: str = "intermediate"  # beginner, intermediate, advanced
    num_questions: int = 10
    focus_areas: List[str] = []  # specific skills to focus on
    user_level: str = "intermediate"

class MCQGeneratorAgent:
    def __init__(self, project_id: str, location: str = "us-central1"):
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-2.5-pro")

    def generate_mcqs(self, request: QuizRequest) -> Dict[str, Any]:
        prompt = f"""
        You are an expert educational content creator. Generate {request.num_questions} multiple-choice questions
        for a skills assessment with the following specifications:

        Topic: "{request.topic}"
        Domain: "{request.domain}"
        Difficulty Level: {request.difficulty}
        User Level: {request.user_level}
        Focus Areas: {', '.join(request.focus_areas) if request.focus_areas else 'General skills'}

        Requirements:
        1. Exactly {request.num_questions} MCQs
        2. Each question should have 4 options (A, B, C, D)
        3. Questions should be appropriate for {request.difficulty} level
        4. Include practical, real-world scenarios
        5. Provide correct answer and detailed explanation for learning
        6. Return ONLY valid JSON in this exact format:

        {{
            "quiz_metadata": {{
                "topic": "{request.topic}",
                "domain": "{request.domain}",
                "difficulty": "{request.difficulty}",
                "total_questions": {request.num_questions},
                "estimated_time": "15-20 minutes"
            }},
            "questions": [
                {{
                    "id": 1,
                    "question": "Question text here",
                    "options": {{
                        "A": "Option A text",
                        "B": "Option B text",
                        "C": "Option C text",
                        "D": "Option D text"
                    }},
                    "correct_answer": "A",
                    "explanation": "Detailed explanation of why this is correct",
                    "skill_category": "Technical Skills",
                    "difficulty_score": 7
                }}
            ]
        }}
        """

        try:
            response = self.model.generate_content(
                [prompt],
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 6000,
                    "top_p": 0.9
                }
            )

            raw_text = response.candidates[0].content.parts[0].text.strip()

            # ✅ Clean unwanted markdown fences (```json ... ```)
            clean_text = re.sub(r"^```(?:json)?", "", raw_text)
            clean_text = re.sub(r"```$", "", clean_text).strip()

            return json.loads(clean_text)

        except json.JSONDecodeError as je:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse generated quiz JSON: {str(je)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Quiz generation failed: {str(e)}"
            )

# ---------------- Endpoints ----------------
@app.get("/")
def root():
    return {
        "message": "MCQ Generator API for Skills Assessment 🚀",
        "version": "1.0.0",
        "endpoints": {
            "/": "Base endpoint",
            "/generate": "Generate MCQs (GET with query params)",
            "/generate-quiz": "Generate MCQs (POST with detailed request)",
            "/health": "Health check"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "MCQ Generator"}

@app.get("/generate")
def generate_legacy(
    topic: str = Query(..., description="Quiz topic"),
    domain: str = Query(..., description="Subject domain"),
    num_questions: int = Query(10, description="Number of questions")
):
    agent = MCQGeneratorAgent(project_id="electric-medium-472710-f8")
    request = QuizRequest(
        topic=topic,
        domain=domain,
        num_questions=num_questions
    )
    return agent.generate_mcqs(request)

@app.post("/generate")
def generate_legacy(
    topic: str = Query(..., description="Quiz topic"),
    domain: str = Query(..., description="Subject domain"),
    num_questions: int = Query(10, description="Number of questions")
):
    agent = MCQGeneratorAgent(project_id="electric-medium-472710-f8")
    request = QuizRequest(
        topic=topic,
        domain=domain,
        num_questions=num_questions
    )
    return agent.generate_mcqs(request)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8080, reload=True)
