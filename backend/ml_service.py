import os
import json
import base64
from pathlib import Path
from typing import Dict, Any
import httpx

ML_API_URL = os.getenv("ML_API_URL", "https://example-ml-api.com/predict")
ML_API_KEY = os.getenv("ML_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

def process_image(file_path: str) -> Dict[str, Any]:
    """
    Sends the image at file_path to an external ML API and returns predictions.
    Expects environment variable ML_API_KEY to be set. Uses ML_API_URL if provided.
    """
    # If no API key is configured, return a mocked response for local dev.
    if not ML_API_KEY:
        # Mocked example payload
        return {
            "stage": "granulation",
            "wound_area": 32.5,
            "confidence": 0.94,
            "history": [
                {"day": 1, "area": 45.2},
                {"day": 2, "area": 40.8},
                {"day": 3, "area": 32.5},
            ],
        }

    file = Path(file_path)
    if not file.exists():
        raise FileNotFoundError(f"Image not found: {file_path}")

    headers = {
        "Authorization": f"Bearer {ML_API_KEY}",
    }

    # Adjust field name and format to match your ML API contract
    files = {"file": (file.name, file.open("rb"), "application/octet-stream")}

    try:
        with httpx.Client(timeout=60.0) as client:
            resp = client.post(ML_API_URL, headers=headers, files=files)
            resp.raise_for_status()
            data = resp.json()
            # Normalize to expected schema if needed
            # Assuming ML returns same structure already
            return {
                "stage": data.get("stage", "unknown"),
                "wound_area": float(data.get("wound_area", 0.0)),
                "confidence": float(data.get("confidence", 0.0)),
                "history": data.get("history", []),
            }
    except httpx.HTTPError as e:
        raise RuntimeError(f"ML API request failed: {e}")


def analyze_with_gemini(file_path: str) -> Dict[str, Any]:
    """
    Sends an image to Google Gemini for wound analysis using a structured prompt.
    Returns a JSON dict with keys: stage, wound_area, confidence, history[] if available.
    If the image is not a wound or no API key is provided, returns a safe default.
    """
    # Fallback mock when no key is configured
    if not GEMINI_API_KEY:
        return {
            "stage": "granulation",
            "wound_area": 28.4,
            "confidence": 0.91,
            "history": [
                {"day": 1, "area": 50.0},
                {"day": 2, "area": 40.0},
                {"day": 3, "area": 28.4},
            ],
        }

    img_path = Path(file_path)
    if not img_path.exists():
        raise FileNotFoundError(f"Image not found: {file_path}")

    # Read and base64 encode
    mime = "image/jpeg"
    if img_path.suffix.lower() == ".png":
        mime = "image/png"
    b64 = base64.b64encode(img_path.read_bytes()).decode("utf-8")

    # Gemini generateContent endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    prompt_text = (
        "Analyze this image. If it is a wound, return JSON with stage, wound_area, confidence, "
        "and a healing history array. If it is not a wound, return { \"stage\": \"not a wound\" }."
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text},
                    {
                        "inline_data": {
                            "mime_type": mime,
                            "data": b64,
                        }
                    },
                ]
            }
        ]
    }

    try:
        with httpx.Client(timeout=60.0) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            # Gemini returns candidates with content.parts[].text
            candidates = data.get("candidates", [])
            if not candidates:
                return {"stage": "not a wound"}
            text = ""
            for part in candidates[0].get("content", {}).get("parts", []):
                if "text" in part:
                    text += part["text"]
            text = text.strip()
            # Try to parse JSON from the text
            try:
                parsed = json.loads(text)
                # Normalize minimal fields
                if "stage" not in parsed:
                    parsed["stage"] = "unknown"
                return parsed
            except json.JSONDecodeError:
                # If not JSON, fallback
                return {"stage": "not a wound"}
    except httpx.HTTPError as e:
        raise RuntimeError(f"Gemini API request failed: {e}")
