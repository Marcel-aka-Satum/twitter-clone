from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, backref
from database.database import Base


class Post(Base):
    __tablename__ = "posts"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    message: str = Column(String(300))
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    owner_id: int = Column(Integer, ForeignKey("users.id"))
    files = Column(ARRAY(String))
    liked_by: Mapped[list["User"]] = relationship(
        "User", back_populates="likes", uselist=True, overlaps="user"
    )
    user: Mapped["User"] = relationship("User", back_populates="posts", uselist=False)

    # Self-referential relationship for comments
    parent_id = Column(Integer, ForeignKey("posts.id"))
    comments: Mapped[list["Post"]] = relationship(
        "Post",
        backref=backref("parent", remote_side=[id]),
        uselist=True,
        cascade="all, delete",
        foreign_keys=[parent_id],
    )
