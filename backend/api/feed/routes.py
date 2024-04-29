from fastapi import APIRouter, Depends, HTTPException
from database.database import get_db
from sqlalchemy.orm import Session
from . import schemas
from . import models

from ..post.schemas import PostOut
from . import crud

router = APIRouter()


# create a new feed
@router.post("/feed", response_model=schemas.Feed, tags=["feed"])
def create_feed(type: str, db: Session = Depends(get_db)):
    new_feed = models.Feed(type=type)
    db.add(new_feed)
    db.commit()
    db.refresh(new_feed)
    return new_feed


# get a feed by id
@router.get("/feed/id/{feed_id}", response_model=schemas.FeedOut, tags=["feed"])
def get_feed(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(models.Feed).filter(models.Feed.id == feed_id).first()
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed


# get a feed by type
@router.get("/feed/type/{feed_type}", response_model=schemas.FeedOut, tags=["feed"])
def get_feed_by_name(feed_type: str, db: Session = Depends(get_db)):
    feed = db.query(models.Feed).filter(models.Feed.type == feed_type).first()
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed


# add a post to a feed
@router.patch("/feed/{feed_id}/{post_id}", response_model=schemas.FeedOut)
def add_post_to_feed(feed_id: int, post_id: int, db: Session = Depends(get_db)):
    feed = crud.add_to_feed(db, feed_id, post_id)
    return feed


@router.get("/feed/{feed_id}/posts", response_model=list[PostOut])
def get_posts_from_feed(feed_id: int, db: Session = Depends(get_db)):
    feed = db.query(models.Feed).filter(models.Feed.id == feed_id).first()
    if feed is None:
        raise HTTPException(status_code=404, detail="Feed not found")
    serialized_posts = []
    for post in feed.posts:
        serialized_posts.append(
            PostOut(
                id=post.id,
                message=post.message,
                owner_id=post.owner_id,
                created_on=post.created_on,
                files=post.files,
                username=post.user.username,
                amountOfComments=len(post.comments),
                amountOfReposts=len(post.reposted_by),
                amountOfLikes=len(post.users_liked_by),
                published=post.published,
                scheduled_for=post.scheduled_for,
            )
        )
    return serialized_posts
