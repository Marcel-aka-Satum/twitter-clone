from sqlalchemy import Boolean, Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from database.database import Base


user_repost = Table(
    "user_repost",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("post_id", Integer, ForeignKey("posts.id")),
)

liked_post = Table(
    "user_likes",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("post_id", Integer, ForeignKey("posts.id")),
)


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
        "Post", secondary=liked_post, backref="users_liked_by"
    )

    posts: Mapped[list["Post"]] = relationship(
        "Post", back_populates="user", uselist=True
    )

    reposting: Mapped[list["Post"]] = relationship(
        "Post", secondary=user_repost, backref="reposted_by"
    )

    # Serializer to get user in json without hashed_psswd attr
    def as_dict(self):
        return {
            c.name: getattr(self, c.name)
            for c in self.__table__.columns
            if c.name != "hashed_password"
        }
