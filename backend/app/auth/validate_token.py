import jwt
from typing import Dict, Any
import base64
from loguru import logger
import copy
import os

# Create a bound logger for token validation
token_logger = logger.bind(module="token_validation")
token_log_path = os.path.join(os.path.dirname(__file__), "token_validation.log")

# Add handler with filter for token validation module
logger.add(token_log_path, rotation="1 day", retention="1 day", colorize=False, 
           format="{time} | {level} | {message}", 
           filter=lambda record: record["extra"].get("module") == "token_validation")

class CognitoTokenValidationError(Exception):
    pass

def validate_jwt(token, jwks_fetcher, audience, region, user_pool_id):
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        
        if not kid:
            raise CognitoTokenValidationError("Token missing 'kid' in header")
        
        token_logger.debug(f"Token kid: {kid}")
        
        jwk = jwks_fetcher.get_key_by_kid(kid)
        if not jwk:
            raise CognitoTokenValidationError(f"Public key not found for kid: {kid}")
        
        public_key = _jwk_to_public_key(jwk)
        
        expected_issuer = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}"
        
        decoded_token = jwt.decode(
            token,
            public_key,
            algorithms=['RS256'],  # Cognito uses RS256
            audience=audience,
            issuer=expected_issuer,
            options={
                'verify_signature': True,
                'verify_exp': True,
                'verify_aud': True,
                'verify_iss': True,
            }
        )
        
        token_use = decoded_token.get('token_use')
        if token_use != 'id':
            raise CognitoTokenValidationError(
                f"Invalid token_use: expected 'id', got '{token_use}'"
            )
        
        token_logger.info(f"Successfully validated token for user: {decoded_token.get('sub')}")
        return decoded_token
        
    except jwt.ExpiredSignatureError:
        raise CognitoTokenValidationError("Token has expired")
    except jwt.InvalidAudienceError:
        raise CognitoTokenValidationError(f"Invalid audience: expected {audience}")
    except jwt.InvalidIssuerError:
        raise CognitoTokenValidationError(f"Invalid issuer: expected {expected_issuer}")
    except jwt.InvalidSignatureError:
        raise CognitoTokenValidationError("Invalid token signature")
    except jwt.InvalidTokenError as e:
        raise CognitoTokenValidationError(f"Invalid token: {str(e)}")
    except Exception as e:
        token_logger.error(f"Unexpected error validating token: {e}")
        raise CognitoTokenValidationError(f"Token validation failed: {str(e)}")


def _jwk_to_public_key(jwk: Dict[str, Any]):
    """
    Convert a JSON Web Key (JWK) to a cryptographic public key.
    
    Args:
        jwk: The JWK dictionary from JWKS
        
    Returns:
        RSAPublicKey or EllipticCurvePublicKey instance
        
    Raises:
        CognitoTokenValidationError: If JWK conversion fails
    """
    try:
        kty = jwk.get('kty')
        
        if kty == 'RSA':
            n = jwk.get('n')
            e = jwk.get('e')
            
            if not n or not e:
                raise CognitoTokenValidationError("Invalid RSA JWK: missing 'n' or 'e'")
            
            n_bytes = _base64url_decode(n)
            e_bytes = _base64url_decode(e)
            
            n_int = int.from_bytes(n_bytes, 'big')
            e_int = int.from_bytes(e_bytes, 'big')
            
            from cryptography.hazmat.primitives.asymmetric import rsa
            public_key = rsa.RSAPublicNumbers(e_int, n_int).public_key()
            return public_key
            
        else:
            raise CognitoTokenValidationError(f"Unsupported key type: {kty}")
            
    except Exception as e:
        token_logger.error(f"Failed to convert JWK to public key: {e}")
        raise CognitoTokenValidationError(f"JWK conversion failed: {str(e)}")


def _base64url_decode(data: str) -> bytes:
    """
    Decode base64url-encoded data (used in JWTs).
    
    Args:
        data: Base64url-encoded string
        
    Returns:
        Decoded bytes
    """
    padding = 4 - (len(data) % 4)
    if padding != 4:
        data += '=' * padding
    
    return base64.urlsafe_b64decode(data)