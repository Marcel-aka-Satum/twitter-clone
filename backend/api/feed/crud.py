from . import models
from sqlalchemy.orm import Session


def get_feed_by_type(db: Session, feed_type: str) -> models.Feed:
    feed = db.query(models.Feed).filter_by(type=feed_type).first()
    return feed
