from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from sqlmodel import SQLModel
from app.routes import auth, profile, review_router
from app import models,database
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.controllers import messages_controller
from app.websocket.chat_socket import websocket_chat

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # dozvoli frontend
    allow_credentials=True,  # potreban za cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "InfoStudent is running!"}


os.makedirs("app/static/profile_photos", exist_ok=True)
os.makedirs("app/static/cv_uploads", exist_ok=True)
os.makedirs("app/static/schedule_uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

SQLModel.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/users", tags=["profile"])
app.include_router(messages_controller.router, prefix="/api/messages", tags=["messages"])

active_connections: dict[int, WebSocket] = {}

@app.websocket("/ws/{user_id}")
async def ws_route(websocket: WebSocket, user_id: int):
    await websocket_chat(websocket, user_id)
app.include_router(review_router.router)

