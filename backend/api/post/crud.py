from sqlalchemy.orm import Session
from . import models, schemas
from ..user.models import User
from fastapi import UploadFile
from typing import Optional, List
import os


def get_user_posts(user: User) -> list[models.Post]:
    return user.posts


def get_post_likes(post: models.Post):
    return len(post.liked_by)


async def create_post(
    db: Session, message: str, owner_id: str, created_on: str, files: list[UploadFile]
):
    user = (
        db.query(User).filter(User.id == owner_id).first()
    )  # we have function for that change it later to it DRY!
    if user:
        db_post = models.Post(
            message=message,
            owner_id=owner_id,
            user=user,
            created_on=created_on,
        )

        user.posts.append(db_post)  # relationship
        db.add(db_post)
        db.commit()
        db.refresh(db_post)

        arrListNames = []
        for file in files:
            file_location = f"images/{owner_id}/{db_post.id}/{file.filename}"
            arrListNames.append(file_location)
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(file_location), exist_ok=True)
            with open(file_location, "wb+") as file_object:
                file_object.write(await file.read())

        return db_post
    return {"error": "User does not exist cannot make a post"}


def delete_post(db: Session, post_id: int):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post is None:
        return False
    try:
        db.delete(post)
        db.commit()
        return True
    except Exception as e:
        return {"error": str(e)}
