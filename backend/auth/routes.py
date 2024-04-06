from . import schemas
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter, Response
from sqlalchemy.orm import Session
from database.database import get_db
from auth.auth import authenticate_user, create_access_token
from datetime import timedelta
from auth.auth import ACCESS_TOKEN_EXPIRE_MINUTES


router = APIRouter()


@router.post("/token", response_model=schemas.TokenOut)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"username": user.username, "user_id": user.id},
        expires_delta=access_token_expires,
    )
    response.set_cookie(key="acces_token", value=access_token, httponly=True)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"user": user.as_dict()},
    }
