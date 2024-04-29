from fastapi import Depends, HTTPException, APIRouter, UploadFile, File, Request
from sqlalchemy.orm import Session
from . import schemas, crud
from ..post.schemas import PostOut
from database.database import get_db
import os
from jwt import DecodeError
import jwt

router = APIRouter()


@router.post("/user", response_model=schemas.User, tags=["user"])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.patch("/user", response_model=schemas.UserOut, tags=["user"])
def update_user(
    request: Request,
    user: schemas.UserPatch,
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
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, user_db=db_user, user_info=user)


@router.patch("/repost/{post_id}", response_model=PostOut, tags=["user"])
def repost_post(request: Request, post_id: int, db: Session = Depends(get_db)):

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
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.repost_post(db=db, user_db=db_user, post_id=post_id)


@router.patch("/like/{post_id}", response_model=PostOut, tags=["user"])
def like_post(request: Request, post_id: int, db: Session = Depends(get_db)):
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
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return crud.like_post(db=db, post_id=post_id, user_db=db_user)


@router.get("/user", response_model=schemas.UserOut, tags=["user"])
def read_user(request: Request, db: Session = Depends(get_db)):
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
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/user/username/{username}", response_model=schemas.UserOut, tags=["user"])
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/uploadavatar/", tags=["user"])
async def create_upload_file(
    user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id)
    if db_user:
        file_location = f"images/{db_user.id}/{file.filename}"
        db_user.avatar = file_location
        db.commit()
        db.refresh(db_user)

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    raise HTTPException(status_code=401, detail="User not found to upload any file")


@router.get("/user/likes", response_model=list[int], tags=["user"])
async def get_user_likes(request: Request, db: Session = Depends(get_db)):
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
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return [like.id for like in db_user.likes]


@router.get("/user/reposts", response_model=list[int], tags=["user"])
async def get_user_reposts(request: Request, db: Session = Depends(get_db)):
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
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return [repost.id for repost in db_user.reposting]


@router.get("/user/comments/{username}", response_model=list[PostOut], tags=["user"])
async def get_user_comments(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    serialized_comments = []
    for post in db_user.posts:
        for comment in post.comments:
            if comment.owner_id == db_user.id:
                serialized_comments.append(
                    PostOut(
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
                )

    return serialized_comments
