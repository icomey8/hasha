from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
import datetime
from typing import List, Optional, Dict, Any


class User(SQLModel, table=True):
    __tablename__ = "user"
    __table_args__ = {'extend_existing': True}
    
    id: int = Field(primary_key=True)
    cognito_id: Optional[str] = Field(default=None, unique=True)
    username: str = Field(unique=True)
    created_at: datetime.datetime
    
    recipe: List["Recipe"] = Relationship(back_populates="user")
    
class Recipe(SQLModel, table=True):
    __tablename__ = "recipe"
    __table_args__ = {'extend_existing': True}
    
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.cognito_id")
    recipe_name: str = Field(nullable=True)
    ingredients: List[Dict[str, Any]] = Field(sa_column=Column(JSONB))
    preparation: List[Dict[str, Any]] = Field(sa_column=Column(JSONB))
    recipe_metadata: Dict[str, Any] = Field(sa_column=Column(JSONB), alias="metadata")
    created_at: datetime.datetime = Field()
    
    user: Optional["User"] = Relationship(back_populates="recipe")