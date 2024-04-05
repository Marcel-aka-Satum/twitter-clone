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


class UserInDB(User):
    password: str
