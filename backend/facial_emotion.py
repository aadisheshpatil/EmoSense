import cv2
import numpy as np
import onnxruntime as ort
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

FACE_MODEL = MODEL_DIR / "face_detection_yunet_2023mar.onnx"
EMOTION_MODEL = MODEL_DIR / "facial_expression_recognition_mobilefacenet_2022july.onnx"

EMOTIONS = [
    "angry",
    "disgust",
    "fearful",
    "happy",
    "neutral",
    "sad",
    "surprised"
]

REFERENCE_POINTS = np.array([
    [38.2946, 51.6963],
    [73.5318, 51.5014],
    [56.0252, 71.7366],
    [41.5493, 92.3655],
    [70.7299, 92.2041]
], dtype=np.float32)


class FacialEmotionRecognizer:

    def __init__(self):

        if not FACE_MODEL.exists():
            raise FileNotFoundError(f"Face model not found: {FACE_MODEL}")

        if not EMOTION_MODEL.exists():
            raise FileNotFoundError(f"Emotion model not found: {EMOTION_MODEL}")

        self.detector = cv2.FaceDetectorYN.create(
            str(FACE_MODEL),
            "",
            (320, 320),
            0.6,
            0.3,
            5000
        )

        self.session = ort.InferenceSession(
            str(EMOTION_MODEL),
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name

        print("Facial Emotion Recognition initialized!")

    def predict(self, frame):

        height, width = frame.shape[:2]

        self.detector.setInputSize((width, height))

        _, faces = self.detector.detect(frame)

        if faces is None or len(faces) == 0:
            return {
                "face_detected": False,
                "emotion": None,
                "confidence": None
            }

        face = faces[0]

        landmarks = face[4:14].reshape(5, 2).astype(np.float32)

        transform, _ = cv2.estimateAffine2D(
            landmarks,
            REFERENCE_POINTS
        )

        if transform is None:
            return {
                "face_detected": True,
                "emotion": None,
                "confidence": None
            }

        aligned = cv2.warpAffine(
            frame,
            transform,
            (112, 112)
        )

        normalized = aligned.astype(np.float32) / 255.0
        normalized = (normalized - 0.5) / 0.5

        input_tensor = np.transpose(
            normalized,
            (2, 0, 1)
        )

        input_tensor = np.expand_dims(
            input_tensor,
            axis=0
        ).astype(np.float32)

        output = self.session.run(
            [self.output_name],
            {self.input_name: input_tensor}
        )[0][0]

        probabilities = np.exp(
            output - np.max(output)
        )

        probabilities /= np.sum(probabilities)

        emotion_index = int(np.argmax(probabilities))

        return {
            "face_detected": True,
            "emotion": EMOTIONS[emotion_index],
            "confidence": round(
                float(probabilities[emotion_index]) * 100,
                2
            )
        }