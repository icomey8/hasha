from fastapi import APIRouter, Header, HTTPException, status, Request, Depends
from typing import List
from supabase import create_client, ClientOptions
from ..models.User import User
from ..dependencies import auth_dependency
from ..auth.auth import extract_token
from dotenv import load_dotenv
from loguru import logger
import os, sys
import copy

router = APIRouter(
    prefix="/users"
)

# Create an independent logger for users using deepcopy
users_logger = copy.deepcopy(logger)
log_path = os.path.join(os.path.dirname(__file__), "users.log")

# Add handler to the independent logger
users_logger.add(log_path, rotation="1 day", retention="1 day", colorize=False, format="{time} | {level} | {message}")

load_dotenv()
url = os.getenv("PROJ_URL")
anon_key = os.getenv("ANON_KEY")

@router.get("/", response_model=List[User])
def list_users(user = Depends(auth_dependency), token = Depends(extract_token)):
    try:
        users_logger.info("=== GET /users ENDPOINT CALLED ===")

        client = create_client(supabase_key=anon_key, supabase_url=url, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
        users_logger.info("✅ Supabase client created")
        
        response = client.from_("users").select("*").execute()
        users_logger.info(f"Response data: {response.data}")
        
        return response.data
    
    except Exception as e:
        users_logger.error(f"❌ {type(e)}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
        
@router.post("/create-user")
async def create_new_user(request: Request, token = Depends(extract_token)):
    users_logger.info("=== CREATE USER ENDPOINT CALLED ===")
    
    service_role = os.getenv("SERVICE_ROLE")
    backend_secret = os.getenv("BACKEND_SECRET")
    
    if not token or token != backend_secret: 
        users_logger.error("❌ Authorization failed")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    users_logger.info("✅ Authorization successful")
    
    body = await request.json()
    client = create_client(supabase_url=url, supabase_key=service_role)
    
    try:
        users_logger.info("Attempting to insert user into Supabase...")
        result = client.table("users").insert({
            "cognito_id": body["id"],
            "username": body.get("email", "unknown").split('@')[0]  
        }).execute()
        users_logger.info(f"✅ User created successfully: {result.data}")
        return {"status": "success", "user": result.data}
        
    except Exception as e:
        users_logger.error(f"❌ Error creating user: {str(e)}")
        users_logger.error(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")