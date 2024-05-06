from api.user import crud
from api.user import schemas
from database.database import SessionLocal

users = [
    {
        "username": "user1",
        "email": "user1@example.com",
        "password": "Password1#",
        "confirm_password": "Password1#",
    },
    {
        "username": "user2",
        "email": "user2@example.com",
        "password": "Jan12345!",
        "confirm_password": "Jan12345!",
    },
    {
        "username": "user3",
        "email": "user3@example.com",
        "password": "Password3#",
        "confirm_password": "Password3#",
    },
    {
        "username": "user4",
        "email": "user4@example.com",
        "password": "Password4#",
        "confirm_password": "Password4#",
    },
    {
        "username": "user5",
        "email": "user5@example.com",
        "password": "Password5#",
        "confirm_password": "Password5#",
    },
    {
        "username": "user6",
        "email": "user6@example.com",
        "password": "Password6#",
        "confirm_password": "Password6#",
    },
    {
        "username": "user7",
        "email": "user7@example.com",
        "password": "Password7#",
        "confirm_password": "Password7#",
    },
    {
        "username": "user8",
        "email": "user8@example.com",
        "password": "Password8#",
        "confirm_password": "Password8#",
    },
    {
        "username": "user9",
        "email": "user9@example.com",
        "password": "Password9#",
        "confirm_password": "Password9#",
    },
    {
        "username": "user10",
        "email": "user10@example.com",
        "password": "Password10#",
        "confirm_password": "Password10#",
    },
]


def create_all_fake_users():
    db = SessionLocal()
    for user in users:
        serialized_user = schemas.UserInDB(**user)
        crud.create_user(db, serialized_user)
