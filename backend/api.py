from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from PIL import Image
import io

# Import internal services
from backend.ml_service import ml_service
from backend.vector_store import vector_store
from backend.report_service import report_service
from backend.database import get_db
from backend.models import AssetMetadata, DetectionLog

router = APIRouter()

class MatchResult(BaseModel):
    asset_id: str
    similarity: float

class AnalysisResponse(BaseModel):
    is_protected: bool
    confidence: float
    matches: List[MatchResult]
    report_md: Optional[str] = None

@router.post("/register")
async def register_asset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a new official asset to Qdrant vector database and saves metadata to PostgreSQL."""
    try:
        # Read uploaded image bytes
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Extract features (CLIP)
        embedding = ml_service.get_image_embedding(image)
        
        # Store in Qdrant Vector DB
        asset_id = file.filename
        vector_store.add_asset(asset_id, embedding, metadata={"source": "official_upload"})
        
        # Store metadata in PostgreSQL if DB is configured
        if db:
            db_asset = AssetMetadata(
                asset_id=asset_id,
                filename=file.filename,
                source="official_upload"
            )
            db.add(db_asset)
            db.commit()
            db.refresh(db_asset)
        
        return {"status": "success", "asset": asset_id, "message": f"Asset {asset_id} legally mapped and protected."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect", response_model=AnalysisResponse)
async def detect_suspicious(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a suspect image, compares, triggers Gemini, and logs to PostgreSQL."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Extract features of the suspect image
        embedding = ml_service.get_image_embedding(image)
        
        # Check Vector Database for matches
        results = vector_store.search_similar(embedding, top_k=1)
        
        matches = []
        is_protected = False
        max_confidence = 0.0
        report_md = None
        matched_asset_id = None
        
        if results:
            top_match = results[0]
            similarity = top_match["score"]
            matched_asset_id = top_match["asset_id"]
            
            matches.append(MatchResult(asset_id=matched_asset_id, similarity=similarity))
            
            # If 85% or higher similarity, alert!
            if similarity >= 0.85:
                is_protected = True
                max_confidence = similarity
                
                # Trigger Evidence Engine
                report_md = report_service.generate_risk_report(
                    matched_asset_id=matched_asset_id,
                    similarity=similarity
                )
                
        # Store log in PostgreSQL if DB is configured
        if db:
            db_log = DetectionLog(
                suspect_filename=file.filename,
                matched_asset_id=matched_asset_id,
                similarity_score=max_confidence,
                is_protected=is_protected,
                report_md=report_md
            )
            db.add(db_log)
            db.commit()
            db.refresh(db_log)

        return AnalysisResponse(
            is_protected=is_protected,
            confidence=max_confidence,
            matches=matches,
            report_md=report_md
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
