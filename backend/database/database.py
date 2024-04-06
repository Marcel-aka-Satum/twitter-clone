from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PSSWD = os.getenv("DB_PSSWD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

SQLALCHEMY_DATABASE_URL = "postgresql://{DB_USER}:{DB_PSSWD}@{DB_HOST}/{DB_NAME}"  # change this to your own database url

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_user_tables():
    from api.user import models

    models.Base.metadata.create_all(bind=engine)


def create_post_tables():
    from api.post import models

    models.Base.metadata.create_all(bind=engine)


def create_all_tables():
    create_user_tables()
    create_post_tables()
