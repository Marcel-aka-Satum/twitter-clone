from fastapi import APIRouter, Depends, HTTPException
from database.database import get_db
from sqlalchemy.orm import Session
from . import schemas
from . import models

router = APIRouter()


@router.post("/feed", response_model=schemas.Feed)
def create_feed(type: str, db: Session = Depends(get_db)):
    new_feed = models.Feed(type=type)
    db.add(new_feed)
    db.commit()
    db.refresh(new_feed)
    return new_feed


@router.get("/feed/id/{feed_id}", response_model=schemas.FeedOut)
def get_feed(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(models.Feed).filter(models.Feed.id == feed_id).first()
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed


@router.get("/feed/type/{feed_type}", response_model=schemas.FeedOut)
def get_feed_by_name(feed_type: str, db: Session = Depends(get_db)):
    feed = db.query(models.Feed).filter(models.Feed.type == feed_type).first()
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed


@router.patch("/feed/{feed_id}", response_model=schemas.FeedOut)
def add_post_to_feed(feed_id: int, post_id: int, db: Session = Depends(get_db)):
    feed = db.query(models.Feed).filter(models.Feed.id == feed_id).first()
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    feed.post_ids = feed.post_ids + [post_id]
    db.commit()
    db.refresh(feed)
    return feed
