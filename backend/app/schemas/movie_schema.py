from pydantic import BaseModel
from typing import Optional


class MovieCreate(BaseModel):
    name: str
    release_date: int
    rating: float
    tags: dict


class MovieResponse(BaseModel):
    id: str
    name: str
    release_date: int
    rating: float
    tags: dict


class MovieUpdate(BaseModel):
    name: Optional[str] = None
    release_date: Optional[int] = None
    rating: Optional[float] = None
    tags: Optional[dict] = None
