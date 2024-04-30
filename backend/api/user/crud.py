from sqlalchemy.orm import Session
from auth.auth import get_password_hash
from . import models, schemas
import os
import re
import base64
from fastapi import HTTPException
from ..post.crud import get_post_by_id
from ..post.schemas import PostOut


def is_password_strong(psswd):
    # Check for uppercase, lowercase, number, and special character
    regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
    return bool(re.match(regex, psswd))


def is_valid_email(email):
    # Check if email is valid
    regex = r"^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
    return bool(re.match(regex, email))


def repost_post(db: Session, user_db: models.User, post_id: int):
    post = get_post_by_id(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if post in user_db.reposting:
        user_db.reposting.remove(post)
    else:
        user_db.reposting.append(post)
    db.commit()
    db.refresh(user_db)
    serialized_post = PostOut(
        id=post.id,
        message=post.message,
        owner_id=post.owner_id,
        created_on=post.created_on,
        files=post.files,
        username=post.user.username,
        amountOfComments=len(post.comments),
        amountOfLikes=len(post.users_liked_by),
        amountOfReposts=len(post.reposted_by),
        published=post.published,
    )
    return serialized_post


def like_post(db: Session, user_db: models.User, post_id: int):
    post = get_post_by_id(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if post in user_db.likes:
        user_db.likes.remove(post)
    else:
        user_db.likes.append(post)
    db.commit()
    db.refresh(post)
    db.refresh(user_db)
    serialized_post = PostOut(
        id=post.id,
        message=post.message,
        owner_id=post.owner_id,
        created_on=post.created_on,
        files=post.files,
        username=post.user.username,
        amountOfComments=len(post.comments),
        amountOfLikes=len(post.users_liked_by),
        amountOfReposts=len(post.reposted_by),
        published=post.published,
    )
    return serialized_post


def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_id(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session):
    return db.query(models.User).all()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserInDB):

    if len(user.email) == 0:
        raise HTTPException(status_code=400, detail="Email is required")
    if len(user.username) == 0:
        raise HTTPException(status_code=400, detail="Username is required")
    if len(user.password) == 0:
        raise HTTPException(status_code=400, detail="Password is required")

    if not is_password_strong(user.password):
        raise HTTPException(status_code=400, detail="Password is not strong enough")
    if not is_valid_email(user.email):
        raise HTTPException(status_code=400, detail="Email is invalid")

    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        username=user.username,
        nickname=user.username,
        avatar="static/images/defaultAvatar.jpg",
        banner="static/images/defaultBanner.jpg",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_db: models.User, user_info: schemas.UserPatch):
    if user_info.email:
        user_db.email = user_info.email
    if user_info.nickname:
        user_db.nickname = user_info.nickname
    if user_info.password:
        user_db.hashed_password = get_password_hash(user_info.password)
    if user_info.description:
        user_db.description = user_info.description
    if user_info.avatar:
        base64_image = user_info.avatar.split(",")[1]
        image_data = base64.b64decode(base64_image)
        directory = f"static/images/{user_db.id}/avatar/"
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(f"static/images/{user_db.id}/avatar/avatar.jpg", "wb") as file:
            file.write(image_data)
        user_db.avatar = f"static/images/{user_db.id}/avatar/avatar.jpg"
    if user_info.banner:
        base64_image = user_info.banner.split(",")[1]
        image_data = base64.b64decode(base64_image)
        directory = f"static/images/{user_db.id}/banner/"
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(f"static/images/{user_db.id}/banner/banner.jpg", "wb") as file:
            file.write(image_data)
        user_db.banner = f"static/images/{user_db.id}/banner/banner.jpg"
    db.commit()
    db.refresh(user_db)
    return user_db


def follow_user(db: Session, user_db: models.User, user_to_follow: models.User):
    if user_to_follow in user_db.followers:
        user_db.followers.remove(user_to_follow)
    else:
        user_db.followers.append(user_to_follow)
    db.commit()
    db.refresh(user_db)
    return user_to_follow
