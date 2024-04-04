from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship, Mapped
from database.database import Base


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
