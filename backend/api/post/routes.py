from . import schemas, crud
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, APIRouter
from database.database import get_db
from ..user.crud import get_user_by_id

router = APIRouter()


@router.post("/post", response_model=schemas.Post)
def create_post(post: schemas.Post, db: Session = Depends(get_db)):
    db_post = crud.create_post(db, post)
    return db_post


@router.get("/users/post/{user_id}", response_model=schemas.PostList)
def get_posts(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_posts = crud.get_user_posts(db_user)
    return {"posts": user_posts}
