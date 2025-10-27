from fastapi import FastAPI, UploadFile, File
from career_orchestrator import CareerOrchestrator, ResumeParser

app = FastAPI()

# Initialize orchestrator with your project + region
orchestrator = CareerOrchestrator(
    project_id="electric-medium-472710-f8",
    location="us-central1"
)
resume_parser = ResumeParser()


# -------------------------
# Health Check
# -------------------------
@app.get("/")
def health_check():
    return {"status": "Career Advisor API is running!"}


# -------------------------
# Upload Resume & Get Suggestions
# -------------------------
@app.post("/analyze-resume/")
async def analyze_resume(file: UploadFile = File(...)):
    try:
        # Save uploaded resume temporarily
        file_location = f"/tmp/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Extract text
        resume_text = resume_parser.extract(file_location)

        # Run orchestration
        recommendations = orchestrator.run(resume_text)

        return {
            "resume_text": resume_text[:500],  # show preview only
            "recommendations": recommendations
        }
    except Exception as e:
        return {"error": str(e)}


# -------------------------
# Analyze Raw Profile Text
# -------------------------
@app.post("/analyze-profile/")
async def analyze_profile(profile_text: str):
    try:
        recommendations = orchestrator.run(profile_text)
        return {"recommendations": recommendations}
    except Exception as e:
        return {"error": str(e)}
