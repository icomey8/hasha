import requests
import json
from loguru import logger
import copy
import os

# Create an independent logger for JWKS operations
jwks_logger = copy.deepcopy(logger)
jwks_log_path = os.path.join(os.path.dirname(__file__), "jwks.log")

# Add handler to the independent logger
jwks_logger.add(jwks_log_path, rotation="1 day", retention="1 day", colorize=False, format="{time} | {level} | {message}")

class CognitoJWKSFetcher:
    def __init__(self, region: str, pool_id: str):
        self.region = region
        self.pool_id = pool_id
        self.jwks_url = f"https://cognito-idp.{region}.amazonaws.com/{pool_id}/.well-known/jwks.json"
    
        
    def get_jwks(self):
        try:
            response = requests.get(self.jwks_url, timeout=10)
            response.raise_for_status()
            jwks_data = response.json()
            
            if 'keys' not in jwks_data:
                raise ValueError("Invalid JWKS format: missing 'keys' field")
            
            jwks_logger.info(f"Successfully fetched JWKS with {len(jwks_data['keys'])} keys")
            return jwks_data
            
        except requests.RequestException as e:
            jwks_logger.error(f"Failed to fetch JWKS: {e}")
            raise
        except json.JSONDecodeError as e:
            jwks_logger.error(f"Invalid JSON in JWKS response: {e}")
            raise
        except Exception as e:
            jwks_logger.error(f"Unexpected error fetching JWKS: {e}")
            raise
    
    def get_key_by_kid(self, kid: str):
        """
        Get a specific key from JWKS by its key ID (kid).
        
        Args:
            kid: The key ID to search for
            
        Returns:
            The JWK dictionary if found, None otherwise
        """
        try:
            jwks = self.get_jwks()
            for key in jwks['keys']:
                if key.get('kid') == kid:
                    jwks_logger.debug(f"Found key with kid: {kid}")
                    return key
            
            jwks_logger.warning(f"Key with kid '{kid}' not found in JWKS")
            return None
            
        except Exception as e:
            jwks_logger.error(f"Error getting key by kid: {e}")
            return None


