from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship
from sqlalchemy import JSON, Column
import datetime
from typing import List, Optional, Dict, Any

class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    created_at: datetime.datetime
    username: str = Field(unique=True)
    cognito_id: Optional[str] = Field(default=None, unique=True)
    
    bricks: List["Bricks"] = Relationship(back_populates="user")
    
    
class Bricks(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime.datetime = Field()
    name: str = Field(nullable=True)
    category: str
    brick_metadata: Dict[str, Any] = Field(sa_column=Column(JSON))
    
    user: Optional[User] = Relationship(back_populates="bricks")
    