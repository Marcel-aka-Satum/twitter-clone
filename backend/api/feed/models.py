from sqlalchemy import Column, Integer, ForeignKey, ARRAY, String
from database.database import Base


class Feed(Base):
    """
    Represents a feed in the application.
    For ex. on the home page u have global feed where all new posts are shown.
    """

    __tablename__ = "feed"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type: str = Column(String(50))
    post_ids: list[int] = Column(ARRAY(Integer), default=[])
