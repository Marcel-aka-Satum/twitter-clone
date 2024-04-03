from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True)
    username: str = Column(String, unique=True, index=True)
    email: str = Column(String, unique=True, index=True)
    hashed_password: str = Column(String)
    is_active: bool = Column(Boolean, default=True)

    posts = relationship("Post", back_populates="owner")


class Post(Base):
    __tablename__ = "posts"

    id: int = Column(Integer, primary_key=True, index=True)
    message: str = Column(String, primary_key=True)
    owner_id: int = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="posts")
