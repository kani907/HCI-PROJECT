from pydantic import BaseModel
from typing import Optional


class TimePut(BaseModel):
    time: str


class TimeGet(BaseModel):
    id: str
    time: str


class TimeUpdate(BaseModel):
    time: Optional[str]
