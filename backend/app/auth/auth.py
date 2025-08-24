from fastapi import HTTPException, status, Header, Depends
from typing import Optional, Callable, Dict, Any
from loguru import logger
import os
from .validate_token import validate_jwt, CognitoTokenValidationError

# Create a bound logger for auth
auth_logger = logger.bind(module="auth")
auth_log_path = os.path.join(os.path.dirname(__file__), "auth.log")

# Add handler with filter for auth module
logger.add(auth_log_path, rotation="1 day", retention="1 day", colorize=False, 
           format="{time} | {level} | {message}", 
           filter=lambda record: record["extra"].get("module") == "auth")


def extract_token(authorization: str = Header()) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        auth_logger.error("❌ Authorization header missing or invalid")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid")
            
    token = authorization.replace("Bearer ", "")
    
    return token

def create_cognito_auth_dependency(
    jwks_fetcher,
    audience: str,
    region: str,
    user_pool_id: str
) -> Callable:
    """
    Function to create a configured Cognito authentication dependency.
    
    Args:
        jwks_fetcher: Instance of CognitoJWKSFetcher
        audience: Cognito App Client ID
        region: AWS region
        user_pool_id: Cognito User Pool ID
        
    Returns:
        FastAPI dependency function that validates tokens and returns user info
    """
    
    def cognito_auth_dependency(token: str = Depends(extract_token)) -> Dict[str, Any]:
        """
        Validate Cognito JWT token and return user information.
        
        Args:
            token: JWT token from Authorization header
            
        Returns:
            Dict containing decoded token payload with user claims
            
        Raises:
            HTTPException: If token validation fails
        """
        try:
            decoded_token = validate_jwt(
                token=token,
                jwks_fetcher=jwks_fetcher,
                audience=audience,
                region=region,
                user_pool_id=user_pool_id
            )
            
            auth_logger.info(f"Authentication successful for user: {decoded_token.get('sub')}")
            return decoded_token
            
        except CognitoTokenValidationError as e:
            auth_logger.warning(f"Token validation failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication failed: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            auth_logger.error(f"Unexpected authentication error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    return cognito_auth_dependency