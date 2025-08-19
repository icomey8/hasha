from .auth.auth import create_cognito_auth_dependency 
from .auth.get_jwks import CognitoJWKSFetcher
from dotenv import load_dotenv
import os

load_dotenv()

jwks_fetch = CognitoJWKSFetcher(
    region=os.getenv("REGION"),
    pool_id=os.getenv("COGNITO_USER_POOL_ID")
)

auth_dependency = create_cognito_auth_dependency(
    jwks_fetcher=jwks_fetch,
    audience=os.getenv("COGNITO_APP_CLIENT_ID"),
    region=os.getenv("REGION"),
    user_pool_id=os.getenv("COGNITO_USER_POOL_ID")
)