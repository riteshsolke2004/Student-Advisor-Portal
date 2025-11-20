from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.responses import JSONResponse
import logging
from typing import Optional

from models.profile import UserProfile, ProfileResponse, UpdateProfileRequest
from ..profile_service import profile_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/profile", tags=["profile"])

# Simple user_id parameter
async def get_current_user_id(user_id: str) -> str:
    """Placeholder for user authentication"""
    if not user_id or len(user_id.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID is required"
        )
    return user_id.strip()

@router.post("/", response_model=ProfileResponse)
async def create_profile(
    user_id: str,
    personalInfo: dict = Body(...),
    careerInfo: dict = Body(...),
    academicBackground: dict = Body(default=None)
):
    """Create a new user profile"""
    try:
        logger.info(f"Creating profile for user: {user_id}")
        logger.info(f"Personal Info: {personalInfo}")
        logger.info(f"Career Info: {careerInfo}")
        logger.info(f"Academic Background: {academicBackground}")
        
        # Construct UserProfile from request data
        profile_data = UserProfile(
            personalInfo=personalInfo,
            careerInfo=careerInfo,
            academicBackground=academicBackground
        )
        
        profile_response = await profile_service.create_profile(
            user_id,
            profile_data
        )
        
        logger.info(f"✅ Profile created successfully for {user_id}")
        return profile_response
        
    except Exception as e:
        logger.error(f"❌ Error creating profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create profile: {str(e)}")

@router.get("/{user_id}", response_model=ProfileResponse)
async def get_profile(
    user_id: str = Depends(get_current_user_id)
):
    """Get user profile by user ID"""
    try:
        profile_response = await profile_service.get_profile(user_id)
        
        if not profile_response:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        logger.info(f"Profile retrieved successfully for user {user_id}")
        return profile_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile"
        )

@router.put("/{user_id}", response_model=ProfileResponse)
async def update_profile(
    request: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Update user profile"""
    try:
        profile_response = await profile_service.update_profile(
            user_id, 
            request.profile
        )
        
        logger.info(f"Profile updated successfully for user {user_id}")
        return profile_response
        
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

@router.delete("/{user_id}")
async def delete_profile(
    user_id: str = Depends(get_current_user_id)
):
    """Delete user profile"""
    try:
        success = await profile_service.delete_profile(user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        logger.info(f"Profile deleted successfully for user {user_id}")
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Profile deleted successfully"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete profile"
        )

@router.get("/{user_id}/exists")
async def check_profile_exists(
    user_id: str = Depends(get_current_user_id)
):
    """Check if user profile exists"""
    try:
        exists = await profile_service.profile_exists(user_id)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"exists": exists, "user_id": user_id}
        )
        
    except Exception as e:
        logger.error(f"Error checking profile existence: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check profile existence"
        )
