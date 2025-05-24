import os
import uuid
import pdfplumber

SCHEDULE_UPLOAD_FOLDER = "schedule_uploads"

def save_uploaded_file(file, folder=SCHEDULE_UPLOAD_FOLDER) -> str:
    if not os.path.exists(folder):
        os.makedirs(folder)
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(folder, filename)
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    return filename

def extract_text_from_pdf(path: str) -> str:
    all_text = []

    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            print(f"\n--- Page {i+1} ---")
            text = page.extract_text()
            if text:
                for line in text.splitlines():
                    print(line) 
                    all_text.append(line)
            else:
                print("No text found on this page.")

    return "\n".join(all_text)
