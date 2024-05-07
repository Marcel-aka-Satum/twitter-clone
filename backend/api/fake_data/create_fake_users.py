from api.user import crud
from api.user import schemas
from database.database import SessionLocal
from api.post import crud as post_crud
from api.feed import crud as feed_crud

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
        "password": "Password2#",
        "confirm_password": "Password2#",
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
]

posts = [
    {
        "message": "Hello, World! This is my first post!",
        "owner_id": 1,
        "created_on": "2024-01-01 00:00:00",
        "files": None,
        "scheduled_time": None,
    },
    {
        "message": "Just finished a great book! #booklover",
        "owner_id": 2,
        "created_on": "2024-02-01 00:00:00",
        "files": None,
        "scheduled_time": None,
    },
    {
        "message": "Enjoying a beautiful sunset. #nature",
        "owner_id": 3,
        "created_on": "2024-03-01 00:00:00",
        "files": None,
        "scheduled_time": None,
    },
    {
        "message": "Excited for the weekend! #TGIF",
        "owner_id": 4,
        "created_on": "2024-04-01 00:00:00",
        "files": None,
        "scheduled_time": None,
    },
    {
        "message": "Working on a new project. #coding",
        "owner_id": 5,
        "created_on": "2024-05-01 00:00:00",
        "files": None,
        "scheduled_time": None,
    },
    {
        "message": "Morning run to start the day. #fitness",
        "owner_id": 6,
        "created_on": "2024-05-07 11:44:00",
        "files": None,
        "scheduled_time": None,
    },
    {
        "message": "Trying out a new recipe. #foodie",
        "owner_id": 7,
        "created_on": "2024-05-07 08:30:00",
        "files": None,
        "scheduled_time": None,
    },
]


def create_global_feed():
    db = SessionLocal()
    feed_crud.create_feed(db, "global")


def create_all_fake_users():
    db = SessionLocal()

    for user in users:
        serialized_user = schemas.UserInDB(**user)
        crud.create_user(db, serialized_user)

    for post in posts:
        post_crud.create_post(
            db,
            post["message"],
            post["owner_id"],
            post["created_on"],
            post["files"],
            post["scheduled_time"],
        )
