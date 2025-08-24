from fastapi import APIRouter, Header, HTTPException, status, Request, Depends
from typing import List
from supabase import create_client, ClientOptions
from ..models.User import User
from ..dependencies import auth_dependency
from ..auth.auth import extract_token
from dotenv import load_dotenv
from loguru import logger
import os, sys

router = APIRouter(
    prefix="/users"
)

load_dotenv()
url = os.getenv("PROJ_URL")
anon_key = os.getenv("ANON_KEY")

@router.get("/", response_model=List[User])
def list_users(user = Depends(auth_dependency), token = Depends(extract_token)):
    try:
        logger.info("=== GET /users ENDPOINT CALLED ===")

        client = create_client(supabase_key=anon_key, supabase_url=url, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
        logger.info("✅ Supabase client created")
        
        response = client.from_("users").select("*").execute()
        logger.info(f"Response data: {response.data}")
        
        return response.data
    
    except Exception as e:
        logger.error(f"❌ {type(e)}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
        
@router.post("/create-user")
async def create_new_user(request: Request, token = Depends(extract_token)):
    logger.info("=== CREATE USER ENDPOINT CALLED ===")
    
    service_role = os.getenv("SERVICE_ROLE")
    backend_secret = os.getenv("BACKEND_SECRET")
    
    if not token or token != backend_secret: 
        logger.error("❌ Authorization failed")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    logger.info("✅ Authorization successful")
    
    body = await request.json()
    client = create_client(supabase_url=url, supabase_key=service_role)
    
    try:
        logger.info("Attempting to insert user into Supabase...")
        result = client.table("users").insert({
            "cognito_id": body["id"],
            "username": body.get("email", "unknown").split('@')[0]  
        }).execute()
        logger.info(f"✅ User created successfully: {result.data}")
        return {"status": "success", "user": result.data}
        
    except Exception as e:
        logger.error(f"❌ Error creating user: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")