from pydantic import BaseModel
from datetime import datetime


class Post(BaseModel):
    message: str
    owner_id: int
    created_on: datetime

    class Config:
        orm_mode = True


class PostOut(Post):
    id: int


class PostList(BaseModel):
    posts: list[PostOut]
