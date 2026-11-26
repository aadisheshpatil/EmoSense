EMOTION_WEIGHTS = {
    "face": 0.55,
    "voice": 0.45
}

VALID_EMOTIONS = {
    "angry",
    "disgust",
    "fearful",
    "happy",
    "neutral",
    "sad",
    "surprised"
}


def normalize_emotion(emotion):

    if not emotion:
        return None

    emotion = emotion.lower().strip()

    aliases = {
        "calm": "neutral",
        "fear": "fearful",
        "surprise": "surprised"
    }

    emotion = aliases.get(emotion, emotion)

    if emotion not in VALID_EMOTIONS:
        return None

    return emotion


def multimodal_fusion(face, voice, body):

    predictions = []

    # Facial prediction
    if face and face.get("face_detected"):

        emotion = normalize_emotion(face.get("emotion"))

        confidence = face.get("confidence")

        if emotion and confidence is not None:

            confidence = float(confidence)

            if 0 <= confidence <= 100:

                predictions.append({
                    "modality": "face",
                    "emotion": emotion,
                    "confidence": confidence,
                    "weight": EMOTION_WEIGHTS["face"]
                })

    # Voice prediction
    if voice and voice.get("success"):

        emotion = normalize_emotion(voice.get("emotion"))

        confidence = voice.get("confidence")

        if emotion and confidence is not None:

            confidence = float(confidence)

            if 0 <= confidence <= 100:

                predictions.append({
                    "modality": "voice",
                    "emotion": emotion,
                    "confidence": confidence,
                    "weight": EMOTION_WEIGHTS["voice"]
                })

    # No valid emotion predictions
    if not predictions:

        return {
            "success": False,
            "message": "No valid emotion predictions available.",
            "final_emotion": None,
            "confidence": None,
            "contributing_modalities": [],
            "body_language_context": body
        }

    # Calculate weighted emotion scores
    emotion_scores = {}

    total_weight = sum(
        prediction["weight"]
        for prediction in predictions
    )

    for prediction in predictions:

        emotion = prediction["emotion"]

        score = (
            prediction["weight"] *
            prediction["confidence"]
        )

        emotion_scores[emotion] = (
            emotion_scores.get(emotion, 0) + score
        )

    # Select final emotion
    final_emotion = max(
        emotion_scores,
        key=emotion_scores.get
    )

    # Calculate confidence estimate
    final_score = emotion_scores[final_emotion]

    final_confidence = final_score / total_weight

    # Identify agreement
    predicted_emotions = [
        prediction["emotion"]
        for prediction in predictions
    ]

    agreement = len(set(predicted_emotions)) == 1

    return {
        "success": True,
        "final_emotion": final_emotion,
        "confidence": round(final_confidence, 2),
        "agreement": agreement,
        "contributing_modalities": predictions,
        "emotion_scores": {
            emotion: round(score / total_weight, 2)
            for emotion, score in emotion_scores.items()
        },
        "body_language_context": body,
        "fusion_method": "Weighted Facial and Voice Emotion Fusion"
    }