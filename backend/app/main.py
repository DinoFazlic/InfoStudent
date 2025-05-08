from fastapi import FastAPI
from sqlmodel import SQLModel
from app.routes import auth
from app import models,database
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # You can use ["*"] for all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "InfoStudent is running!"}

SQLModel.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])