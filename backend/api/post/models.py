from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, Mapped
from database.database import Base
from ..user.models import User


class Post(Base):
    __tablename__ = "posts"

    id: int = Column(Integer, primary_key=True, index=True)
    message: str = Column(String, primary_key=True)
    owner_id: int = Column(Integer, ForeignKey("users.id"))
    liked_by: Mapped[list[User]] = relationship(
        "User", uselist=True, back_populates="likes"
    )
    user: Mapped[User] = relationship("User", back_populates="posts", uselist=False)
