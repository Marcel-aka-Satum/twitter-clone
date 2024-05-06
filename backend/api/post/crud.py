from sqlalchemy.orm import Session
from . import models
from ..user.models import User
from fastapi import UploadFile
import os
from datetime import datetime
from .models import Post
from database.database import SessionLocal
from ..feed.crud import add_to_feed


def get_user_posts(user: User) -> list[models.Post]:
    return user.posts


def get_post_likes(post: models.Post):
    return len(post.liked_by)


def get_post_by_id(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()


def publish_scheduled_posts():
    db: Session = SessionLocal()
    posts = db.query(Post).filter(Post.scheduled_for <= datetime.now()).all()
    for post in posts:
        post.published = True
    db.commit()


def create_post(
    db: Session,
    message: str,
    owner_id: str,
    created_on: str,
    files: list[UploadFile],
    scheduled_time: str,
):
    user = db.query(User).filter(User.id == owner_id).first()
    published = True
    if scheduled_time is not None:
        published = False
    if user:
        db_post = models.Post(
            message=message,
            owner_id=owner_id,
            user=user,
            created_on=created_on,
            scheduled_for=scheduled_time,
            published=published,
        )

        user.posts.append(db_post)  # relationship
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        if files is None:
            add_to_feed(db, 1, db_post.id)
            return db_post

        # Save images to the images folder
        arrListNames = []
        for file in files:
            file_location = f"static/images/{owner_id}/{db_post.id}/{file.filename}"
            arrListNames.append(file_location)
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_location), exist_ok=True)
            with open(file_location, "wb+") as file_object:
                file_object.write(file.read())

        db_post.files = arrListNames
        db.commit()
        db.refresh(db_post)
        add_to_feed(db, 1, db_post.id)

        return db_post
    return {"error": "User does not exist cannot make a post"}


def delete_post(db: Session, post_id: int):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        return False, {"NOT FOUND": "Post not found"}
    try:
        owner_id = post.owner_id
        db.delete(post)
        db.commit()
        return True, {"owner_id": owner_id}
    except Exception as e:
        return False, {"error": str(e)}


def get_post_comments(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
