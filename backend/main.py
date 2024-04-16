from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import create_all_tables
from api.user.routes import router as user_router
from api.post.routes import router as post_router
from auth.routes import router as auth_router
from fastapi import Request
import uvicorn
import time
from fastapi.staticfiles import StaticFiles

create_all_tables()
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(user_router, prefix="/api/v1")
app.include_router(post_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

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


# Add your custom middleware function
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
