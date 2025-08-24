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
    prefix="/recipes"
)

load_dotenv()
url = os.getenv("PROJ_URL")
anon_key = os.getenv("ANON_KEY")

@router.post("/create-recipe")
async def create_recipe(request: Request, user = Depends(auth_dependency), token = Depends(extract_token)):
    logger.info("=== POST /create-recipe endpoint called ===")
    
    body = await request.json()
    # client = create_client(supabase_key=anon_key, supabase_url=url, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
    #logger.info("✅ Supabase client created")
    
    try: 
        # result = client.table("recipes").insert({
        #         "user_id": body["id"],
        #         "name": body["recipe_name"],
        #         "preparation": body["preparation"],
        #         "ingredients": body["ingredients"],
        #         "metadata": {
        #             "total_time": body["totalTime"],
        #             "type": body["type"],  # Changed from "entree" to "type"
        #             "cuisine": body["cuisine"]
        #         }
        #     }
        #     ).execute()
        
        # logger.info(f"✅ User created successfully: {result.data}")
        logger.info(f"✅ Data received successfully: {body}")
        return {"status": "success", "recipe": body}
        
    except Exception as e:
        logger.error(f"❌ Error saving the recipe: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create recipe in database: {str(e)}")