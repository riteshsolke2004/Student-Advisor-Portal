import os
import json
import logging
from typing import List, Dict, Optional
from googleapiclient.discovery import build
from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import vertexai
import asyncio

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Vertex AI
project_id = os.getenv("GCP_PROJECT", "electric-medium-472710-f8")
location = os.getenv("GCP_LOCATION", "us-central1")
vertexai.init(project=project_id, location=location)

llm = ChatVertexAI(
    model_name="gemini-2.0-flash-exp",
    temperature=0.3,
    max_output_tokens=8192,
    top_p=0.8,
    top_k=40
)

logger.info("✅ Vertex AI LLM initialized")

# ============================================================
# TOOLS: Search Functions
# ============================================================

def search_google_courses(query: str, max_results: int = 5) -> List[Dict]:
    """Search Google Custom Search for courses"""
    try:
        api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyCFWlqhoijAJW5QGYi_ImQKLVO9I3edyxA")
        cse_id = os.getenv("SEARCH_ENGINE_ID", "41e5b4c1e4c9e4c7c")
        
        if not api_key or not cse_id:
            logger.warning("Google API credentials not configured, using fallback")
            return _get_fallback_courses(query)
        
        service = build("customsearch", "v1", developerKey=api_key)
        search_query = f"{query} course tutorial certification"
        
        res = service.cse().list(q=search_query, cx=cse_id, num=max_results).execute()
        
        results = []
        for item in res.get('items', [])[:max_results]:
            results.append({
                "name": item.get('title', ''),
                "url": item.get('link', ''),
                "description": item.get('snippet', ''),
                "type": "course",
                "provider": _extract_provider(item.get('link', ''))
            })
        
        return results
    except Exception as e:
        logger.error(f"Google search error: {e}, using fallback")
        return _get_fallback_courses(query)

def search_youtube_tutorials(query: str, max_results: int = 3) -> List[Dict]:
    """Search YouTube for tutorials"""
    try:
        api_key = os.getenv("YOUTUBE_API_KEY", "AIzaSyCFWlqhoijAJW5QGYi_ImQKLVO9I3edyxA")
        
        if not api_key:
            logger.warning("YouTube API key not configured, using fallback")
            return _get_fallback_videos(query)
        
        youtube = build("youtube", "v3", developerKey=api_key)
        request = youtube.search().list(
            q=f"{query} tutorial complete guide",
            part="snippet",
            type="video",
            maxResults=max_results,
            relevanceLanguage="en",
            order="relevance"
        ).execute()
        
        results = []
        for item in request.get("items", []):
            video_id = item.get("id", {}).get("videoId")
            if video_id:
                results.append({
                    "name": item["snippet"]["title"],
                    "url": f"https://www.youtube.com/watch?v={video_id}",
                    "description": item["snippet"]["description"][:200],
                    "type": "video",
                    "channel": item["snippet"]["channelTitle"],
                    "duration": _estimate_duration(item["snippet"]["title"])
                })
        
        return results
    except Exception as e:
        logger.error(f"YouTube search error: {e}, using fallback")
        return _get_fallback_videos(query)

def _get_fallback_courses(query: str) -> List[Dict]:
    """Fallback courses when API fails"""
    fallback_courses = [
        {
            "name": f"Complete {query} Course",
            "url": "https://www.coursera.org",
            "description": f"Comprehensive {query} course covering fundamentals to advanced topics",
            "type": "course",
            "provider": "Coursera"
        },
        {
            "name": f"{query} Specialization",
            "url": "https://www.udemy.com",
            "description": f"Professional {query} certification program",
            "type": "course",
            "provider": "Udemy"
        }
    ]
    return fallback_courses

def _get_fallback_videos(query: str) -> List[Dict]:
    """Fallback videos when API fails"""
    fallback_videos = [
        {
            "name": f"{query} Complete Tutorial",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "description": f"Complete {query} tutorial from basics to advanced",
            "type": "video",
            "channel": "TechChannel",
            "duration": "2-4 hours"
        }
    ]
    return fallback_videos

