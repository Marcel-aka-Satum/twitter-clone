from pydantic import BaseModel


class Post(BaseModel):
    id: int
    message: str
    owner_id: int

    class Config:
        orm_mode = True


class PostList(BaseModel):
    posts: list[Post]
