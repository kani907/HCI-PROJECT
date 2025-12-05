from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    algorithm: dict
    role: str = "user"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    algorithm: dict
    role: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    algorithm: Optional[dict] = None
