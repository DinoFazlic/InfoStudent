from pydantic import BaseModel

class JobApplicationCreate(BaseModel):
    job_id: int
    cv_url: str
