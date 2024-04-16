from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    username: str
    email: str
    is_active: Optional[bool] = True

    class Config:
        orm_mode = True


class UserOut(User):
    id: int
    nickname: Optional[str]
    avatar: Optional[str]


class UserPatch(BaseModel):
    username: Optional[str] = None
    nickname: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    avatar: Optional[str] = None

    class Config:
        orm_mode = True


class UserInDB(User):
    password: str
    avatar: Optional[str] = None
