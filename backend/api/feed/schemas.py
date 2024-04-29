from pydantic import BaseModel


class Feed(BaseModel):
    type: str

    class Config:
        orm_mode = True


class FeedOut(Feed):
    id: int

    class Config:
        orm_mode = True
