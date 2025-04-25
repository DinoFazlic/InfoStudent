# create_tables.py
from sqlmodel import SQLModel
from database import engine
import models





def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    print("Sve tabele su uspješno kreirane!")

if __name__ == "__main__":
    create_db_and_tables()
