from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from sqlmodel import SQLModel
from app.routes import auth, profile
from app import models, database
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware
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


SQLModel.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/auth", tags=["profile"])
app.include_router(messages_controller.router, prefix="/api/messages", tags=["messages"])

active_connections: dict[int, WebSocket] = {}

@app.websocket("/ws/{user_id}")
async def ws_route(websocket: WebSocket, user_id: int):
    await websocket_chat(websocket, user_id)
