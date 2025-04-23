from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 Add this block BEFORE defining your routes!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # You can use ["*"] for all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Info Student is running!"}

@app.get("/users/student_profile")
def get_student_profile():
    return {
        "first_name": "Robert",
        "last_name": "Marić",
        "email": "robert@student.pmf.unsa.ba",
        "biography": "I am a math student...",
        "skills": ["python", "react"],
        "experience": "Worked on cool projects!"
    }
