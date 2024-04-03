from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_id(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()

def get_post_by_id(db: Session, id: int):
    return db.query(models.Post).filter(models.Post.id == id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_user_posts(db: Session, user: models.User) -> list[models.Post]:
    return user.posts


from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return pwd_context.hash(password)


def create_user(db: Session, user: schemas.UserInDB):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        username=user.username,
        is_active=user.is_active,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_post(db: Session, post: schemas.Post):
    user = db.query(models.User).filter(models.User.id == post.owner_id).first()
    db_post = models.Post(
        id=post.id, message=post.message, owner_id=post.owner_id, likes=0,user=user
    )
    user.posts.append(db_post)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def like_post(db: Session, post: schemas.Post):
    user = db.query(models.User).filter(models.User.id == post.owner_id).first()
    db_post = get_post_by_id(db, id=post.id)
    db_post.liked_by.append(user)
    db_post.likes = len(db_post.liked_by)
    return db_post
