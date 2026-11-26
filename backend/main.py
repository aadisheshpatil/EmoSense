from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EmoSense",
    description="Multimodal Emotion Recognition System",
    version="1.0.0"
)

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to EmoSense!",
        "status": "Backend Running Successfully"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.get("/api/status")
def api_status():
    return {
        "project": "EmoSense",
        "frontend": "Connected",
        "backend": "Running",
        "message": "Frontend and Backend communication successful!"
    }



from facial_emotion import FacialEmotionRecognizer
from voice_emotion import voice_recognizer
from body_language import body_analyzer
from multimodal_fusion import multimodal_fusion as run_multimodal_fusion
from fastapi import Body, File, UploadFile
import numpy as np
import cv2

# Initialize the facial emotion recognition model
facial_model = FacialEmotionRecognizer()


@app.post("/api/facial-emotion")
async def facial_emotion(file: UploadFile = File(...)):

    contents = await file.read()

    image_array = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if frame is None:
        return {"error": "Invalid image"}

    result = facial_model.predict(frame)

    return result

@app.post("/api/voice-emotion")
async def voice_emotion(file: UploadFile = File(...)):

    audio_contents = await file.read()

    result = voice_recognizer.predict(audio_contents)

    return result


@app.post("/api/body-language")
async def body_language(file: UploadFile = File(...)):

    image_contents = await file.read()

    result = body_analyzer.analyze(image_contents)

    return result

@app.post("/api/multimodal-fusion")
async def multimodal_emotion_fusion(data: dict = Body(...)):

    face = data.get("face")
    voice = data.get("voice")
    body = data.get("body")

    result = run_multimodal_fusion(
        face=face,
        voice=voice,
        body=body
    )

    return result