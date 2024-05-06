from . import schemas
from . import auth as auth
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter, Response, Request
from sqlalchemy.orm import Session
from database.database import get_db
from auth.auth import authenticate_user, create_access_token, check_user
from datetime import timedelta
from auth.auth import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()


@router.get("/validate", response_model=schemas.Validate, tags=["auth"])
async def validate_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    decoded_token = auth.authenticate_token(token)
    username = decoded_token.get("username")
    user_id = decoded_token.get("user_id")
    db_user = check_user(db, username, user_id)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid user")
    return {"authenticated": True, "user_id": user_id, "username": username}


@router.post("/token", response_model=schemas.TokenOut, tags=["auth"])
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
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"user": user.as_dict()},
    }


@router.post("/logout", tags=["auth"])
async def logout(response: Response, request: Request):
    cookie = request.cookies.get("access_token")
    if not cookie:
        raise HTTPException(status_code=401, detail="Token is missing")
    response.delete_cookie(key="access_token")
    return {"message": "Logged out"}
