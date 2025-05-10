from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import tempfile
import os

app = FastAPI()

# Allow frontend (localhost:3000) to call backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SwaraAnalysis(BaseModel):
    text: str
    expected: str
    pitch: float
    status: str

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Simulate pitch detection and swara classification
    dummy_result = [
        {"text": "tat", "expected": "Udatta", "pitch": 240.5, "status": "ok"},
        {"text": "tvam", "expected": "Anudatta", "pitch": 170.2, "status": "ok"},
        {"text": "asi", "expected": "Svarita", "pitch": 155.1, "status": "ok"}
    ]

    # Clean up temp file
    os.remove(tmp_path)

    return dummy_result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
