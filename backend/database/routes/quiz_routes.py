# database/routes/quiz_routes.py
from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
import httpx
import logging
from typing import List, Optional
from datetime import datetime
from firebase_admin import firestore
import json

router = APIRouter(prefix="/api/quiz")
logger = logging.getLogger(__name__)

# ✅ YOUR HOSTED ML SERVICE
QUIZ_SERVICE_URL = "https://question-service-dcm6.onrender.com"

class QuizRequest(BaseModel):
    topic: str
    domain: str
    difficulty: str = "intermediate"
    num_questions: int = 5
    focus_areas: Optional[List[str]] = []
    user_level: str = "intermediate"

@router.post("/generate")
async def generate_quiz(request: QuizRequest):
    """Generate quiz from ML service and save to Firestore"""
    try:
        logger.info(f"📝 Generating quiz: {request.topic} - {request.domain}")
        
        # Call ML service
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{QUIZ_SERVICE_URL}/generate-quiz",
                json={
                    "topic": request.topic,
                    "domain": request.domain,
                    "difficulty": request.difficulty,
                    "num_questions": request.num_questions,
                    "focus_areas": request.focus_areas,
                    "user_level": request.user_level
                }
            )
            
            if response.status_code != 200:
                logger.error(f"ML service error: {response.text}")
                raise HTTPException(status_code=500, detail="Failed to generate quiz")
            
            quiz_data = response.json()
            logger.info(f"🤖 Raw ML Response: {quiz_data}")
        
        # Generate quiz ID
        quiz_id = f"quiz_{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        
        # ✅ FIXED: Format questions properly
        raw_questions = quiz_data.get('questions', [])
        formatted_questions = []
        
        for idx, q in enumerate(raw_questions):
            logger.info(f"📝 Processing Question {idx + 1}: {q}")
            
            # ✅ Handle multiple option formats
            options = []
            
            # Method 1: Already an array
            if isinstance(q.get('options'), list):
                options = q['options']
                logger.info(f"   ✅ Options (array): {options}")
            
            # Method 2: Separate fields (option_a, option_b, etc.)
            elif 'option_a' in q or 'option_b' in q:
                options = []
                for letter in ['a', 'b', 'c', 'd', 'e']:
                    opt = q.get(f'option_{letter}')
                    if opt:
                        options.append(opt)
                logger.info(f"   ✅ Options (fields): {options}")
            
            # Method 3: Options as object
            elif isinstance(q.get('options'), dict):
                options = list(q['options'].values())
                logger.info(f"   ✅ Options (dict): {options}")
            
            # Method 4: Options as string (JSON or comma-separated)
            elif isinstance(q.get('options'), str):
                try:
                    options = json.loads(q['options'])
                except:
                    options = [opt.strip() for opt in q['options'].split(',')]
                logger.info(f"   ✅ Options (string): {options}")
            
            # Validate options
            if not options or len(options) < 2:
                logger.warning(f"   ⚠️ Question {idx + 1} has insufficient options: {options}")
                continue  # Skip this question
            
            # Get correct answer
            correct_ans = q.get('correct_answer') or q.get('answer') or q.get('correct')
            
            # If correct answer is just a letter (A, B, C, D), convert to actual option
            if correct_ans and len(correct_ans) == 1 and correct_ans.upper() in ['A', 'B', 'C', 'D', 'E']:
                letter_index = ord(correct_ans.upper()) - ord('A')
                if letter_index < len(options):
                    correct_ans = options[letter_index]
                    logger.info(f"   ✅ Converted answer '{q.get('correct_answer')}' to: {correct_ans}")
            
            formatted_question = {
                'question': q.get('question', ''),
                'options': options,
                'correct_answer': correct_ans,
                'explanation': q.get('explanation', ''),
                'category': q.get('category', request.topic)
            }
            
            formatted_questions.append(formatted_question)
            logger.info(f"   ✅ Formatted Question {idx + 1}: {formatted_question}")
        
        if not formatted_questions:
            raise HTTPException(
                status_code=500, 
                detail="No valid questions could be generated. Please try again."
            )
        
        logger.info(f"✅ Total formatted questions: {len(formatted_questions)}")
        
        # Save to Firestore
        db = firestore.client()
        quiz_doc = {
            'quiz_id': quiz_id,
            'topic': request.topic,
            'domain': request.domain,
            'difficulty': request.difficulty,
            'questions': formatted_questions,
            'created_at': firestore.SERVER_TIMESTAMP,
            'status': 'active'
        }
        
        db.collection('quizzes').document(quiz_id).set(quiz_doc)
        logger.info(f"💾 Quiz saved: {quiz_id}")
        
        return {
            'success': True,
            'quiz_id': quiz_id,
            'questions': formatted_questions,
            'metadata': {
                'topic': request.topic,
                'domain': request.domain,
                'difficulty': request.difficulty,
                'num_questions': len(formatted_questions),
                'generated_at': datetime.now().isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error generating quiz: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit")
async def submit_quiz(
    quiz_id: str = Form(...),
    user_email: str = Form(...),
    answers: str = Form(...),  # JSON string
    time_spent: int = Form(...)
):
    """Submit quiz and calculate score"""
    try:
        logger.info(f"📊 Submitting quiz: {quiz_id} for {user_email}")
        
        # Parse answers
        user_answers = json.loads(answers)
        
        # Get quiz from Firestore
        db = firestore.client()
        quiz_doc = db.collection('quizzes').document(quiz_id).get()
        
        if not quiz_doc.exists:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        quiz_data = quiz_doc.to_dict()
        questions = quiz_data.get('questions', [])
        
        # Calculate score
        correct_count = 0
        answer_details = []
        
        for idx, question in enumerate(questions):
            user_answer = user_answers.get(str(idx), '')
            correct_answer = question.get('correct_answer', '')
            is_correct = user_answer == correct_answer
            
            if is_correct:
                correct_count += 1
            
            answer_details.append({
                'question': question.get('question', ''),
                'user_answer': user_answer,
                'correct_answer': correct_answer,
                'is_correct': is_correct,
                'explanation': question.get('explanation', '')
            })
        
        total_questions = len(questions)
        score = round((correct_count / total_questions) * 100) if total_questions > 0 else 0
        passed = score >= 60
        
        # Save result to Firestore
        result_doc = {
            'quiz_id': quiz_id,
            'user_email': user_email,
            'topic': quiz_data.get('topic'),
            'domain': quiz_data.get('domain'),
            'difficulty': quiz_data.get('difficulty'),
            'score': score,
            'correct_count': correct_count,
            'total_questions': total_questions,
            'passed': passed,
            'time_spent': time_spent,
            'answers': user_answers,
            'answer_details': answer_details,
            'submitted_at': firestore.SERVER_TIMESTAMP
        }
        
        db.collection('quiz_results').add(result_doc)
        logger.info(f"✅ Result saved: Score {score}% ({correct_count}/{total_questions})")
        
        return {
            'success': True,
            'score': score,
            'correct': correct_count,
            'total': total_questions,
            'passed': passed,
            'time_spent': time_spent,
            'answers': answer_details
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid answers format")
    except Exception as e:
        logger.error(f"❌ Error submitting quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{user_email}")
async def get_quiz_history(user_email: str):
    """Get user's quiz history"""
    try:
        db = firestore.client()
        results = db.collection('quiz_results')\
            .where('user_email', '==', user_email)\
            .order_by('submitted_at', direction=firestore.Query.DESCENDING)\
            .limit(20)\
            .stream()
        
        history = []
        for doc in results:
            data = doc.to_dict()
            history.append({
                'id': doc.id,
                'quiz_id': data.get('quiz_id'),
                'topic': data.get('topic'),
                'domain': data.get('domain'),
                'difficulty': data.get('difficulty'),
                'score': data.get('score'),
                'passed': data.get('passed'),
                'correct_count': data.get('correct_count'),
                'total_questions': data.get('total_questions'),
                'time_spent': data.get('time_spent'),
                'submitted_at': data.get('submitted_at')
            })
        
        return {'success': True, 'history': history}
        
    except Exception as e:
        logger.error(f"❌ Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/result/{quiz_id}/{user_email}")
async def get_quiz_result(quiz_id: str, user_email: str):
    """Get specific quiz result with answer details"""
    try:
        db = firestore.client()
        results = db.collection('quiz_results')\
            .where('quiz_id', '==', quiz_id)\
            .where('user_email', '==', user_email)\
            .limit(1)\
            .stream()
        
        for doc in results:
            data = doc.to_dict()
            return {
                'success': True,
                'result': {
                    'score': data.get('score'),
                    'correct': data.get('correct_count'),
                    'total': data.get('total_questions'),
                    'passed': data.get('passed'),
                    'time_spent': data.get('time_spent'),
                    'answers': data.get('answer_details', [])
                }
            }
        
        raise HTTPException(status_code=404, detail="Result not found")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Check ML service health"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{QUIZ_SERVICE_URL}/health")
            return {
                'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                'ml_service': response.status_code,
                'timestamp': datetime.now().isoformat()
            }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
