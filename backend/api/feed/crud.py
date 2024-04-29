from . import models
from sqlalchemy.orm import Session
from ..post.models import Post as model_post


def get_feed_by_type(db: Session, feed_type: str) -> models.Feed:
    feed = db.query(models.Feed).filter_by(type=feed_type).first()
    return feed


def add_to_feed(db: Session, feed_id: int, post_id: int) -> models.Feed:
    feed = db.query(models.Feed).filter_by(id=feed_id).first()
    post = db.query(model_post).filter_by(id=post_id).first()
    if post in feed.posts:
        return feed
    feed.posts.append(post)
    db.commit()
    db.refresh(feed)
    return feed
