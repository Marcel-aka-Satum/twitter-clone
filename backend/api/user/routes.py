from fastapi import Depends, HTTPException, APIRouter, UploadFile, File
from sqlalchemy.orm import Session
from . import schemas, crud
from database.database import get_db
import os


router = APIRouter()


@router.post("/user/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.patch("/user/{user_id}", response_model=schemas.UserOut)
def update_user(user: schemas.UserPatch, user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db=db, user_db=db_user, user_info=user)


@router.get("/user/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/uploadavatar/")
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
