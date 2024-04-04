from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, Mapped

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True)
    username: str = Column(String, unique=True, index=True)
    email: str = Column(String, unique=True, index=True)
    hashed_password: str = Column(String)
    is_active: bool = Column(Boolean, default=True)
    likes: Mapped[list["Post"]] = relationship(
        "Post", uselist=True, back_populates="liked_by"
    )

    posts: Mapped[list["Post"]] = relationship(
        "Post", back_populates="user", uselist=True
    )


class Post(Base):
    __tablename__ = "posts"

    id: int = Column(Integer, primary_key=True, index=True)
    message: str = Column(String, primary_key=True)
    owner_id: int = Column(Integer, ForeignKey("users.id"))
    likes: int = Column(Integer)
    
    liked_by: Mapped[list[User]] = relationship(
        "User", uselist=True, back_populates="likes"
    )
    user: Mapped[User] = relationship("User", back_populates="posts", uselist=False)
