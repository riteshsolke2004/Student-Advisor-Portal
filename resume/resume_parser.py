# resume_parser.py
import pdfplumber
import vertexai
from vertexai.generative_models import GenerativeModel
import os

# Google Vertex AI setup
PROJECT_ID = "electric-medium-472710-f8"
LOCATION = "us-central1"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/app/key.json"
vertexai.init(project=PROJECT_ID, location=LOCATION)
llm = GenerativeModel("gemini-2.5-flash")

def extract_text_from_pdf(path: str) -> str:
    text = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text.append(page.extract_text())
    return "\n".join(filter(None, text))

def ask_llm(prompt: str) -> str:
    resp = llm.generate_content(prompt)
    return resp.text

def get_parse_prompt(resume_text: str) -> str:
    return f"""
You are an expert resume parser.
Extract structured data from the following resume and return valid JSON ONLY.

Fields:
- name
- contact (email, phone, linkedin)
- skills
- experience (title, company, start_date, end_date, description)
- education (degree, field, institution, year)
- projects
- certifications

Resume:
{resume_text}
"""

def get_score_prompt(resume_json: str) -> str:
    return f"""
You are an Applicant Tracking System (ATS).

Resume JSON:
{resume_json}

Score the resume (0–100) with these weights:
- Skills match (40%)
- Experience relevance (20%)
- Title/role alignment (15%)
- Education/certs (10%)
- Formatting/parseability (10%)
- Language/grammar (5%)

Return JSON ONLY:
{{
  "skill_score": ...,
  "experience_score": ...,
  "title_score": ...,
  "education_score": ...,
  "format_score": ...,
  "language_score": ...,
  "total_score": ...
}}
"""

def get_recommend_prompt(resume_json: str) -> str:
    return f"""
You are a professional resume coach.

Resume JSON: {resume_json}

Return JSON ONLY:
{{
  "missing_skills": ["..."],
  "improved_bullets": ["...", "...", "..."],
  "recommendations": ["...", "...", "..."],
  "summary": "..."
}}
"""
