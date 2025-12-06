from pydantic import BaseModel
from typing import Optional


class MovieCreate(BaseModel):
    name: str
    release_date: str
    rating: int
    tags: dict


class MovieResponse(BaseModel):
    id: str
    name: str
    release_date: str
    rating: int
    tags: dict


class MovieUpdate(BaseModel):
    name: Optional[str] = None
    release_date: Optional[str] = None
    rating: Optional[int] = None
    tags: Optional[dict] = None
