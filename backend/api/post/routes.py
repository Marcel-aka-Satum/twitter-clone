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


@router.get("/users/post/{user_id}", response_model=schemas.PostList)
def get_posts(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    return {"posts": user_posts}
