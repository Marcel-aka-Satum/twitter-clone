from pydantic import BaseModel
from typing import Optional


class Feed(BaseModel):
    type: str

    class Config:
        orm_mode = True


class FeedOut(Feed):
    post_ids: list[int]
    id: int

    class Config:
        orm_mode = True
