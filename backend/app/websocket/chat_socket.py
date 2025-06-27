from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict
from datetime import datetime
from app.models.messages import Message
from app.database import SessionLocal  # ← koristi direktno ovo
from sqlmodel import Session

active_connections: Dict[int, WebSocket] = {}

async def websocket_chat(websocket: WebSocket, user_id: int):
    await websocket.accept()
    active_connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_json()
            receiver_id = data['receiver_id']
            content = data['message']

            # 💾 Spremi u bazu — KORISTI SessionLocal()
            with SessionLocal() as db:
                msg = Message(
                    sender_id=user_id,
                    receiver_id=receiver_id,
                    content=content,
                    timestamp=datetime.utcnow()
                )
                db.add(msg)
                db.commit()
                db.refresh(msg)
                print(f"💾 Poruka spremljena: {msg}")


            # 📤 Pošalji poruku ako je online
            receiver_ws = active_connections.get(receiver_id)
            if receiver_ws:
                await receiver_ws.send_json({
                    "sender_id": user_id,
                    "content": content
                })

    except WebSocketDisconnect:
        print(f"❌ Disconnected {user_id}")
        active_connections.pop(user_id, None)
