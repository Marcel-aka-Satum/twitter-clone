from pydantic import BaseModel


class Post(BaseModel):
    message: str
    owner_id: int

    class Config:
        orm_mode = True


class PostOut(Post):
    id: int


class PostList(BaseModel):
    posts: list[Post]
