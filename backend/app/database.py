from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,         # ⚡️ provjera prije svakog query-a
    pool_recycle=1800,          # ⚡️ recikliraj konekciju nakon 30 min
    pool_size=10,               # (ili manje/više po potrebi)
    max_overflow=20,            # dodatni burst konekcija
)



SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
