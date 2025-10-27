# main.py
from fastapi import FastAPI, UploadFile, HTTPException
import shutil, json
from resume_parser import extract_text_from_pdf, ask_llm, get_parse_prompt, get_score_prompt, get_recommend_prompt
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def safe_json_loads(s: str):
    try:
        return json.loads(s)
    except Exception:
        import re
        match = re.search(r"\{.*\}", s, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                return {"error": "invalid_json", "raw": s}
        return {"error": "empty_or_invalid", "raw": s}

@app.get("/")
def root():
    return {
        "message": "Welcome to the Resume Analyzer API 📄🚀",
        "endpoints": {
            "/analyze_resume/": "Upload a resume to analyze"
        }
    }

@app.post("/analyze_resume/")
async def analyze_resume(file: UploadFile):
    try:
        # Save uploaded resume locally
        with open(file.filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        resume_text = extract_text_from_pdf(file.filename)

        # Default job description
        default_job_description = """
        General professional position requiring:
        - Strong technical skills
        - Good communication abilities
        - Problem-solving experience
        - Team collaboration
        - Professional experience in relevant field
        """

        # Stage 1: Parse
        parsed_resume = ask_llm(get_parse_prompt(resume_text))

        # Stage 2: ATS Score
        ats_score = ask_llm(get_score_prompt(parsed_resume))

        # Stage 3: Recommendations
        recommendations = ask_llm(get_recommend_prompt(parsed_resume))

        return {
            "ats_score": safe_json_loads(ats_score),
            "recommendations": safe_json_loads(recommendations)
        }

    except Exception as e:
        import traceback
        print("ERROR:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")
