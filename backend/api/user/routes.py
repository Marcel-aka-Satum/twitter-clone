from fastapi import Depends, HTTPException, APIRouter, UploadFile, File, Request
from sqlalchemy.orm import Session
from . import schemas, crud
from ..post.schemas import PostOut
from database.database import get_db
from auth.auth import authenticate_token
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
    decoded_token = authenticate_token(token)
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, user_db=db_user, user_info=user)


@router.patch("/repost/{post_id}", response_model=PostOut, tags=["user"])
def repost_post(request: Request, post_id: int, db: Session = Depends(get_db)):

    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.repost_post(db=db, user_db=db_user, post_id=post_id)


@router.patch("/like/{post_id}", response_model=PostOut, tags=["user"])
def like_post(request: Request, post_id: int, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return crud.like_post(db=db, post_id=post_id, user_db=db_user)


@router.get("/user", response_model=schemas.UserOut, tags=["user"])
def read_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
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
    decoded_token = authenticate_token(token)
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return [like.id for like in db_user.likes]


@router.get("/user/reposts", response_model=list[int], tags=["user"])
async def get_user_reposts(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
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


@router.get("/user/reposts/{username}", response_model=list[PostOut], tags=["user"])
async def get_user_reposts(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    serialized_reposts = []
    for post in db_user.reposting:
        serialized_reposts.append(
            PostOut(
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
        )

    return serialized_reposts


@router.get("/user/likes/{username}", response_model=list[PostOut], tags=["user"])
async def get_user_likes(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    serialized_likes = []
    for post in db_user.likes:
        serialized_likes.append(
            PostOut(
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
        )

    return serialized_likes


@router.patch("/user/follow/{username}", response_model=schemas.UserOut, tags=["user"])
async def follow_user(request: Request, username: str, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
    username_token = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username_token)
    user_to_follow = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.follow_user(db=db, user_db=db_user, user_to_follow=user_to_follow)


@router.get("/followers", response_model=list[schemas.UserOut], tags=["user"])
async def get_user_followers(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = authenticate_token(token)
    username = decoded_token.get("username")
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user.followers


@router.get(
    "/following/{username}", response_model=list[schemas.UserOut], tags=["user"]
)
async def get_user_followers(
    request: Request, username: str, db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user.followers


@router.get(
    "/followers/{username}", response_model=list[schemas.UserOut], tags=["user"]
)
async def get_user_following(username: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_user_following(db=db, user_db=db_user)
