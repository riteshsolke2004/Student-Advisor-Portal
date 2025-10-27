import json
import vertexai
from vertexai.generative_models import GenerativeModel


# ==================================================
# Career Orchestrator (LLM-only)
# ==================================================
class CareerOrchestrator:
    def __init__(self, project_id: str, location: str):
        # Initialize Vertex AI
        vertexai.init(project=project_id, location=location)
        self.llm_model = GenerativeModel("gemini-2.5-flash-lite")

    # -------------------------
    # Profile Parsing
    # -------------------------
    def _parse_student_profile(self, text: str) -> dict:
        prompt = f"""
        Extract key information from the following student profile and return ONLY valid JSON.
        Required keys: 
        - "skills" (list of strings) 
        - "academics" (string) 
        - "interests" (list of strings)

        Profile Text: {text}
        """
        response = self.llm_model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except Exception:
            return {"skills": [], "academics": None, "interests": []}

    # -------------------------
    # Career Suggestions (LLM)
    # -------------------------
    def _generate_career_suggestions(self, student_profile_text: str) -> list:
        prompt = f"""
        You are a career counselor. Based on the student's profile below, suggest 3 possible career paths. 
        For each career, provide:
        - "career_name"
        - "required_skills" (list of 5–7 key skills)
        - "reasoning" (why this fits the student)

        Respond strictly in JSON array format.

        Profile: {student_profile_text}
        """
        response = self.llm_model.generate_content(prompt)
        try:
            return json.loads(response.text)
        except Exception:
            return [
                {"career_name": "General Career Suggestion", "required_skills": [], "reasoning": response.text}
            ]

    # -------------------------
    # Explanation Generation
    # -------------------------
    def _generate_explanation(self, recommendation: dict, student_profile: dict) -> str:
        prompt = f"""
        You are a career counselor. Generate a personalized explanation for the following career recommendation.

        Recommendation: {recommendation['career_name']}
        Student profile strengths: {', '.join(student_profile['skills'])}
        Suggested required skills: {', '.join(recommendation['required_skills'])}

        Provide a concise, encouraging explanation highlighting the alignment 
        and suggesting which skills to improve.
        """
        response = self.llm_model.generate_content(prompt)
        return response.text

    # -------------------------
    # Main Orchestration
    # -------------------------
    def run(self, student_profile_text: str):
        # Step 1: Parse profile
        parsed_profile = self._parse_student_profile(student_profile_text)

        # Step 2: Get career suggestions from LLM
        suggestions = self._generate_career_suggestions(student_profile_text)

        # Step 3: Add explanations
        for s in suggestions:
            s["explanation"] = self._generate_explanation(s, parsed_profile)

        return suggestions


# ==================================================
# Resume Parser
# ==================================================
import textract

class ResumeParser:
    """
    Extracts text from resume files (.pdf, .docx, etc.)
    """
    def extract(self, file_path: str) -> str:
        try:
            text = textract.process(file_path).decode("utf-8")
            return text.strip()
        except Exception as e:
            return f"Error extracting resume: {e}"