def _extract_provider(url: str) -> str:
    """Extract course provider from URL"""
    if "coursera" in url.lower():
        return "Coursera"
    elif "udemy" in url.lower():
        return "Udemy"
    elif "edx" in url.lower():
        return "edX"
    elif "khan" in url.lower():
        return "Khan Academy"
    else:
        return "Online Platform"

def _estimate_duration(title: str) -> str:
    """Estimate video duration from title"""
    title_lower = title.lower()
    if "complete" in title_lower or "full" in title_lower:
        return "3-5 hours"
    elif "crash course" in title_lower:
        return "1-2 hours"
    else:
        return "30-60 minutes"

def generate_project_ideas(topic: str, skill_level: str = "beginner") -> List[Dict]:
    """Generate project ideas using LLM"""
    try:
        prompt = ChatPromptTemplate.from_template(
            """Generate 3 practical project ideas for learning {topic} at {skill_level} level.

For each project, provide:
- name: Clear project name (max 50 chars)
- description: 2-3 sentence description explaining what you'll build
- skills: List of 3-5 specific skills learned
- difficulty: beginner/intermediate/advanced
- duration: estimated time to complete
- github_ready: true/false (if suitable for portfolio)

Return as JSON array of objects with exactly these fields."""
        )
        
        chain = prompt | llm | JsonOutputParser()
        projects = chain.invoke({"topic": topic, "skill_level": skill_level})
        
        # Validate and clean projects
        if isinstance(projects, list):
            validated_projects = []
            for project in projects[:3]:  # Limit to 3 projects
                if isinstance(project, dict) and "name" in project:
                    validated_projects.append({
                        "name": project.get("name", "Project")[:50],
                        "description": project.get("description", "Build a practical project"),
                        "skills": project.get("skills", [])[:5],
                        "difficulty": project.get("difficulty", skill_level),
                        "duration": project.get("duration", "1-2 weeks"),
                        "github_ready": project.get("github_ready", True)
                    })
            return validated_projects
        
        return []
    except Exception as e:
        logger.error(f"Project generation error: {e}")
        return _get_fallback_projects(topic, skill_level)

def _get_fallback_projects(topic: str, skill_level: str) -> List[Dict]:
    """Fallback projects when generation fails"""
    return [
        {
            "name": f"Basic {topic} Project",
            "description": f"Build a foundational project to practice {topic} concepts",
            "skills": [f"{topic} Basics", "Problem Solving", "Code Structure"],
            "difficulty": skill_level,
            "duration": "1-2 weeks",
            "github_ready": True
        }
    ]

# ============================================================
# CORE: Roadmap Generator
# ============================================================

