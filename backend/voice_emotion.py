import json
import os

import numpy as np
import onnxruntime as ort
import soundfile as sf
from scipy.signal import resample_poly


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "voice", "model.onnx")
CONFIG_PATH = os.path.join(BASE_DIR, "models", "voice", "onnx_config.json")

TARGET_SAMPLE_RATE = 16000
MAX_AUDIO_SECONDS = 10

# Load emotion labels
with open(CONFIG_PATH, "r", encoding="utf-8") as file:
    config = json.load(file)

ID2LABEL = {
    int(key): value
    for key, value in config["id2label"].items()
}

# Load ONNX model
session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)


class VoiceEmotionRecognizer:

    def predict(self, audio_bytes):
        """
        Predict emotion from WAV audio bytes.
        Audio must contain a valid WAV recording.
        """

        try:
            import io

            audio, sample_rate = sf.read(
                io.BytesIO(audio_bytes),
                dtype="float32"
            )

            # Convert stereo audio to mono
            if audio.ndim == 2:
                audio = np.mean(audio, axis=1)

            if audio.ndim != 1 or len(audio) == 0:
                raise ValueError("Invalid or empty audio.")

            # Reject recordings longer than 10 seconds
            duration = len(audio) / sample_rate

            if duration > MAX_AUDIO_SECONDS:
                raise ValueError("Audio must be 10 seconds or shorter.")

            if duration < 0.5:
                raise ValueError("Recording is too short.")

            # Resample audio to 16 kHz
            if sample_rate != TARGET_SAMPLE_RATE:
                audio = resample_poly(
                    audio,
                    TARGET_SAMPLE_RATE,
                    sample_rate
                ).astype(np.float32)

            # Detect actual speech activity using frame-based audio energy
            frame_length = int(TARGET_SAMPLE_RATE * 0.03)  # 30 ms frames

            # Divide audio into short frames
            frames = [
                audio[i:i + frame_length]
                for i in range(0, len(audio), frame_length)
                if len(audio[i:i + frame_length]) == frame_length
            ]

            if not frames:
                raise ValueError("No speech detected. Please speak and try again.")

            # Calculate RMS energy for each frame
            frame_energies = np.array([
                np.sqrt(np.mean(frame ** 2))
                for frame in frames
            ])

            # Estimate background noise level
            noise_floor = np.percentile(frame_energies, 20)

            # Determine the threshold for active speech
            speech_threshold = max(0.008, noise_floor * 2.5)

            # Identify frames containing sufficient audio activity
            active_frames = frame_energies > speech_threshold

            active_frame_count = int(np.sum(active_frames))
            active_ratio = active_frame_count / len(frame_energies)
            print("\n--- VOICE ACTIVITY DIAGNOSTICS ---")
            print("Audio duration:", duration)
            print("Maximum amplitude:", float(np.max(np.abs(audio))))
            print("Average RMS:", float(np.sqrt(np.mean(audio ** 2))))
            print("Noise floor:", float(noise_floor))
            print("Speech threshold:", float(speech_threshold))
            print("Active frames:", active_frame_count)
            print("Total frames:", len(frame_energies))
            print("Active ratio:", round(active_ratio, 4))
            print("---------------------------------\n")

            # Require sufficient speech activity
            if active_frame_count < 10 or active_ratio < 0.05:
                raise ValueError(
                    "No clear speech detected. Please speak clearly and try again."
                )

            # Prepare model input
            input_name = session.get_inputs()[0].name
            input_values = np.expand_dims(audio, axis=0).astype(np.float32)

            # Run ONNX inference
            outputs = session.run(
                None,
                {input_name: input_values}
            )

            logits = outputs[0][0]

            # Stable softmax
            probabilities = np.exp(
                logits - np.max(logits)
            )
            probabilities = probabilities / np.sum(probabilities)

            emotion_index = int(np.argmax(probabilities))
            emotion = ID2LABEL[emotion_index]
            confidence = float(probabilities[emotion_index] * 100)

            return {
                "success": True,
                "emotion": emotion,
                "confidence": round(confidence, 2),
                "duration": round(duration, 2),
                "sample_rate": TARGET_SAMPLE_RATE
            }

        except Exception as error:
            return {
                "success": False,
                "error": str(error)
            }


voice_recognizer = VoiceEmotionRecognizer()