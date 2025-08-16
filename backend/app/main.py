from typing import List
from fastapi import FastAPI, HTTPException, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client, ClientOptions
from dotenv import load_dotenv
from .models.User import User, Bricks
import os

load_dotenv()

url = os.getenv("PROJ_URL")
anon_key = os.getenv("ANON_KEY")
supabase: Client = create_client(supabase_key=anon_key, supabase_url=url)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.get("/")
async def read_root():
    return {"Hello": "i am testing compose watch, HEYYYY"}

@app.get("/users", response_model=List[User])
def list_users(authorization: str = Header()):
    try:
        print("=== GET /users ENDPOINT CALLED ===")
        print(f"Authorization header: {authorization}")
        
        if not authorization or not authorization.startswith("Bearer "):
            print("❌ Authorization header missing or invalid")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing or invalid"
            )
            
        token = authorization.replace("Bearer ", "")
        print(f"Extracted token: {token[:50]}...")
        print(f"Supabase URL: {url}")
        print(f"Anon key: {anon_key[:50]}...")
        
        client = create_client(supabase_key=anon_key, supabase_url=url, options=ClientOptions(headers={"Authorization": f"Bearer {token}"}))
        print("✅ Supabase client created")
        
        response = client.from_("users").select("*").execute()
        print(f"Supabase response: {response}")
        print(f"Response data: {response.data}")
        print(f"Response count: {response.count}")
        
        return response.data
    
    except Exception as e:
        print(f"❌ An unexpected error occurred: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@app.post("/create-user")
async def create_new_user(request: Request, authorization: str = Header()):
    print("=== CREATE USER ENDPOINT CALLED ===")
    print(f"Request method: {request.method}")
    print(f"Request URL: {request.url}")
    print(f"Request headers: {dict(request.headers)}")
    
    service_role = os.getenv("SERVICE_ROLE")
    backend_secret = os.getenv("BACKEND_SECRET")
    token = authorization.replace("Bearer ", "")
    
    # print(token)
    # print(f"Expected secret: Bearer {backend_secret}")
    # print(f"Service role key: {service_role[:10]}..." if service_role else "MISSING")
    
    if not token:
        print("❌ Authorization failed")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    print("✅ Authorization successful")
    
    body = await request.json()
    print(f"Received user data: {body}")
    
    client = create_client(supabase_url=url, supabase_key=service_role)
    
    try:
        print("Attempting to insert user into Supabase...")
        result = client.table("users").insert({
            "cognito_id": body["id"],
            "username": body.get("email", "unknown").split('@')[0]  
        }).execute()
        print(f"✅ User created successfully: {result.data}")
        return {"status": "success", "user": result.data}
        
    except Exception as e:
        print(f"❌ Error creating user: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


@app.get("/users/{user_id}/bricks", response_model=List[Bricks])
def get_user_bricks(user_id: int):
    try:
        resp = supabase.from_("bricks").select("*").eq("user_id", user_id).execute()
        print(f"Raw Supabase response for user {user_id} bricks:", resp.data)
        
        if resp.data is None or len(resp.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No bricks found for user ID {user_id}"
            )
            
        return resp.data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )
    