class RoadmapGenerator:
    """Generates comprehensive, personalized learning roadmaps"""
    
    def __init__(self):
        self.llm = llm
    
    def generate_roadmap(self, query: str, existing_roadmap: Optional[Dict] = None) -> Dict:
        """
        Generate a complete roadmap from a query
        
        Args:
            query: User's learning goal (e.g., "I want to learn AI ML and DevOps")
            existing_roadmap: Previous roadmap for memory/editing
        
        Returns:
            Complete roadmap JSON with all details
        """
        logger.info(f"Generating roadmap for query: {query}")
        
        try:
            # Step 1: Extract learning topics from query
            topics = self._extract_topics(query)
            logger.info(f"Extracted topics: {topics}")
            
            # Step 2: Generate roadmap structure with subtopics
            roadmap_structure = self._generate_structure(topics, query)
            
            # Step 3: Enrich each node with resources and projects
            enriched_roadmap = self._enrich_nodes(roadmap_structure)
            
            # Step 4: If editing existing roadmap, merge intelligently
            if existing_roadmap:
                enriched_roadmap = self._merge_roadmaps(existing_roadmap, enriched_roadmap, query)
            
            # Step 5: Add metadata
            enriched_roadmap = self._add_metadata(enriched_roadmap, query)
            
            logger.info("✅ Roadmap generation complete")
            return enriched_roadmap
            
        except Exception as e:
            logger.error(f"Error in roadmap generation: {e}")
            return self._get_fallback_roadmap(query)
    
    def _extract_topics(self, query: str) -> List[str]:
        """Extract main learning topics from user query"""
        try:
            prompt = ChatPromptTemplate.from_template(
                """Analyze this learning request and extract the main topics/domains the user wants to learn.

User request: {query}

Return a JSON array of topic strings. Be specific and comprehensive.
Focus on technical skills, frameworks, and domains.
Example: ["Machine Learning", "Deep Learning", "DevOps", "Kubernetes"]

Maximum 6 topics. Each topic should be 1-3 words."""
            )
            
            chain = prompt | self.llm | JsonOutputParser()
            topics = chain.invoke({"query": query})
            
            if isinstance(topics, list) and len(topics) > 0:
                return topics[:6]  # Limit to 6 topics
            else:
                return self._extract_topics_fallback(query)
                
        except Exception as e:
            logger.error(f"Topic extraction error: {e}")
            return self._extract_topics_fallback(query)
    
    def _extract_topics_fallback(self, query: str) -> List[str]:
        """Fallback topic extraction using keyword matching"""
        common_topics = {
            "machine learning": "Machine Learning",
            "ai": "Artificial Intelligence", 
            "devops": "DevOps",
            "react": "React",
            "python": "Python",
            "javascript": "JavaScript",
            "web development": "Web Development",
            "backend": "Backend Development",
            "frontend": "Frontend Development",
            "data science": "Data Science",
            "cloud": "Cloud Computing"
        }
        
        query_lower = query.lower()
        found_topics = []
        
        for keyword, topic in common_topics.items():
            if keyword in query_lower:
                found_topics.append(topic)
        
        return found_topics[:4] if found_topics else ["Programming Fundamentals"]
    
    def _generate_structure(self, topics: List[str], original_query: str) -> Dict:
        """Generate complete roadmap structure with all details"""
        
        try:
            prompt = ChatPromptTemplate.from_template(
                """You are an expert curriculum designer. Create a comprehensive learning roadmap.

USER GOAL: {original_query}
MAIN TOPICS: {topics}

Generate a detailed roadmap with this EXACT JSON structure:

{{
  "metadata": {{
    "title": "Complete Learning Path for [Main Goal]",
    "description": "Comprehensive roadmap covering all required skills",
    "total_duration": "6-12 months",
    "difficulty": "beginner-to-advanced",
    "created_for": "{original_query}",
    "total_nodes": 0,
    "estimated_hours": 240
  }},
  "career_insights": {{
    "job_roles": ["Role 1", "Role 2", "Role 3"],
    "avg_salary": "₹6-15 LPA in India",
    "top_skills": ["Skill1", "Skill2", "Skill3"],
    "hiring_cities": ["Bangalore", "Pune", "Hyderabad", "Mumbai"],
    "growth_potential": "High",
    "market_demand": "Very High"
  }},
  "roadmap": {{
    "phases": [
      {{
        "phase_id": "phase-1",
        "phase_name": "Foundation",
        "phase_description": "Build fundamental knowledge and prerequisites",
        "duration": "2-3 months",
        "color": "#4285f4",
        "nodes": [
          {{
            "id": "node-1",
            "title": "Programming Basics",
            "description": "Learn fundamental programming concepts and syntax",
            "type": "required",
            "duration": "2-3 weeks",
            "difficulty": "beginner",
            "skills": ["Variables", "Functions", "Loops", "Data Types"],
            "prerequisites": [],
            "next_nodes": ["node-2"],
            "position": {{"x": 200, "y": 100}},
            "completion_criteria": ["Complete basic exercises", "Build simple programs"],
            "resources": [],
            "projects": []
          }}
        ]
      }},
      {{
        "phase_id": "phase-2", 
        "phase_name": "Core Skills",
        "phase_description": "Master essential technical skills",
        "duration": "3-4 months",
        "color": "#34a853",
        "nodes": []
      }},
      {{
        "phase_id": "phase-3",
        "phase_name": "Advanced Topics",
        "phase_description": "Deep dive into specialized areas",
        "duration": "2-3 months", 
        "color": "#fbbc04",
        "nodes": []
      }},
      {{
        "phase_id": "phase-4",
        "phase_name": "Portfolio & Career",
        "phase_description": "Build projects and prepare for jobs",
        "duration": "1-2 months",
        "color": "#ea4335", 
        "nodes": []
      }}
    ]
  }}
}}

REQUIREMENTS:
1. Create 15-20 nodes total across all phases
2. Each topic from {topics} should have 2-4 detailed subtopic nodes
3. Include foundational prerequisites (math, programming basics if needed)
4. Add milestone nodes for major achievements
5. Include final "Job Ready" success node in phase-4
6. Position nodes: phase-1 x=200, phase-2 x=450, phase-3 x=700, phase-4 x=950
7. Position nodes vertically 150 pixels apart within each phase (y=100, 250, 400, etc.)
8. Connect nodes logically with prerequisites and next_nodes arrays
9. Make descriptions detailed and actionable (2-3 sentences)
10. Use realistic durations and difficulty levels
11. Each node needs unique ID (node-1, node-2, etc.)
12. resources and projects arrays will be populated later

Generate the complete roadmap structure now."""
            )
            
            chain = prompt | self.llm | JsonOutputParser()
            structure = chain.invoke({
                "topics": json.dumps(topics),
                "original_query": original_query
            })
            
            # Validate structure
            if not isinstance(structure, dict) or "roadmap" not in structure:
                raise ValueError("Invalid roadmap structure generated")
            
            return structure
            
        except Exception as e:
            logger.error(f"Structure generation error: {e}")
            return self._get_fallback_structure(topics, original_query)
    
    def _get_fallback_structure(self, topics: List[str], query: str) -> Dict:
        """Fallback roadmap structure"""
        return {
            "metadata": {
                "title": f"Learning Path for {', '.join(topics)}",
                "description": "Comprehensive learning roadmap",
                "total_duration": "6-8 months",
                "difficulty": "beginner-to-intermediate",
                "created_for": query,
                "total_nodes": 8,
                "estimated_hours": 200
            },
            "career_insights": {
                "job_roles": ["Software Developer", "Technical Specialist"],
                "avg_salary": "₹6-12 LPA in India",
                "top_skills": topics[:3],
                "hiring_cities": ["Bangalore", "Pune", "Hyderabad"],
                "growth_potential": "High",
                "market_demand": "High"
            },
            "roadmap": {
                "phases": [
                    {
                        "phase_id": "phase-1",
                        "phase_name": "Foundation",
                        "phase_description": "Build fundamental knowledge",
                        "duration": "2 months",
                        "color": "#4285f4",
                        "nodes": [
                            {
                                "id": "node-1",
                                "title": "Basics",
                                "description": "Learn fundamental concepts",
                                "type": "required",
                                "duration": "3-4 weeks",
                                "difficulty": "beginner",
                                "skills": ["Fundamentals"],
                                "prerequisites": [],
                                "next_nodes": ["node-2"],
                                "position": {"x": 200, "y": 100},
                                "completion_criteria": ["Complete basics"],
                                "resources": [],
                                "projects": []
                            }
                        ]
                    }
                ]
            }
        }
    
    def _enrich_nodes(self, roadmap: Dict) -> Dict:
        """Enrich each node with resources and projects"""
        logger.info("Enriching nodes with resources and projects...")
        
        try:
            phases = roadmap.get("roadmap", {}).get("phases", [])
            total_nodes = 0
            
            for phase in phases:
                for node in phase.get("nodes", []):
                    total_nodes += 1
                    node_title = node.get("title", "")
                    node_skills = node.get("skills", [])
                    
                    # Skip if already has resources
                    if node.get("resources") and len(node["resources"]) > 0:
                        continue
                    
                    logger.info(f"Enriching node: {node_title}")
                    
                    # Search for resources
                    search_query = f"{node_title} {' '.join(node_skills[:2])}"
                    
                    # Get YouTube tutorials (async could be added here)
                    youtube_results = search_youtube_tutorials(search_query, max_results=2)
                    
                    # Get course resources  
                    course_results = search_google_courses(search_query, max_results=2)
                    
                    # Combine resources
                    all_resources = youtube_results + course_results
                    node["resources"] = all_resources[:4]  # Limit to 4 resources per node
                    
                    # Generate projects for milestone/advanced nodes
                    if (node.get("type") in ["milestone", "advanced"] or 
                        phase.get("phase_id") == "phase-4" or
                        "project" in node_title.lower()):
                        
                        difficulty = node.get("difficulty", "beginner")
                        projects = generate_project_ideas(node_title, difficulty)
                        node["projects"] = projects[:2]  # 2 projects per node
                    else:
                        node["projects"] = []
            
            # Update metadata
            if "metadata" in roadmap:
                roadmap["metadata"]["total_nodes"] = total_nodes
            
            logger.info(f"✅ Node enrichment complete - {total_nodes} nodes enriched")
            return roadmap
            
        except Exception as e:
            logger.error(f"Node enrichment error: {e}")
            return roadmap
    
    def _merge_roadmaps(self, existing: Dict, new: Dict, edit_query: str) -> Dict:
        """
        Intelligently merge existing roadmap with new changes
        """
        logger.info(f"Merging roadmaps for query: {edit_query}")
        
        try:
            # Detect if it's an addition or removal
            is_removal = any(word in edit_query.lower() for word in 
                           ["remove", "delete", "drop", "exclude", "don't want", "skip"])
            
            if is_removal:
                logger.info("Detected REMOVAL request")
                return self._remove_from_roadmap(existing, edit_query)
            else:
                logger.info("Detected ADDITION request")
                return self._add_to_roadmap(existing, new, edit_query)
                
        except Exception as e:
            logger.error(f"Roadmap merge error: {e}")
            return existing  # Return existing roadmap if merge fails
    
    def _add_to_roadmap(self, existing: Dict, new: Dict, query: str) -> Dict:
        """Add new nodes to existing roadmap"""
        logger.info("Adding new content to roadmap")
        
        try:
            import copy
            merged = copy.deepcopy(existing)
            
            # Get phases
            new_phases = new.get("roadmap", {}).get("phases", [])
            existing_phases = merged.get("roadmap", {}).get("phases", [])
            
            total_added = 0
            
            for new_phase in new_phases:
                # Find matching phase by name or create new phase
                matching_phase = next(
                    (p for p in existing_phases if p.get("phase_name") == new_phase.get("phase_name")),
                    None
                )
                
                if matching_phase:
                    # Get existing node info for comparison
                    existing_node_titles = {n["title"].lower().strip() for n in matching_phase.get("nodes", [])}
                    existing_node_ids = {n["id"] for n in matching_phase.get("nodes", [])}
                    
                    # Filter truly new nodes
                    new_nodes = []
                    for node in new_phase.get("nodes", []):
                        node_title_lower = node["title"].lower().strip()
                        
                        # Check if node is truly new
                        is_duplicate = (
                            node["id"] in existing_node_ids or
                            node_title_lower in existing_node_titles or
                            any(self._titles_similar(node_title_lower, existing_title) 
                                for existing_title in existing_node_titles)
                        )
                        
                        if not is_duplicate:
                            # Assign new unique ID
                            max_id = max([int(n["id"].split("-")[1]) for n in matching_phase["nodes"] 
                                        if n["id"].startswith("node-")], default=0)
                            node["id"] = f"node-{max_id + len(new_nodes) + 1}"
                            new_nodes.append(node)
                    
                    if new_nodes:
                        # Adjust positions to avoid overlap
                        if matching_phase.get("nodes"):
                            max_y = max(n.get("position", {}).get("y", 0) for n in matching_phase["nodes"])
                            for i, node in enumerate(new_nodes):
                                node["position"]["y"] = max_y + 150 + (i * 150)
                        
                        matching_phase["nodes"].extend(new_nodes)
                        total_added += len(new_nodes)
                        logger.info(f"✅ Added {len(new_nodes)} nodes to phase: {new_phase.get('phase_name')}")
                        
                        for node in new_nodes:
                            logger.info(f"   - {node['title']}")
                
                elif new_phase.get("nodes"):  # Add entirely new phase
                    merged["roadmap"]["phases"].append(new_phase)
                    total_added += len(new_phase.get("nodes", []))
                    logger.info(f"✅ Added new phase: {new_phase.get('phase_name')}")
            
            # Update metadata
            if total_added > 0 and "metadata" in merged:
                merged["metadata"]["total_nodes"] = merged["metadata"].get("total_nodes", 0) + total_added
            
            logger.info(f"Total nodes added: {total_added}")
            
            if total_added == 0:
                logger.warning("⚠️ No new nodes were added - topics may already exist")
            
            return merged
            
        except Exception as e:
            logger.error(f"Add to roadmap error: {e}")
            return existing
    
    def _titles_similar(self, title1: str, title2: str) -> bool:
        """Check if two titles are similar enough to be considered duplicates"""
        # Simple similarity check - could be enhanced with fuzzy matching
        words1 = set(title1.split())
        words2 = set(title2.split())
        
        if len(words1) == 0 or len(words2) == 0:
            return False
            
        overlap = len(words1.intersection(words2))
        min_length = min(len(words1), len(words2))
        
        return overlap / min_length > 0.6  # 60% word overlap threshold
    
    def _remove_from_roadmap(self, existing: Dict, query: str) -> Dict:
        """Remove topics/nodes from roadmap based on query"""
        logger.info(f"Removing content from roadmap for query: {query}")
        
        try:
            import copy
            merged = copy.deepcopy(existing)
            
            # Use LLM to identify what to remove
            prompt = ChatPromptTemplate.from_template(
                """User wants to remove content from their roadmap.

User request: {query}

Current roadmap nodes:
{node_list}

Analyze the request and identify which node titles/topics should be removed.
Return JSON with:
{{
  "remove_keywords": ["keyword1", "keyword2"],
  "reason": "brief explanation"
}}

Be specific with keywords. Include variations and related terms."""
            )
            
            # Get all nodes info
            nodes_info = []
            for phase in existing.get("roadmap", {}).get("phases", []):
                for node in phase.get("nodes", []):
                    nodes_info.append(f"{node['id']}: {node['title']}")
            
            chain = prompt | self.llm | JsonOutputParser()
            removal_info = chain.invoke({
                "query": query,
                "node_list": "\n".join(nodes_info)
            })
            
            keywords = [kw.lower() for kw in removal_info.get("remove_keywords", [])]
            logger.info(f"Removal keywords: {keywords}")
            
            # Remove nodes that match keywords
            total_removed = 0
            for phase in merged.get("roadmap", {}).get("phases", []):
                original_count = len(phase.get("nodes", []))
                
                # Keep nodes that DON'T match any keyword
                phase["nodes"] = [
                    node for node in phase.get("nodes", [])
                    if not any(keyword in node["title"].lower() or 
                             keyword in node.get("description", "").lower() or
                             keyword in " ".join(node.get("skills", [])).lower()
                             for keyword in keywords)
                ]
                
                removed_count = original_count - len(phase["nodes"])
                if removed_count > 0:
                    total_removed += removed_count
                    logger.info(f"✅ Removed {removed_count} nodes from phase: {phase['phase_name']}")
            
            # Update metadata
            if total_removed > 0 and "metadata" in merged:
                merged["metadata"]["total_nodes"] = merged["metadata"].get("total_nodes", 0) - total_removed
            
            logger.info(f"Total nodes removed: {total_removed}")
            
            if total_removed == 0:
                logger.warning("⚠️ No nodes were removed - topic may not exist")
            
            return merged
            
        except Exception as e:
            logger.error(f"Remove from roadmap error: {e}")
            return existing
    
    def _add_metadata(self, roadmap: Dict, query: str) -> Dict:
        """Add additional metadata to roadmap"""
        try:
            if "metadata" not in roadmap:
                roadmap["metadata"] = {}
            
            # Count total nodes if not set
            if "total_nodes" not in roadmap["metadata"]:
                total_nodes = 0
                for phase in roadmap.get("roadmap", {}).get("phases", []):
                    total_nodes += len(phase.get("nodes", []))
                roadmap["metadata"]["total_nodes"] = total_nodes
            
            # Add generation timestamp
            from datetime import datetime
            roadmap["metadata"]["generated_at"] = datetime.utcnow().isoformat()
            roadmap["metadata"]["version"] = "3.0"
            
            return roadmap
            
        except Exception as e:
            logger.error(f"Metadata addition error: {e}")
            return roadmap
    
    def _get_fallback_roadmap(self, query: str) -> Dict:
        """Complete fallback roadmap when everything fails"""
        return {
            "metadata": {
                "title": "Basic Learning Roadmap",
                "description": "A simple learning path to get started",
                "total_duration": "3-6 months",
                "difficulty": "beginner",
                "created_for": query,
                "total_nodes": 4,
                "estimated_hours": 120,
                "generated_at": "2025-10-10T23:49:00Z",
                "version": "3.0"
            },
            "career_insights": {
                "job_roles": ["Software Developer", "Technical Specialist"],
                "avg_salary": "₹4-8 LPA in India",
                "top_skills": ["Programming", "Problem Solving", "Technical Skills"],
                "hiring_cities": ["Bangalore", "Pune", "Mumbai", "Hyderabad"],
                "growth_potential": "High",
                "market_demand": "High"
            },
            "roadmap": {
                "phases": [
                    {
                        "phase_id": "phase-1",
                        "phase_name": "Getting Started",
                        "phase_description": "Build foundational knowledge",
                        "duration": "6-8 weeks",
                        "color": "#4285f4",
                        "nodes": [
                            {
                                "id": "node-1",
                                "title": "Fundamentals",
                                "description": "Learn the basic concepts and principles",
                                "type": "required",
                                "duration": "2-3 weeks",
                                "difficulty": "beginner",
                                "skills": ["Basic Concepts", "Terminology", "Best Practices"],
                                "prerequisites": [],
                                "next_nodes": ["node-2"],
                                "position": {"x": 200, "y": 100},
                                "completion_criteria": ["Understand basic concepts"],
                                "resources": [
                                    {
                                        "name": "Getting Started Tutorial",
                                        "url": "https://www.youtube.com/watch?v=example",
                                        "description": "Comprehensive beginner tutorial",
                                        "type": "video"
                                    }
                                ],
                                "projects": []
                            },
                            {
                                "id": "node-2", 
                                "title": "Practical Application",
                                "description": "Apply what you've learned in hands-on exercises",
                                "type": "required",
                                "duration": "3-4 weeks",
                                "difficulty": "beginner",
                                "skills": ["Hands-on Practice", "Problem Solving"],
                                "prerequisites": ["node-1"],
                                "next_nodes": ["node-3"],
                                "position": {"x": 200, "y": 250},
                                "completion_criteria": ["Complete practice exercises"],
                                "resources": [],
                                "projects": [
                                    {
                                        "name": "First Practice Project",
                                        "description": "Build a simple project to reinforce learning",
                                        "skills": ["Application", "Implementation"],
                                        "difficulty": "beginner",
                                        "duration": "1 week",
                                        "github_ready": True
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }

# ============================================================
# PUBLIC API
# ============================================================

def generate_roadmap(query: str, existing_roadmap: Optional[Dict] = None) -> Dict:
    """
    Main entry point for roadmap generation
    
    Args:
        query: User's learning goal or edit request
        existing_roadmap: Previous roadmap (for editing)
    
    Returns:
        Complete roadmap JSON
    """
    try:
        generator = RoadmapGenerator()
        return generator.generate_roadmap(query, existing_roadmap)
    except Exception as e:
        logger.error(f"Fatal error in generate_roadmap: {e}")
        # Return minimal fallback
        generator = RoadmapGenerator()
        return generator._get_fallback_roadmap(query)
