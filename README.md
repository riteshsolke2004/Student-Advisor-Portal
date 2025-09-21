# Gen-AI Career Recommender

A next-generation AI-powered Career Recommendation & Mentorship Platform built during the Google Gen-AI Hackathon 2025.  
The platform helps students and job seekers discover the right career paths, bridge skill gaps, and connect with mentors and communities — powered by Google Vertex AI and Gemini models.

---

## Features
- Student Profiling Engine – Builds a detailed profile from academic data, personality insights, and aspirations.  
- Career Path Recommendation Engine – Personalized career suggestions using Gemini + Vertex AI.  
- Skill Gap Analyzer & Roadmap Generator – Generates gamified learning roadmaps with badges.  
- AI Mentor + Human Mentors – AI mentor for instant help + human mentors for long-term guidance.  
- Community Portal – Join domain-specific student communities.  
- Interactive Dashboard – Track progress and readiness with Looker Studio.  
- Vector Search & Knowledge Base – Fast, semantic search with Vertex AI Vector Store.  

---

## Tech Stack
- Frontend: React, Looker  
- Backend: Google Cloud Run, Firestore  
- AI/ML: Vertex AI, Gemini API, LangGraph  
- Database: Firestore, Vertex Vector Store  
- APIs: Google Search API, YouTube Data API v3  
- DevOps: Docker, GCP (Cloud Run, Firestore, Vertex AI)  

---

## Use Cases
- Students → Get a personalized career roadmap.  
- Job seekers → Analyze resumes, get skill-gap insights, and ATS improvement tips.  
- Mentorship → Access AI and Human mentors.  
- Communities → Join peer-learning networks.  

---

## Setup & Installation
```bash
# Clone the repo
git clone https://github.com/<your-username>/gen-ai-career-recommender.git
cd gen-ai-career-recommender

# Install frontend
cd skill-guru-india
npm install
npm run dev

# Install backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
