from typing import List
from fastapi import FastAPI, HTTPException, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from dotenv import load_dotenv
from .models.models import User, Recipe
from .routers import users, recipes
from . import logging_config 
import os

load_dotenv()

url = os.getenv("PROJ_URL")
anon_key = os.getenv("ANON_KEY")
supabase: Client = create_client(supabase_key=anon_key, supabase_url=url)

app = FastAPI()
app.include_router(users.router)
app.include_router(recipes.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/")
async def read_root():
    return {"Hello": "there"}


# @app.get("/users/{user_id}/bricks", response_model=List[Bricks])
# def get_user_bricks(user_id: int):
#     try:
#         resp = supabase.from_("bricks").select("*").eq("user_id", user_id).execute()
#         print(f"Raw Supabase response for user {user_id} bricks:", resp.data)
        
#         if resp.data is None or len(resp.data) == 0:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"No bricks found for user ID {user_id}"
#             )
            
#         return resp.data
        
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"An unexpected error occurred: {str(e)}"
#         )
    
