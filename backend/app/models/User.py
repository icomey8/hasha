from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy.dialects.postgresql import JSONB
import datetime
from typing import List, Optional

class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    cognito_id: Optional[str] = Field(default=None, unique=True)
    username: str = Field(unique=True)
    created_at: datetime.datetime
    
    recipe: List["Recipe"] = Relationship(back_populates="user")
    
    
