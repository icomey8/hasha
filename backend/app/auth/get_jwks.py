import requests
import json
import os
from typing import Dict, Any, Optional
from loguru import logger

class CognitoJWKSFetcher:
    def __init__(self, region: str, pool_id: str):
        self.region = region
        self.pool_id = pool_id
        self.jwks_url = f"https://cognito-idp.{region}.amazonaws.com/{pool_id}/.well-known/jwks.json"
    
    def fetch_jwks(self) -> Dict[str, Any]:
        try:
            response = requests.get(self.jwks_url, timeout=10)
            response.raise_for_status()
            
            jwks_data = response.json()
            
            if 'keys' not in jwks_data:
                raise ValueError("Invalid JWKS format: missing 'keys' field")
            
            logger.info(f"Successfully fetched JWKS with {len(jwks_data['keys'])} keys")
            return jwks_data
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch JWKS: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in JWKS response: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error fetching JWKS: {e}")
            raise
    
    def get_key_by_kid(self, kid: str) -> Optional[Dict[str, Any]]:
        try:
            jwks = self.fetch_jwks()
            
            for key in jwks['keys']:
                if key.get('kid') == kid:
                    logger.debug(f"Found key with kid: {kid}")
                    return key
            
            logger.warning(f"Key with kid '{kid}' not found in JWKS")
            return None
            
        except Exception as e:
            logger.error(f"Error getting key by kid: {e}")
            return None
