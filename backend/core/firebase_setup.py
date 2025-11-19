# backend/core/firebase_setup.py
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
import logging
import os

logger = logging.getLogger(__name__)

# Global variables
firebase_app = None
firebase_db = None
firebase_bucket = None

def initialize_firebase():
    """Initialize Firebase Admin SDK with Firestore and Storage"""
    global firebase_app, firebase_db, firebase_bucket
    
    try:
        # Check if already initialized
        if firebase_admin._apps:
            logger.info("✅ Firebase already initialized")
            firebase_app = firebase_admin.get_app()
            firebase_db = firestore.client()
            firebase_bucket = storage.bucket()
            return firebase_app
        
        # Initialize Firebase
        cred = credentials.Certificate('serviceAccountKey.json')
        
        # ✅ OPTION 1: Use .appspot.com format (most common)
        firebase_app = firebase_admin.initialize_app(cred, {
            'storageBucket': 'ai-advisor-86f45.appspot.com'  # Changed from .firebasestorage.app
        })
        
        # ✅ OPTION 2: Or let Firebase auto-detect (recommended)
        # firebase_app = firebase_admin.initialize_app(cred)
        
        # Initialize Firestore client
        firebase_db = firestore.client()
        
        # Initialize Storage bucket
        firebase_bucket = storage.bucket()
        
        logger.info("✅ Firebase initialized successfully")
        logger.info(f"✅ Firestore database ready")
        logger.info(f"✅ Storage bucket: {firebase_bucket.name}")
        
        return firebase_app
    
    except FileNotFoundError:
        logger.error("❌ Firebase initialization failed: serviceAccountKey.json not found")
        raise
    except Exception as e:
        logger.error(f"❌ Firebase initialization failed: {e}")
        raise

def get_firebase_db():
    """Get Firestore database client"""
    global firebase_db
    
    if firebase_db is None:
        initialize_firebase()
    
    return firebase_db

def get_firebase_auth():
    """Get Firebase Auth client"""
    return auth

def get_firebase_storage():
    """Get Firebase Storage bucket"""
    global firebase_bucket
    
    if firebase_bucket is None:
        initialize_firebase()
    
    return firebase_bucket

def verify_firebase_token(id_token: str):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"❌ Token verification failed: {e}")
        raise ValueError(f"Invalid token: {e}")
