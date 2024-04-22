from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from fastapi import File


class Post(BaseModel):
    message: str
    owner_id: int
    created_on: datetime

    class Config:
        orm_mode = True


class PostOut(Post):
    id: int
    files: Optional[list[str]]
    username: str


class PostList(BaseModel):
    posts: list[PostOut]
