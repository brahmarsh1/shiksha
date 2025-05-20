from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import whisper

app = FastAPI(title="Sanskrit Speech-to-Text API")

# Allow frontend running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Whisper model once at startup
model = whisper.load_model("base")  # Options: tiny, base, small, medium, large

@app.post("/transcribe")
async def transcribe_sanskrit(file: UploadFile = File(...)):
    # Save uploaded audio to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    # Transcribe the Sanskrit audio
    result = model.transcribe(temp_path, language="sa")

    # Clean up
    os.remove(temp_path)

    return {"text": result["text"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
