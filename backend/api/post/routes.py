from . import schemas, crud
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, APIRouter, UploadFile, File, Form
from database.database import get_db
from ..user.crud import get_user_by_id
from typing import List
import os

router = APIRouter()


@router.post("/post", response_model=schemas.PostOut)
async def create_post(
    message: str = Form(),
    owner_id: str = Form(),
    created_on: str = Form(),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    db_post = await crud.create_post(db, message, owner_id, created_on, files)
    return db_post


@router.post("comment", response_model=schemas.PostOut)
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
    db.add(parent_post)
    db.commit()
    return comment


@router.delete("/post/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    response = crud.delete_post(db, post_id=post_id)
    if not response[0]:
        raise HTTPException(status_code=404, detail="Post not found")
    # Delete post's related images from /images folder
    image_folder = f"static\\images\\{response[1]['owner_id']}\\{post_id}"
    for filename in os.listdir(image_folder):
        file_path = os.path.join(image_folder, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    # Remove the directory if it exists
    if os.path.exists(f"static\\images\\{response[1]['owner_id']}\\{post_id}"):
        os.rmdir(f"static\\images\\{response[1]['owner_id']}\\{post_id}")
    return response[0]


@router.get("/user/post/{user_id}", response_model=schemas.PostList)
def get_posts(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    return {"posts": user_posts}


@router.get("/post/{post_id}", response_model=schemas.PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post_by_id(db, post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post


@router.get("/comments/post/{post_id}", response_model=schemas.PostList)
def get_comments(post_id: int, db: Session = Depends(get_db)):
    post_comments = crud.get_post_comments(db, post_id)
    return post_comments
