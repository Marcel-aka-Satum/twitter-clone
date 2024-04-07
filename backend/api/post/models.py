from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped
from database.database import Base
from ..user.models import User


class Post(Base):
    __tablename__ = "posts"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    message: str = Column(String)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    owner_id: int = Column(Integer, ForeignKey("users.id"))
    liked_by: Mapped[list[User]] = relationship(
        "User", uselist=True, back_populates="likes"
    )
    user: Mapped[User] = relationship("User", back_populates="posts", uselist=False)
