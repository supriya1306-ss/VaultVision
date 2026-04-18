from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from PIL import Image
import io

# Import internal services
from backend.ml_service import ml_service
from backend.vector_store import vector_store
from backend.report_service import report_service

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
async def register_asset(file: UploadFile = File(...)):
    """Uploads a new official asset to Qdrant vector database."""
    try:
        # Read uploaded image bytes
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Extract features (CLIP)
        embedding = ml_service.get_image_embedding(image)
        
        # Store in Qdrant Vector DB
        asset_id = file.filename
        vector_store.add_asset(asset_id, embedding, metadata={"source": "official_upload"})
        
        return {"status": "success", "asset": asset_id, "message": f"Asset {asset_id} legally mapped and protected."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect", response_model=AnalysisResponse)
async def detect_suspicious(file: UploadFile = File(...)):
    """Uploads a suspect image, compares, and triggers Gemini if > 85% match."""
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
        
        if results:
            top_match = results[0]
            similarity = top_match["score"]
            asset_id = top_match["asset_id"]
            
            matches.append(MatchResult(asset_id=asset_id, similarity=similarity))
            
            # If 85% or higher similarity, alert!
            if similarity >= 0.85:
                is_protected = True
                max_confidence = similarity
                
                # Trigger Evidence Engine
                report_md = report_service.generate_risk_report(
                    matched_asset_id=asset_id,
                    similarity=similarity
                )

        return AnalysisResponse(
            is_protected=is_protected,
            confidence=max_confidence,
            matches=matches,
            report_md=report_md
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
