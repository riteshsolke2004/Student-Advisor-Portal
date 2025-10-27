from fastapi import FastAPI
from pydantic import BaseModel
from app import app as langgraph_app
from langchain_core.messages import HumanMessage, AIMessage

api = FastAPI()

# Shared state
state = {"chat_history": []}
config = {"recursion_limit": 50}

class UserInput(BaseModel):
    message: str

@api.post("/chat")
def chat(input: UserInput):
    global state
    if "user_request" not in state:
        state["user_request"] = input.message
    state["chat_history"].append(HumanMessage(content=input.message))
    result = langgraph_app.invoke(state, config=config)
    state.update(result)
    ai_response = next(
        item for item in reversed(state["chat_history"])
        if isinstance(item, AIMessage)
    ).content
    roadmap = state.get("final_roadmap")
    return {
        "response": ai_response,
        "roadmap": roadmap
    }
