from sqlalchemy.orm import Session
from . import models, schemas
from ..user.models import User


def get_user_posts(db: Session, user: User) -> list[models.Post]:
    return user.posts


def create_post(db: Session, post: schemas.Post):
    user = db.query(User).filter(User.id == post.owner_id).first()
    db_post = models.Post(
        id=post.id, message=post.message, owner_id=post.owner_id, user=user
    )
    user.posts.append(db_post)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
