import os
import sys
from loguru import logger

def setup_logging():
    """Setup logging configuration for all modules."""
    
    # Remove default handlers first
    logger.remove()
    
    # Add handlers for each module with proper filtering
    modules = [
        ("users", "app/routers/users.log"),
        ("recipes", "app/routers/recipes.log"),
        ("auth", "app/auth/auth.log"),
        ("token_validation", "app/auth/token_validation.log"),
        ("jwks", "app/auth/jwks.log"),
    ]
    
    for module_name, log_path in modules:
        os.makedirs(os.path.dirname(log_path), exist_ok=True)
        
        logger.add(
            log_path,
            rotation="1 day",
            retention="1 day",
            colorize=False,
            format="{time} | {level} | {message}",
            filter=lambda record, mod=module_name: record["extra"].get("module") == mod
        )
    
    logger.add(
        sys.stderr,
        level="WARNING",
        format="{time} | {level} | {message}",
        filter=lambda record: not record["extra"].get("module")
    )
    
    print("✅ Logging configuration initialized")

def get_module_logger(module_name: str):
    """Get a bound logger for a specific module."""
    return logger.bind(module=module_name)

setup_logging()
