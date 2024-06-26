from . import schemas, crud
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, APIRouter, UploadFile, File, Form
from database.database import get_db
from ..user.crud import get_user_by_id
from typing import List
import os
from fastapi import Request
from auth.auth import authenticate_token

router = APIRouter()


# create a post
@router.post("/post", response_model=schemas.PostOut, tags=["posts"])
async def create_post(
    message: str = Form(),
    owner_id: str = Form(),
    created_on: str = Form(),
    scheduled_time: str = Form(None),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    if files:
        for file in files:
            if file.content_type not in [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/jfif",
                "image/pdf",
            ]:
                raise HTTPException(status_code=400, detail="Only images are allowed")
            if file.size > 5 * 1024 * 1024:
                raise HTTPException(
                    status_code=400, detail="File size must be less than 5MB"
                )

    db_post = await crud.create_post(
        db, message, owner_id, created_on, files, scheduled_time
    )
    db_post_serialized = schemas.PostOut(
        id=db_post.id,
        message=db_post.message,
        owner_id=db_post.owner_id,
        created_on=db_post.created_on,
        files=db_post.files,
        username=db_post.user.username,
        published=db_post.published,
    )
    return db_post_serialized


# delete a post by post id
@router.delete("/post/{post_id}", tags=["posts"])
def delete_post(request: Request, post_id: int, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
    username = decoded_token.get("username")
    current_post = crud.get_post_by_id(db, post_id)
    if username != current_post.user.username:
        raise HTTPException(
            status_code=401, detail="You are not allowed to delete this post"
        )
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
@router.get("/user/post/{user_id}", response_model=schemas.PostList, tags=["posts"])
def get_posts(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    serialized_posts = list()
    for post in user_posts:
        if post.published:
            post = schemas.PostOut(
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
            serialized_posts.append(post)
    return {"posts": serialized_posts}


# Get all posts of a user by a username
@router.get(
    "/user/post/username/{username}", response_model=schemas.PostList, tags=["posts"]
)
def get_posts_by_username(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    serialized_posts = list()
    for post in user_posts:
        if post.published == True:
            post = schemas.PostOut(
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
        serialized_posts.append(post)
    return {"posts": serialized_posts}


# Get a post by post id
@router.get("/post/{post_id}", response_model=schemas.PostOut, tags=["posts"])
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
        amountOfLikes=len(db_post.users_liked_by),
        amountOfReposts=len(db_post.reposted_by),
        published=db_post.published,
    )
    return db_post_serialized


# Get all comments of a post by post id
@router.get("/comments/post/{post_id}", response_model=schemas.PostList, tags=["posts"])
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
            amountOfLikes=len(comment.users_liked_by),
            amountOfReposts=len(comment.reposted_by),
            published=comment.published,
        )
        serialized_comments.append(comment)
    return {"posts": serialized_comments}


# create comment
@router.post("/comment", response_model=schemas.PostOut, tags=["posts"])
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

    if files:
        for file in files:
            if file.content_type not in [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/jfif",
                "image/pdf",
            ]:
                raise HTTPException(status_code=400, detail="Only images are allowed")
            if file.size > 5 * 1024 * 1024:
                raise HTTPException(
                    status_code=400, detail="File size must be less than 5MB"
                )
    comment = await crud.create_post(db, message, owner_id, created_on, files, None)
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
