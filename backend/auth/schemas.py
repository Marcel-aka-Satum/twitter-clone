from typing import Optional
from pydantic import BaseModel


class TokenData(BaseModel):
    username: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenOut(Token):
    user: dict


class Validate(BaseModel):
    authenticated: bool
    user_id: int
    username: str
