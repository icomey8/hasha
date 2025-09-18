from fastapi import APIRouter, HTTPException, status, Request, Depends
from supabase import create_client, ClientOptions
from ..dependencies import auth_dependency
from ..auth.auth import extract_token
from dotenv import load_dotenv
from loguru import logger
import os

router = APIRouter(
    prefix="/recipes"
)

load_dotenv()
url = os.getenv("PROJ_URL")
anon_key = os.getenv("ANON_KEY")


@router.get("/")
async def get_user_recipes(user=Depends(auth_dependency), token=Depends(extract_token)):
    logger.info("=== GET /recipes endpoint called ===")
    
    try:
        user_id = user.get("sub")
        if not user_id:
            logger.error("❌ No user_id found in token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user token"
            )
        
        logger.info(f"user sub is found as {user_id}")
        client = create_client(
            supabase_key=anon_key, 
            supabase_url=url, 
            options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
        )
        logger.info("✅ Supabase client created")
        
        response = client.from_("recipes").select("*").execute()
        
        if response.data is None:
            logger.info(f"No recipes found for user {user_id}")
            return []
            
        logger.info(f"✅ Found {len(response.data)} recipes for user {user_id}")
        return response.data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching recipes: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipes: {str(e)}"
        )
        

@router.post("/create-recipe")
async def create_recipe(request: Request, user = Depends(auth_dependency), token = Depends(extract_token)):
    logger.info("=== POST /create-recipe endpoint called ===")
    
    body = await request.json()    
    user_id = user.get("sub")
    if not user_id:
        logger.error("❌ No user_id found in token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )
    
    
    try: 
        client = create_client(supabase_key=anon_key, supabase_url=url, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
        logger.info("✅ Supabase client created")
        
        recipe_data = {
            "name": body["name"],
            "preparation": body["preparation"],
            "ingredients": body["ingredients"],
            "user_id": user_id,
            "metadata": {
                "total_time": body["totalTime"],
                "type": body["type"], 
                "cuisine": body["cuisine"]
            }
        }
        
        client.table("recipes").insert(recipe_data).execute()
        logger.info(f"✅ Recipe created successfully")
        logger.info(f"✅ Data received successfully")
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"❌ Error saving the recipe: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create recipe in database: {str(e)}")
    
@router.delete("/delete-recipe")
async def delete_recipe(request: Request, user = Depends(auth_dependency), token = Depends(extract_token)):
    logger.info("=== POST /create-recipe endpoint called ===")
    
    body = await request.json()    
    user_id = user.get("sub")
    if not user_id:
        logger.error("❌ No user_id found in token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token"
        )
        
    try: 
        client = create_client(supabase_key=anon_key, supabase_url=url, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
        logger.info("✅ Supabase client created")
        response = client.table("recipes").delete().eq("id", body["id"]).execute()
        logger.info(f"✅ Recipe deleted successfully")
        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"❌ Error deleting the recipe: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete recipe in database: {str(e)}")