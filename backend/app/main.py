from fastapi import FastAPI
from app.routes import auth
from app import models,database
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()  

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,   
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Info Student is running!"}

models.Base.metadata.create_all(bind=database.engine)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])