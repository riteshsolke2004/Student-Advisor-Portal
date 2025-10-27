from langchain.tools import tool
import os
import json

# --- Tool 1: Live Web Search ---
@tool
def search_the_web(query: str) -> str:
    """Gets real-time information from the web for a given query."""
    # This is a placeholder for a real search API
    return f"Web search results for '{query}': The latest trends show a high demand for AI skills globally."

# --- Tool 2: Wellness Guide Consultant ---
@tool
def search_wellness_guide(query: str) -> str:
    """Consults the internal wellness handbook for advice on stress, anxiety, and interviews."""
    if "anxiety" in query.lower():
        return "The wellness guide suggests the '4-7-8 breathing technique' for interview anxiety."
    elif "stress" in query.lower():
        return "The wellness guide recommends regular exercise and meditation for stress management."
    return "No specific information found in the wellness guide."

# --- Tool 3: GLOBAL Job Search ---
@tool
def search_job_listings(role: str, location: str) -> str:
    """Searches the database for job listings for a specific role and location."""
    return f"Searching for '{role}' roles in '{location}'... Found 3 matching jobs: (1) Senior Developer at TechCorp, (2) Cloud Engineer at Cloudways, (3) Junior Python Dev at StartUp Inc."

# --- Tool 4: Calendar Action ---
@tool
def create_calendar_invite(details: str) -> str:
    """Creates a calendar invite for a mock interview or coaching session."""
    return f"Success! A calendar invite for '{details}' has been created."

# Export tools
tools = [search_the_web, search_wellness_guide, search_job_listings, create_calendar_invite]