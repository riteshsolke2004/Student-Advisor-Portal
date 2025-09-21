from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Query, Header
from typing import List, Optional
import json
import uuid
from datetime import datetime, timedelta
import logging

# **FIX: Import firebase_admin and firestore properly**
import firebase_admin
from firebase_admin import firestore

# Import database and models
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.firestore import firestore_db
from .manager import manager
from .models import *

router = APIRouter(prefix="/api/chat")
logger = logging.getLogger(__name__)

def get_db():
    """Get Firestore database instance"""
    return firestore_db.get_db()

def get_current_user_from_header(authorization: str = None):
    """Get current user from authorization header"""
    if not authorization:
        return None
    
    try:
        import jwt
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])
        email = payload.get("email")
        
        if email:
            db = get_db()
            users = db.collection("users").where("email", "==", email).where("is_active", "==", True).get()
            if users:
                user_data = users[0].to_dict()
                user_data['user_id'] = email
                user_data['_id'] = users[0].id
                return user_data
    except Exception as e:
        logger.error(f"Auth error: {e}")
    
    return None

# WebSocket endpoint
@router.websocket("/ws/{user_email}")
async def websocket_endpoint(websocket: WebSocket, user_email: str):
    """WebSocket endpoint for real-time chat"""
    username = user_email.split('@')[0] if '@' in user_email else user_email

    try:
        await manager.connect(websocket, user_email, username)
        logger.info(f"🔌 WebSocket connected: {user_email}")

        while True:
            try:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                await handle_websocket_message(user_email, message_data)
                
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON from {user_email}: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "data": {"message": "Invalid message format"}
                }))
            
    except WebSocketDisconnect:
        await manager.disconnect(user_email)
        logger.info(f"❌ WebSocket disconnected: {user_email}")
    except Exception as e:
        logger.error(f"WebSocket error for {user_email}: {e}")
        await manager.disconnect(user_email)

async def handle_websocket_message(user_id: str, message_data: dict):
    """Handle incoming WebSocket messages"""
    try:
        message_type = message_data.get("type")
        data = message_data.get("data", {})
        
        if message_type == "join_room":
            await handle_join_room(user_id, data)
        elif message_type == "leave_room":
            await handle_leave_room(user_id, data)
        elif message_type == "message":
            await handle_chat_message(user_id, data)
        elif message_type == "typing":
            await handle_typing_indicator(user_id, data)
        elif message_type == "ping":
            await manager._send_to_user(user_id, {
                "type": "pong",
                "data": {"timestamp": datetime.utcnow().isoformat()}
            })
        else:
            logger.warning(f"Unknown message type from {user_id}: {message_type}")
            
    except Exception as e:
        logger.error(f"Error handling message from {user_id}: {e}")

async def handle_join_room(user_id: str, data: dict):
    """Handle user joining a room"""
    room_id = data.get("room_id")
    if room_id:
        success = await manager.join_room(user_id, room_id)
        if success:
            await send_recent_messages(user_id, room_id)

async def handle_leave_room(user_id: str, data: dict):
    """Handle user leaving a room"""
    room_id = data.get("room_id")
    if room_id:
        await manager.leave_room(user_id, room_id)

