import os
import sys
from loguru import logger

def setup_logging():
    """Setup simple logging configuration with one log file."""
    
    # Remove default handlers first
    logger.remove()
    
    # Add console handler
    logger.add(
        sys.stderr,
        level="INFO",
        format="{time} | {level} | {message}",
        colorize=True
    )
    
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    # Add single file handler for all logs
    logger.add(
        "logs/app.log",
        rotation="1 day",
        retention="1 days",
        colorize=False,
        format="{time} | {level} | {message}",
        enqueue=True
    )
    
    print("✅ Logging configuration initialized")

# Initialize logging when module is imported
setup_logging()
