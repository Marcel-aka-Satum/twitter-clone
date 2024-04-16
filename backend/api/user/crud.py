from sqlalchemy.orm import Session
from auth.auth import get_password_hash
from . import models, schemas


def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_id(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session):
    return db.query(models.User).all()


def create_user(db: Session, user: schemas.UserInDB):
    hashed_password = get_password_hash(user.password)  # hash the psswd
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        username=user.username,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_db: models.User, user_info: schemas.UserPatch):
    if user_info.email:
        user_db.email = user_info.email
    if user_info.username:
        user_db.username = user_info.username
    if user_info.nickname:
        user_db.nickname = user_info.nickname
    if user_info.password:
        user_db.hashed_password = get_password_hash(user_info.password)
    if user_info.avatar:
        user_db.avatar = user_info.avatar
    db.commit()
    db.refresh(user_db)
    return user_db
