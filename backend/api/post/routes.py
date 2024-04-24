from . import schemas, crud
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, APIRouter, UploadFile, File, Form, Request
from database.database import get_db
from ..user.crud import get_user_by_id
from typing import List
import jwt
from jwt import DecodeError
import os

router = APIRouter()


# create a post
@router.post("/post", response_model=schemas.PostOut)
async def create_post(
    message: str = Form(),
    owner_id: str = Form(),
    created_on: str = Form(),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    db_post = await crud.create_post(db, message, owner_id, created_on, files)
    db_post_serialized = schemas.PostOut(
        id=db_post.id,
        message=db_post.message,
        owner_id=db_post.owner_id,
        created_on=db_post.created_on,
        files=db_post.files,
        username=db_post.user.username,
    )
    return db_post_serialized


@router.post("/repost", response_model=schemas.PostOut)
async def repost_post(
    request: Request,
    post_id: int = Form(...),
    db: Session = Depends(get_db),
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
    try:
        decoded_token = jwt.decode(
            token,
            "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7",  # SECRET_KEY
            algorithms=["HS256"],  # ALGORITHM
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token invalid")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Token is not a valid JWT")

    user_id = decoded_token.get("user_id")
    db_user = get_user_by_id(db, user_id)
    post = crud.get_post_by_id(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found, can't retweet")
    if db_user in post.reposts:
        raise HTTPException(status_code=404, detail="You already retweeted this post")
    post.reposts.append(db_user)
    db.add(post)
    db.commit()
    serialized_post = schemas.PostOut(
        id=post.id,
        message=post.message,
        owner_id=post.owner_id,
        created_on=post.created_on,
        files=post.files,
        username=post.user.username,
        amountOfComments=len(post.comments),
        amountOfLikes=len(post.liked_by),
        amountOfReposts=len(post.reposts),
    )
    return serialized_post


# delete a post by post id
@router.delete("/post/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    response = crud.delete_post(db, post_id=post_id)
    if not response[0]:
        raise HTTPException(status_code=404, detail="Post not found")
    # Delete post's related images from /images folder
    image_folder = f"static\\images\\{response[1]['owner_id']}\\{post_id}"
    if not os.path.exists(image_folder):
        return response[0]
    for filename in os.listdir(image_folder):
        file_path = os.path.join(image_folder, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    # Remove the directory if it exists
    if os.path.exists(f"static\\images\\{response[1]['owner_id']}\\{post_id}"):
        os.rmdir(f"static\\images\\{response[1]['owner_id']}\\{post_id}")
    return response[0]


# Get all posts of a user by a user id
@router.get("/user/post/{user_id}", response_model=schemas.PostList)
def get_posts(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    serialized_posts = list()
    for post in user_posts:
        post = schemas.PostOut(
            id=post.id,
            message=post.message,
            owner_id=post.owner_id,
            created_on=post.created_on,
            files=post.files,
            username=post.user.username,
            amountOfComments=len(post.comments),
            amountOfReposts=len(post.reposts),
        )
        serialized_posts.append(post)
    return {"posts": serialized_posts}


# Get all posts of a user by a username
@router.get("/user/post/username/{username}", response_model=schemas.PostList)
def get_posts_by_username(username: str, db: Session = Depends(get_db)):
    print("hello")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    serialized_posts = list()
    for post in user_posts:
        post = schemas.PostOut(
            id=post.id,
            message=post.message,
            owner_id=post.owner_id,
            created_on=post.created_on,
            files=post.files,
            username=post.user.username,
            amountOfComments=len(post.comments),
            amountOfLikes=len(post.liked_by),
        )
        serialized_posts.append(post)
    return {"posts": serialized_posts}


# Get a post by post id
@router.get("/post/{post_id}", response_model=schemas.PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post_by_id(db, post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    db_post_serialized = schemas.PostOut(
        id=db_post.id,
        message=db_post.message,
        owner_id=db_post.owner_id,
        created_on=db_post.created_on,
        files=db_post.files,
        username=db_post.user.username,
        amountOfComments=len(db_post.comments),
        amountOfLikes=len(db_post.liked_by),
        amountOfReposts=len(db_post.reposts),
    )
    print(len(db_post.reposts))
    return db_post_serialized


# Get all comments of a post by post id
@router.get("/comments/post/{post_id}", response_model=schemas.PostList)
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post = crud.get_post_comments(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    serialized_comments = list()
    for comment in post.comments:
        comment = schemas.PostOut(
            id=comment.id,
            message=comment.message,
            owner_id=comment.owner_id,
            created_on=comment.created_on,
            files=comment.files,
            username=comment.user.username,
            amountOfComments=len(comment.comments),
            amountOfLikes=len(comment.liked_by),
            amountOfReposts=len(comment.reposts),
        )
        serialized_comments.append(comment)
    return {"posts": serialized_comments}


# create comment
@router.post("/comment", response_model=schemas.PostOut)
async def create_comment(
    message: str = Form(),
    owner_id: str = Form(),
    created_on: str = Form(),
    parent_id: int = Form(),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    parent_post = crud.get_post_by_id(db, parent_id)
    if parent_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    comment = await crud.create_post(db, message, owner_id, created_on, files)
    parent_post.comments.append(comment)
    serialized_comment = schemas.PostOut(
        id=comment.id,
        message=comment.message,
        owner_id=comment.owner_id,
        created_on=comment.created_on,
        files=comment.files,
        username=comment.user.username,
    )
    db.add(parent_post)
    db.commit()
    return serialized_comment
