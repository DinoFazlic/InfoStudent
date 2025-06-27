from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel
import os
from dotenv import load_dotenv

from app import models             
from app.database import engine
from app.routes.job_router import router as job_router
from app.routes import auth, profile, review_router, avatar_test
from app.routes.instruction_router import router as instruction_router
from app.controllers.messages_controller import router as messages_router
from app.websocket.chat_socket import websocket_chat
from app.routes.internship_router import router as internship_router
from app.routes import job_application_router
from app.routes import job_saves_router
# (imported later after environment variables are loaded)
from app.controllers import ai_controller, application_controller  # imported after env is loaded
from app.routes.internship_application_router import router as internship_application_router
from app.routes.internship_save_router import router as internship_save_router
from app.routes import instruction_save_router
from app.routes.application_router import router as application_router

# Load env as early as possible
load_dotenv()

app = FastAPI()



# ───── CORS ───────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───── ROOT ───────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "InfoStudent is running!"}

# ───── DIREKTORIJ ZA PRIVATNE FAJLOVE ─────────────────────────────────────────
os.makedirs("app/static/profile_photos", exist_ok=True)
os.makedirs("app/static/cv_uploads", exist_ok=True)
os.makedirs("app/static/schedule_uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ───── KREIRANJE SVIH TABLICA ─────────────────────────────────────────────────

#SQLModel.metadata.create_all(bind=engine)

# ───── WEBSOCKET ZA CHAT ──────────────────────────────────────────────────────
active_connections: dict[int, WebSocket] = {}

@app.websocket("/ws/{user_id}")
async def ws_route(websocket: WebSocket, user_id: int):
    await websocket_chat(websocket, user_id)

# ───── REGISTRACIJA ROUTERA ───────────────────────────────────────────────────
app.include_router(messages_router, prefix="/api/messages", tags=["messages"])
app.include_router(auth.router,    prefix="/auth",        tags=["auth"])
app.include_router(profile.router, prefix="/users",       tags=["profile"])
app.include_router(review_router.router)
app.include_router(avatar_test.router)
app.include_router(instruction_router)
app.include_router(job_router)
app.include_router(internship_router)
app.include_router(job_application_router.router)
app.include_router(job_saves_router.router)
app.include_router(ai_controller.router)
# from app.controllers import ai_controller, application_controller
app.include_router(internship_application_router)
app.include_router(internship_save_router)
app.include_router(instruction_save_router.router)
app.include_router(application_router)
