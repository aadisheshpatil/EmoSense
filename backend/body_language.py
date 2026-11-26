import os
import time
import threading

import cv2
import numpy as np
import mediapipe as mp


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "body",
    "pose_landmarker_lite.task"
)

BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
RunningMode = mp.tasks.vision.RunningMode


class BodyLanguageAnalyzer:

    def __init__(self):

        options = PoseLandmarkerOptions(
            base_options=BaseOptions(
                model_asset_path=MODEL_PATH
            ),
            running_mode=RunningMode.VIDEO,
            num_poses=1,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.detector = PoseLandmarker.create_from_options(options)

        self.previous_landmarks = None
        self.previous_timestamp = 0

        self.lock = threading.Lock()

        print("Body Language AI model loaded successfully.")

    def analyze(self, image_bytes):

        with self.lock:

            try:

                image_array = np.frombuffer(
                    image_bytes,
                    dtype=np.uint8
                )

                image = cv2.imdecode(
                    image_array,
                    cv2.IMREAD_COLOR
                )

                if image is None:
                    raise ValueError("Invalid image received.")

                rgb_image = cv2.cvtColor(
                    image,
                    cv2.COLOR_BGR2RGB
                )

                mp_image = mp.Image(
                    image_format=mp.ImageFormat.SRGB,
                    data=rgb_image
                )

                # Generate increasing VIDEO timestamps
                timestamp = time.monotonic_ns() // 1_000_000

                if timestamp <= self.previous_timestamp:
                    timestamp = self.previous_timestamp + 1

                self.previous_timestamp = timestamp

                # Detect and track pose
                results = self.detector.detect_for_video(
                    mp_image,
                    timestamp
                )

                if not results.pose_landmarks:

                    self.previous_landmarks = None

                    return {
                        "success": True,
                        "pose_detected": False,
                        "message": "No human body detected."
                    }

                landmarks = results.pose_landmarks[0]

                def point(index):

                    landmark = landmarks[index]

                    return {
                        "x": landmark.x,
                        "y": landmark.y,
                        "visibility": landmark.visibility
                    }

                # Important landmarks
                nose = point(0)

                left_shoulder = point(11)
                right_shoulder = point(12)

                left_elbow = point(13)
                right_elbow = point(14)

                left_wrist = point(15)
                right_wrist = point(16)

                left_hip = point(23)
                right_hip = point(24)

                def reliable(*points):

                    return all(
                        p["visibility"] >= 0.5
                        for p in points
                    )

                analysis = {}

                # --------------------------------
                # 1. SHOULDER ALIGNMENT
                # --------------------------------

                if reliable(left_shoulder, right_shoulder):

                    difference = (
                        left_shoulder["y"] -
                        right_shoulder["y"]
                    )

                    if difference > 0.05:
                        shoulder_status = "Right Shoulder Higher"

                    elif difference < -0.05:
                        shoulder_status = "Left Shoulder Higher"

                    else:
                        shoulder_status = "Level Shoulders"

                    analysis["shoulder_alignment"] = shoulder_status

                else:

                    analysis["shoulder_alignment"] = "Insufficient Visibility"

                # --------------------------------
                # 2. BODY POSTURE
                # --------------------------------

                if reliable(
                    left_shoulder,
                    right_shoulder,
                    left_hip,
                    right_hip
                ):

                    shoulder_center = (
                        left_shoulder["x"] +
                        right_shoulder["x"]
                    ) / 2

                    hip_center = (
                        left_hip["x"] +
                        right_hip["x"]
                    ) / 2

                    lean = shoulder_center - hip_center

                    if lean > 0.06:
                        posture = "Leaning Right"

                    elif lean < -0.06:
                        posture = "Leaning Left"

                    else:
                        posture = "Approximately Upright"

                    analysis["body_posture"] = posture

                else:

                    analysis["body_posture"] = "Insufficient Visibility"

                # --------------------------------
                # 3. ARM POSITION
                # --------------------------------

                if reliable(
                    left_shoulder,
                    right_shoulder,
                    left_elbow,
                    right_elbow,
                    left_wrist,
                    right_wrist
                ):

                    left_raised = (
                        left_wrist["y"] <
                        left_shoulder["y"] - 0.05
                    )

                    right_raised = (
                        right_wrist["y"] <
                        right_shoulder["y"] - 0.05
                    )

                    crossed = (
                        left_wrist["x"] > right_shoulder["x"]
                        and
                        right_wrist["x"] < left_shoulder["x"]
                    )

                    if crossed:
                        arm_status = "Possible Crossed Arms"

                    elif left_raised and right_raised:
                        arm_status = "Both Arms Raised"

                    elif left_raised:
                        arm_status = "Left Arm Raised"

                    elif right_raised:
                        arm_status = "Right Arm Raised"

                    else:
                        arm_status = "Arms Not Raised"

                    analysis["arm_position"] = arm_status

                else:

                    analysis["arm_position"] = "Insufficient Visibility"

                # --------------------------------
                # 4. HEAD ALIGNMENT
                # --------------------------------

                if reliable(
                    nose,
                    left_shoulder,
                    right_shoulder
                ):

                    shoulder_center = (
                        left_shoulder["x"] +
                        right_shoulder["x"]
                    ) / 2

                    head_difference = nose["x"] - shoulder_center

                    if head_difference > 0.08:
                        head_status = "Head Shifted Right"

                    elif head_difference < -0.08:
                        head_status = "Head Shifted Left"

                    else:
                        head_status = "Head Approximately Centered"

                    analysis["head_alignment"] = head_status

                else:

                    analysis["head_alignment"] = "Insufficient Visibility"

                # --------------------------------
                # 5. MOVEMENT ANALYSIS
                # --------------------------------

                current_landmarks = [
                    {
                        "x": landmark.x,
                        "y": landmark.y,
                        "visibility": landmark.visibility
                    }
                    for landmark in landmarks
                ]

                movement = {
                    "overall": "Initializing",
                    "head": "Initializing",
                    "arms": "Initializing",
                    "upper_body": "Initializing"
                }

                movement_scores = {}

                if self.previous_landmarks is not None:

                    elapsed = (
                        timestamp - self.previous_timestamp_before_update
                    ) / 1000

                    elapsed = max(elapsed, 0.001)

                    def calculate_movement(indices):

                        distances = []

                        for index in indices:

                            current = current_landmarks[index]
                            previous = self.previous_landmarks[index]

                            if (
                                current["visibility"] >= 0.5
                                and previous["visibility"] >= 0.5
                            ):

                                distance = np.sqrt(
                                    (current["x"] - previous["x"]) ** 2
                                    +
                                    (current["y"] - previous["y"]) ** 2
                                )

                                distances.append(distance / elapsed)

                        if not distances:
                            return None

                        return float(np.mean(distances))

                    def classify_movement(score):

                        if score is None:
                            return "Insufficient Visibility"

                        if score < 0.01:
                            return "Minimal"

                        elif score < 0.03:
                            return "Low"

                        elif score < 0.07:
                            return "Moderate"

                        return "High"

                    groups = {
                        "overall": list(range(33)),
                        "head": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        "arms": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                        "upper_body": [11, 12, 13, 14, 15, 16, 23, 24]
                    }

                    for name, indices in groups.items():

                        score = calculate_movement(indices)

                        movement_scores[name] = (
                            round(score, 4)
                            if score is not None
                            else None
                        )

                        movement[name] = classify_movement(score)

                self.previous_timestamp_before_update = timestamp
                self.previous_landmarks = current_landmarks

                # --------------------------------
                # 6. CONFIDENCE
                # --------------------------------

                average_visibility = float(
                    np.mean([
                        landmark.visibility
                        for landmark in landmarks
                    ])
                )

                return {
                    "success": True,
                    "pose_detected": True,
                    "total_landmarks": len(landmarks),
                    "average_visibility": round(
                        average_visibility * 100, 2
                    ),
                    "body_analysis": analysis,
                    "movement_analysis": movement,
                    "movement_scores": movement_scores
                }

            except Exception as error:

                return {
                    "success": False,
                    "error": str(error)
                }

    def close(self):
        self.detector.close()


body_analyzer = BodyLanguageAnalyzer()