async def handle_chat_message(user_id: str, data: dict):
    """Handle chat message and save to Firestore"""
    try:
        db = get_db()
        
        room_id = data.get("room_id")
        content = data.get("content", "").strip()
        
        if not room_id or not content:
            logger.error(f"Invalid message data from {user_id}")
            return
        
        # Check if user is in the room
        if room_id not in manager.get_user_rooms(user_id):
            logger.warning(f"User {user_id} not in room {room_id}")
            return
        
        # Create message document
        message = {
            "message_id": str(uuid.uuid4()),
            "room_id": room_id,
            "sender_id": user_id,
            "sender_name": data.get("sender_name", user_id.split('@')[0]),
            "content": content,
            "message_type": data.get("message_type", "text"),
            "timestamp": datetime.utcnow(),
            "is_edited": False,
            "is_deleted": False,
            "reply_to": data.get("reply_to"),
            "mentions": data.get("mentions", []),
            "attachments": data.get("attachments", []),
            "reactions": []
        }
        
        # Save to Firestore
        doc_ref = db.collection("messages").document()
        doc_ref.set(message)
        message["_id"] = doc_ref.id
        
        # Update room's last activity
        rooms = db.collection("chat_rooms").where("room_id", "==", room_id).get()
        if rooms:
            room_doc = rooms[0]
            room_doc.reference.update({
                "last_activity": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # Broadcast to room members
        await manager.broadcast_to_room(room_id, {
            "type": "message",
            "data": message
        })
        
        logger.info(f"💬 Message saved: {user_id} -> {room_id}")
        
    except Exception as e:
        logger.error(f"Error handling chat message: {e}")

async def handle_typing_indicator(user_id: str, data: dict):
    """Handle typing indicator"""
    room_id = data.get("room_id")
    is_typing = data.get("is_typing", False)
    
    if room_id:
        await manager.handle_typing(user_id, room_id, is_typing)

async def send_recent_messages(user_id: str, room_id: str, limit: int = 50):
    """Send recent messages to user when they join a room"""
    try:
        db = get_db()
        
        # **FIX: Use proper query syntax without deprecated positional arguments**
        query = (db.collection("messages")
                .where(filter=firestore.FieldFilter("room_id", "==", room_id))
                .where(filter=firestore.FieldFilter("is_deleted", "==", False))
                .order_by("timestamp", direction=firestore.Query.DESCENDING)
                .limit(limit))
        
        messages = query.get()
        
        message_list = []
        for msg in messages:
            msg_data = msg.to_dict()
            msg_data["_id"] = msg.id
            msg_data["timestamp"] = msg_data["timestamp"].isoformat()
            message_list.append(msg_data)
        
        # Send in chronological order (oldest first)
        message_list.reverse()
        
        await manager._send_to_user(user_id, {
            "type": "recent_messages",
            "data": {
                "room_id": room_id,
                "messages": message_list
            }
        })
        
        logger.info(f"📬 Sent {len(message_list)} recent messages to {user_id} for room {room_id}")
        
    except Exception as e:
        logger.error(f"Error sending recent messages: {e}")

# REST API Endpoints
@router.get("/rooms")
async def get_rooms(
    room_type: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None)
):
    """Get all active chat rooms"""
    try:
        db = get_db()
        
        # **FIX: Use proper filter syntax**
        query = db.collection("chat_rooms").where(filter=firestore.FieldFilter("is_active", "==", True))
        
        # Add room type filter
        if room_type:
            query = query.where(filter=firestore.FieldFilter("room_type", "==", room_type))
        
        # Get rooms
        rooms = query.limit(limit).get()
        
        result = []
        for room in rooms:
            room_data = room.to_dict()
            room_data["_id"] = room.id
            
            # Apply search filter if provided
            if search:
                search_lower = search.lower()
                if (search_lower not in room_data.get("name", "").lower() and 
                    search_lower not in room_data.get("description", "").lower()):
                    continue
            
            # Add computed fields
            room_data["member_count"] = len(room_data.get("members", []))
            room_data["online_members"] = len([
                user_id for user_id in room_data.get("members", [])
                if manager.is_user_online(user_id)
            ])
            
            # Convert datetime fields to ISO strings
            for field in ["created_at", "updated_at", "last_activity"]:
                if isinstance(room_data.get(field), datetime):
                    room_data[field] = room_data[field].isoformat()
            
            result.append(room_data)
        
        # Sort by last activity (most recent first)
        result.sort(key=lambda x: x.get("last_activity", ""), reverse=True)
        
        logger.info(f"📁 Returning {len(result)} rooms")
        return result
        
    except Exception as e:
        logger.error(f"Error fetching rooms: {e}")
        return []

@router.post("/rooms")
async def create_room(room_data: RoomCreateRequest):
    """Create a new chat room"""
    try:
        db = get_db()
        
        # Check if room name already exists
        existing_rooms = (db.collection("chat_rooms")
                         .where(filter=firestore.FieldFilter("name", "==", room_data.name))
                         .where(filter=firestore.FieldFilter("is_active", "==", True))
                         .get())
        
        if existing_rooms:
            raise HTTPException(
                status_code=400,
                detail="A room with this name already exists"
            )
        
        # Create room document
        room = {
            "room_id": str(uuid.uuid4()),
            "name": room_data.name,
            "description": room_data.description,
            "room_type": room_data.room_type,
            "is_public": room_data.is_public,
            "members": [],
            "moderators": [],
            "created_by": "user",  # You can get this from authentication
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "is_active": True,
            "max_members": room_data.max_members,
            "settings": room_data.settings.dict() if room_data.settings else {
                "allow_file_upload": True,
                "allow_reactions": True,
                "moderated": False
            },
            "tags": room_data.tags
        }
        
        # Save to Firestore
        doc_ref = db.collection("chat_rooms").document()
        doc_ref.set(room)
        room["_id"] = doc_ref.id
        
        logger.info(f"✅ Room created: {room_data.name}")
        
        return APIResponse(
            success=True,
            message="Room created successfully",
            data={"room": room}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating room: {e}")
        raise HTTPException(status_code=500, detail="Failed to create room")

@router.get("/rooms/{room_id}/messages")
async def get_room_messages(
    room_id: str,
    limit: int = Query(50, ge=1, le=100),
    before: Optional[str] = Query(None)
):
    """Get messages for a specific room"""
    try:
        db = get_db()
        
        # Verify room exists
        rooms = (db.collection("chat_rooms")
                .where(filter=firestore.FieldFilter("room_id", "==", room_id))
                .where(filter=firestore.FieldFilter("is_active", "==", True))
                .get())
        
        if not rooms:
            raise HTTPException(status_code=404, detail="Room not found")
        
        # **FIX: Build query with proper filter syntax**
        query = (db.collection("messages")
                .where(filter=firestore.FieldFilter("room_id", "==", room_id))
                .where(filter=firestore.FieldFilter("is_deleted", "==", False)))
        
        if before:
            # For pagination: get messages before a specific timestamp
            try:
                before_message = db.collection("messages").document(before).get()
                if before_message.exists:
                    before_timestamp = before_message.to_dict().get("timestamp")
                    if before_timestamp:
                        query = query.where(filter=firestore.FieldFilter("timestamp", "<", before_timestamp))
            except Exception as e:
                logger.warning(f"Invalid before parameter: {e}")
        
        # Get messages
        messages = (query.order_by("timestamp", direction=firestore.Query.DESCENDING)
                   .limit(limit)
                   .get())
        
        result = []
        for message in messages:
            msg_data = message.to_dict()
            msg_data["_id"] = message.id
            
            # Convert datetime to string
            if isinstance(msg_data.get("timestamp"), datetime):
                msg_data["timestamp"] = msg_data["timestamp"].isoformat()
            
            result.append(msg_data)
        
        # Return in chronological order (oldest first)
        result.reverse()
        
        logger.info(f"📬 Returning {len(result)} messages for room {room_id}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")

@router.get("/online-users")
async def get_online_users():
    """Get list of currently online users"""
    online_users = manager.get_online_users()
    return {
        "online_users": online_users,
        "total_count": len(online_users)
    }

@router.get("/connection-stats")
async def get_connection_stats():
    """Get detailed WebSocket connection statistics"""
    return manager.get_connection_stats()

@router.get("/health")
async def chat_health_check():
    """Chat service health check"""
    try:
        db_healthy = firestore_db.health_check()
        
        return {
            "service": "chat",
            "status": "healthy" if db_healthy else "unhealthy",
            "database": "connected" if db_healthy else "disconnected",
            "websocket_connections": len(manager.get_online_users()),
            "active_rooms": len([r for r in manager.room_members.items() if r[1]]),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "service": "chat",
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
