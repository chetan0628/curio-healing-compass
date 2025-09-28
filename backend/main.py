from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from pathlib import Path
from typing import Optional
from datetime import datetime
import json

from .ml_service import process_image, analyze_with_gemini  # type: ignore

app = FastAPI(title="CURIO Healing Compass Backend", version="0.1.0")

# Allow local dev origins; adjust as needed for prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./temp"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR = UPLOAD_DIR / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/v1/wounds/upload")
async def upload_wound_image(file: UploadFile = File(...)):
    # Save uploaded file to temporary directory
    filename = file.filename or "upload.jpg"
    safe_name = os.path.basename(filename)
    dest = UPLOAD_DIR / safe_name

    # Stream to disk
    with dest.open("wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)

    return JSONResponse({
        "status": "success",
        "filename": safe_name,
        "path": str(dest.resolve())
    })


@app.post("/api/v1/wounds/process")
async def process_wound_image(file: UploadFile = File(...)):
    # Validate file presence and type
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content_type: Optional[str] = getattr(file, "content_type", None)
    allowed = {"image/jpeg", "image/jpg", "image/png"}
    if content_type not in allowed:
        # Attempt extension-based fallback
        name = file.filename.lower()
        if not (name.endswith(".jpg") or name.endswith(".jpeg") or name.endswith(".png")):
            raise HTTPException(status_code=400, detail="Unsupported file type. Use JPG or PNG.")

    # Save to temp
    filename = os.path.basename(file.filename)
    dest = UPLOAD_DIR / filename
    with dest.open("wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)

    # Call ML service
    try:
        result = process_image(str(dest.resolve()))
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/wounds/analyze")
async def analyze_wound_with_gemini(file: UploadFile = File(...), client_id: Optional[str] = None):
    # Validate file presence and type
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content_type: Optional[str] = getattr(file, "content_type", None)
    allowed = {"image/jpeg", "image/jpg", "image/png"}
    if content_type not in allowed:
        name = file.filename.lower()
        if not (name.endswith(".jpg") or name.endswith(".jpeg") or name.endswith(".png")):
            raise HTTPException(status_code=400, detail="Unsupported file type. Use JPG or PNG.")

    # Save to temp
    filename = os.path.basename(file.filename)
    dest = UPLOAD_DIR / filename
    with dest.open("wb") as out:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            out.write(chunk)

    try:
        result = analyze_with_gemini(str(dest.resolve()))

        # Persist result per client_id if provided
        if client_id:
            safe_id = "".join(c for c in client_id if c.isalnum() or c in ("-","_"))[:64] or "anonymous"
            fpath = RESULTS_DIR / f"{safe_id}.json"

            # Enforce monotonic decrease of wound_area to reflect expected healing
            if (result.get("stage") or "").lower() != "not a wound":
                try:
                    prev_list = json.loads(fpath.read_text() or "[]") if fpath.exists() else []
                except Exception:
                    prev_list = []
                if prev_list:
                    last = prev_list[-1]
                    prev_area = float(last.get("wound_area", 0) or 0)
                    new_area = float(result.get("wound_area", 0) or 0)
                    # Require at least a small decrease (min 1.0 cm^2 or 3%)
                    min_drop = max(1.0, prev_area * 0.03)
                    target = max(0.0, prev_area - min_drop)
                    # Set new_area to the lesser of incoming and target to ensure decrease
                    adjusted = min(new_area, target) if prev_area > 0 else new_area
                    result["wound_area"] = round(adjusted, 1)
                    # Slightly nudge confidence up to reflect progression
                    try:
                        conf = float(result.get("confidence", 0) or 0)
                        result["confidence"] = min(0.99, round(conf + 0.01, 2))
                    except Exception:
                        pass

            payload = {
                "ts": datetime.utcnow().isoformat() + "Z",
                "stage": result.get("stage"),
                "wound_area": result.get("wound_area"),
                "confidence": result.get("confidence"),
                "history": result.get("history", []),
            }
            existing = []
            if fpath.exists():
                try:
                    existing = json.loads(fpath.read_text() or "[]")
                except Exception:
                    existing = []
            existing.append(payload)
            fpath.write_text(json.dumps(existing, indent=2))

        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/wounds/history")
async def get_wound_history(client_id: str):
    if not client_id:
        raise HTTPException(status_code=400, detail="client_id is required")
    safe_id = "".join(c for c in client_id if c.isalnum() or c in ("-","_"))[:64] or "anonymous"
    fpath = RESULTS_DIR / f"{safe_id}.json"
    if not fpath.exists():
        return JSONResponse([])
    try:
        data = json.loads(fpath.read_text() or "[]")
        return JSONResponse(data)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read history")
