from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import create_all_tables
from api.user.routes import router as user_router
from api.post.routes import router as post_router
from auth.routes import router as auth_router
from api.feed.routes import router as feed_router
from fastapi import Request
import uvicorn
import time
from fastapi.staticfiles import StaticFiles
from apscheduler.schedulers.background import BackgroundScheduler
from api.post.crud import publish_scheduled_posts
from api.fake_data.create_fake_users import create_all_fake_users, create_global_feed


create_all_tables()
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(user_router, prefix="/api/v1")
app.include_router(post_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(feed_router, prefix="/api/v1")

origins = [
    "http://localhost",
    "http://localhost:3000",
]

# middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


if __name__ == "__main__":
    # Start the background scheduler for publishing scheduled posts
    scheduler = BackgroundScheduler()
    scheduler.add_job(publish_scheduled_posts, "interval", seconds=10)
    scheduler.start()
    # Create the global feed for all posts
    create_global_feed()

    # Create fake users for testing (run this only once then comment out)
    # create_all_fake_users()

    uvicorn.run(app, host="0.0.0.0", port=8000)
