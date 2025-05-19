import os
from uuid import uuid4
import shutil
from fastapi import UploadFile


def save_uploaded_file(file: UploadFile, destination_folder: str) -> str:
    
    os.makedirs(destination_folder, exist_ok=True)

    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid4().hex}{ext}"
    file_path = os.path.join(destination_folder, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer) 

    return filename