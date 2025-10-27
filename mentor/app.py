from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mentor import tools
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_vertexai import ChatVertexAI
from google.oauth2 import service_account
import os
import json
import uvicorn

app = FastAPI(title="Mentor API", description="AI Career Mentor with Tools")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str

class HealthResponse(BaseModel):
    status: str
    message: str

class ToolInfo(BaseModel):
    name: str
    description: str

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Mentor API is running successfully",
        "version": "1.0.0",
        "status": "healthy",
        "description": "AI Career Mentor powered by Gemini 2.0 Flash",
        "endpoints": {
            "chat": "/chat",
            "health": "/health",
            "docs": "/docs",
            "openapi": "/openapi.json"
        },
        "model": "gemini-2.0-flash",
        "tools": ["web_search", "job_search", "wellness_guide", "calendar"]
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check if LLM is initialized
        if 'llm_with_tools' in globals() and llm_with_tools is not None:
            return HealthResponse(
                status="healthy", 
                message="Mentor API is healthy - Gemini AI initialized and ready"
            )
        else:
            return HealthResponse(
                status="degraded", 
                message="Mentor API running but Gemini AI not fully initialized"
            )
    except Exception as e:
        return HealthResponse(
            status="unhealthy", 
            message=f"Health check failed: {str(e)}"
        )


# Initialize Vertex AI
def initialize_vertex_ai():
    """Initialize Vertex AI with service account credentials"""
    # Use the service account info directly from environment variable
    service_account_info = os.getenv('GOOGLE_SERVICE_ACCOUNT')
    
    if service_account_info:
        # Parse the service account info from JSON string
        sa_dict = json.loads(service_account_info)
        creds = service_account.Credentials.from_service_account_info(sa_dict)
    else:
        # Fallback to file-based approach
        creds_path = os.getenv('GOOGLE_CREDENTIALS_PATH', 'service-account-key.json')
        creds = service_account.Credentials.from_service_account_file(creds_path)
    
    llm = ChatVertexAI(
        model_name="gemini-2.0-flash",
        temperature=0.7,  # Slightly higher temperature for more creative responses
        credentials=creds,
        project=creds.project_id,
        location=os.getenv('GOOGLE_LOCATION', 'us-central1')
    )
    return llm

# Initialize LLMs
try:
    llm = initialize_vertex_ai()
    llm_with_tools = llm.bind_tools(tools)
    llm_fallback = initialize_vertex_ai()  # Separate instance for fallback
    print("✅ Vertex AI initialized successfully")
except Exception as e:
    print(f"❌ Error initializing Vertex AI: {e}")
    llm_with_tools = None
    llm_fallback = None

def should_use_tools(message: str) -> bool:
    """Determine if the message requires tool usage"""
    tool_keywords = [
        'search', 'find', 'lookup', 'job', 'career', 'position', 'role',
        'wellness', 'stress', 'anxiety', 'mental health', 'calm',
        'calendar', 'schedule', 'meeting', 'appointment', 'invite',
        'web', 'internet', 'online', 'latest', 'current', 'trend'
    ]
    
    message_lower = message.lower()
    
    # Check if message contains tool-related keywords
    for keyword in tool_keywords:
        if keyword in message_lower:
            return True
    
    # Simple questions that don't need tools
    simple_questions = [
        'how are you', 'what is', 'who is', 'when is', 'where is',
        'why', 'explain', 'tell me about', 'define', 'describe'
    ]
    
    for question in simple_questions:
        if message_lower.startswith(question):
            return False
    
    return False

def get_fallback_response(message: str) -> str:
    """Get response using the fallback LLM for general questions"""
    system_prompt = """You are a helpful AI career mentor assistant. Provide helpful, 
    informative, and supportive responses to general questions. Be professional yet 
    friendly in your tone. If you don't know something, admit it honestly."""
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=message)
    ]
    
    try:
        response = llm_fallback.invoke(messages)
        return response.content
    except Exception as e:
        return f"I apologize, but I'm having trouble processing your question right now. Error: {str(e)}"


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    if not llm_with_tools or not llm_fallback:
        raise HTTPException(status_code=500, detail="LLM not initialized")
        
    try:
        message = request.message
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Check if we should use tools or fallback
        if should_use_tools(message):
            # Use tools-enabled LLM
            messages = [HumanMessage(content=message)]
            response = llm_with_tools.invoke(messages)
            
            # Check if tool calls are needed
            if hasattr(response, 'tool_calls') and response.tool_calls:
                tool_results = []
                for tool_call in response.tool_calls:
                    tool_name = tool_call['name']
                    tool_args = tool_call['args']
                    
                    # Find and execute the tool
                    for tool in tools:
                        if tool.name == tool_name:
                            result = tool.invoke(tool_args)
                            tool_results.append(f"{tool_name} result: {result}")
                            break
                
                # If we have tool results, send them to the LLM for a final response
                if tool_results:
                    follow_up_message = f"Original query: {message}\n\nTool results:\n" + "\n".join(tool_results)
                    follow_up_messages = [HumanMessage(content=follow_up_message)]
                    final_response = llm_with_tools.invoke(follow_up_messages)
                    return ChatResponse(response=final_response.content, status="success")
            
            # Return direct response if no tools were called
            return ChatResponse(response=response.content, status="success")
        else:
            # Use fallback for general questions
            response = get_fallback_response(message)
            return ChatResponse(response=response, status="success")
        
    except Exception as e:
        # If anything fails, use the fallback
        try:
            fallback_response = get_fallback_response(message)
            return ChatResponse(response=fallback_response, status="success")
        except:
            return ChatResponse(
                response="I apologize, but I'm experiencing technical difficulties. Please try again later.",
                status="error"
            )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # default to 8080 if not set
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
