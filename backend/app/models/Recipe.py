from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from typing import Optional, Dict, Any
import datetime

class Recipe(SQLModel, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.cognito_id")
    recipe_name: str = Field(nullable=True)
    ingredients = Field(sa_column=Column(JSONB))
    preparation = Field(sa_column=Column(JSONB))
    metadata: Dict[str, Any] = Field(sa_column=Column(JSONB))
    created_at: datetime.datetime = Field()
    
    user: Optional["User"] = Relationship(back_populates="recipe")