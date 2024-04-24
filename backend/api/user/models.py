from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship, Mapped
from database.database import Base


class User(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True)
    nickname: str = Column(String(64), unique=False)
    username: str = Column(String(64), unique=True, index=True)
    email: str = Column(String, unique=True, index=True)
    hashed_password: str = Column(String(128))
    avatar: str = Column(String, unique=False)
    banner: str = Column(String, unique=False)
    is_active: bool = Column(Boolean, default=True)
    description: str = Column(String, unique=False)
    likes: Mapped[list["Post"]] = relationship(
        "Post", uselist=True, back_populates="liked_by"
    )

    posts: Mapped[list["Post"]] = relationship(
        "Post", back_populates="user", uselist=True, overlaps="liked_by"
    )

    reposts: Mapped[list["Post"]] = relationship(
        back_populates="reposted_by", uselist=False
    )

    # Serializer to get user in json without hashed_psswd attr
    def as_dict(self):
        return {
            c.name: getattr(self, c.name)
            for c in self.__table__.columns
            if c.name != "hashed_password"
        }
