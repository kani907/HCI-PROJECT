from pydantic import BaseModel, Field
from typing import Optional, List


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "user"
    history: List[str] = Field(default_factory=list)
    algorithm: dict[str, dict[str, int]] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    algorithm: dict
    role: str
    history: List[str] = Field(default_factory=list)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    algorithm: Optional[dict] = None
    history: List[str] = None
