from database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Database connected successfully!")
        print("Result:", result.scalar())
except Exception as e:
    print("Failed to connect to the database.")
    print("Error:", e)
