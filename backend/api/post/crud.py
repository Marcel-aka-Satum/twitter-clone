from sqlalchemy.orm import Session
from . import models, schemas
from ..user.models import User


def get_user_posts(user: User) -> list[models.Post]:
    return user.posts


def get_post_likes(post: models.Post):
    return len(post.liked_by)


def create_post(db: Session, post: schemas.Post):
    user = (
        db.query(User).filter(User.id == post.owner_id).first()
    )  # we have function for that change it later to it DRY!
    db_post = models.Post(
        message=post.message,
        owner_id=post.owner_id,
        user=user,
        created_on=post.created_on,
    )
    user.posts.append(db_post)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_post(db: Session, post_id: int):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        return {"error": "Post not found"}
    try:
        db.delete(post)
        db.commit()
        return {"success": f"Post {post_id} successfully deleted"}
    except Exception as e:
        return {"error": str(e)}
