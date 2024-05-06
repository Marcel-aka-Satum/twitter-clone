from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
from api.user import crud
from fastapi import HTTPException
from jwt import DecodeError
import jwt
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def check_user(db, username, user_id):
    user = crud.get_user(db, username)
    if not user:
        return False
    if user.id != user_id:
        return False
    return user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db, username: str, password: str):
    user = crud.get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_token(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
    try:
        decoded_token = jwt.decode(
            token,
            SECRET_KEY,  # SECRET_KEY
            algorithms=["HS256"],  # ALGORITHM
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token invalid")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Token is not a valid JWT")
    return decoded_token
