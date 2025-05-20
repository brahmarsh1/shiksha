from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import whisper
from contextlib import suppress

app = FastAPI(title="Sanskrit Speech-to-Text API")

# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model once at startup
model = whisper.load_model("base")  # Try "small" or "medium" for better accuracy

@app.post("/transcribe")
async def transcribe_sanskrit(
    file: UploadFile = File(...),
    lang: str = Query(default=None, description="Set to 'sa' to force Sanskrit transcription")
):
    # Save uploaded audio to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        # Transcribe using Whisper with or without language hint
        if lang == "sa":
            result = model.transcribe(temp_path, language="sa", fp16=False)
        else:
            result = model.transcribe(temp_path, fp16=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        with suppress(Exception):
            os.remove(temp_path)

    return {"text": result.get("text", "")}
