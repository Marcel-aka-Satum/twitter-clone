from sqlalchemy import Column, Integer, String, Table, ForeignKey
from database.database import Base
from sqlalchemy.orm import relationship, Mapped


posts_feed = Table(
    "posts_feed",
    Base.metadata,
    Column("feed_id", Integer, ForeignKey("feed.id")),
    Column("post_id", Integer, ForeignKey("posts.id")),
)


class Feed(Base):
    """
    Represents a feed in the application.
    For ex. on the home page u have global feed where all new posts are shown.
    """

    __tablename__ = "feed"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type: str = Column(String(50))
    posts: Mapped[list["Post"]] = relationship(
        "Post", secondary=posts_feed, backref="feeds"
    )
