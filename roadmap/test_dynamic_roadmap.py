import requests
import json
import time

BASE_URL = "http://localhost:8080"
SESSION_ID = f"test-{int(time.time())}"

def test_chat(query, reset=False):
    response = requests.post(f"{BASE_URL}/chat", json={
        "session_id": SESSION_ID,
        "query": query,
        "reset": reset
    })
    
    data = response.json()
    print(f"\n{'='*70}")
    print(f"Query: {query}")
    print(f"Status: {data['status']}")
    print(f"Message: {data['message']}")
    
    if data.get('roadmap'):
        roadmap = data['roadmap']
        phases = roadmap.get('roadmap', {}).get('phases', [])
        total_nodes = sum(len(phase.get('nodes', [])) for phase in phases)
        
        print(f"\n📊 Roadmap Stats:")
        print(f"  - Title: {roadmap.get('metadata', {}).get('title')}")
        print(f"  - Total Phases: {len(phases)}")
        print(f"  - Total Nodes: {total_nodes}")
        
        print(f"\n📋 Detailed Node List:")
        for phase in phases:
            nodes = phase.get('nodes', [])
            print(f"\n  {phase['phase_name']} ({len(nodes)} nodes):")
            for i, node in enumerate(nodes, 1):
                skills = ', '.join(node.get('skills', [])[:3])
                print(f"    {i}. {node['title']}")
                print(f"       Skills: {skills}")
                print(f"       Type: {node.get('type')}, Difficulty: {node.get('difficulty')}")
    
    return data

# Test Sequence
print("🚀 Starting Dynamic Roadmap Tests...")
print(f"📝 Session ID: {SESSION_ID}\n")

# Test 1: Initial roadmap - Simple query
print("\n" + "="*70)
print("TEST 1: Generate Initial Roadmap")
print("="*70)
result1 = test_chat("I want to learn web development", reset=True)
time.sleep(3)

# Test 2: Add a VERY DIFFERENT topic
print("\n" + "="*70)
print("TEST 2: Add Completely New Topic (Blockchain)")
print("="*70)
result2 = test_chat("add blockchain and smart contracts to my roadmap")
time.sleep(3)

# Test 3: Add another distinct topic
print("\n" + "="*70)
print("TEST 3: Add Another New Topic (Mobile Development)")
print("="*70)
result3 = test_chat("also add iOS development with Swift")
time.sleep(3)

# Test 4: Remove something we just added
print("\n" + "="*70)
print("TEST 4: Remove Recently Added Topic")
print("="*70)
result4 = test_chat("remove blockchain from my roadmap")
time.sleep(2)

# Final check
print("\n" + "="*70)
print("FINAL SESSION CHECK")
print("="*70)
session = requests.get(f"{BASE_URL}/session/{SESSION_ID}").json()
print(json.dumps(session, indent=2))

print("\n" + "="*70)
print("✅ All tests completed!")
print("="*70)