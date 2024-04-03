from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        orm_mode = True


class Post(BaseModel):
    id: int
    message: str
    owner_id: int

    class Config:
        orm_mode = True


class testId(BaseModel):
    posts: list[Post]


class UserInDB(User):
    password: str


class TokenData(BaseModel):
    username: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str
