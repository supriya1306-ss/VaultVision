from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from PIL import Image
import io
import sys
import os
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# Verify key loading
api_key = os.getenv("GOOGLE_API_KEY")
if api_key and api_key != "your_actual_key_here":
    print(f"[OK] GOOGLE_API_KEY loaded: {api_key[:4]}...{api_key[-4:]}")
else:
    print("[WARNING] GOOGLE_API_KEY not set or using placeholder in backend/.env")

# Allow importing from our folders
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# VaultVision Imports
from backend.api import AnalysisResponse, MatchResult
from backend.models import Base, User, Detection
from ml.clip_engine import CLIPEngine
from ml.vector_store import VectorStore
from ml.evidence_engine import EvidenceEngine

# Database Setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres.vrtrwpwqmvofngqennnh:$tepOuts1degaut@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Global engines
clip_engine = None
vector_store = None
evidence_engine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global clip_engine, vector_store, evidence_engine
    print("Initializing VaultVision AI Engines...")
    try:
        # DB Setup check
        Base.metadata.create_all(bind=engine)
        print("Database Tables Verified")
        
        # Engine Initializations
        clip_engine = CLIPEngine()
        print("CLIP Engine Loaded")
        
        db_path = os.getenv("QDRANT_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "qdrant"))
        vector_store = VectorStore(persist_directory=db_path)
        print(f"Vector Store Initialized at {db_path}")
        
        evidence_engine = EvidenceEngine()
        print("Evidence Engine Ready")
        
        print("VaultVision API Ready!")
    except Exception as e:
        print(f"CRITICAL ERROR DURING INITIALIZATION: {e}")
        import traceback
        traceback.print_exc()
        # We don't exit(1) here so the app can at least start and show errors in logs
    yield

app = FastAPI(
    title="VaultVision: Digital Asset Protection",
    description="Real-time AI system for sports media protection.",
    lifespan=lifespan
)

# CORS Alignment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon demo flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserSync(BaseModel):
    google_id: str
    email: str
    name: str
    profile_picture: str = None

@app.post("/api/auth/google-sync")
async def sync_google_user(user_data: UserSync, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.google_id == user_data.google_id).first()
    if db_user:
        db_user.name = user_data.name
        db_user.email = user_data.email
        db_user.profile_picture = user_data.profile_picture
    else:
        db_user = User(
            google_id=user_data.google_id,
            email=user_data.email,
            name=user_data.name,
            profile_picture=user_data.profile_picture
        )
        db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"status": "success", "user_id": db_user.id}

@app.post("/api/register")
async def register_official_content(file: UploadFile = File(...)):
    """STEP 1: Register official content into the Vault."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        embedding = clip_engine.get_image_embedding(image)
        vector_store.add_asset(asset_id=file.filename, embedding=embedding)
        return {"status": "registered", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_asset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """STEP 2-4: Detect, Match, and Generate Evidence."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        embedding = clip_engine.get_image_embedding(image)
        results = vector_store.search_similar(embedding, top_k=3)
        
        matches = []
        is_protected = False
        max_confidence = 0.0
        
        if results.get('distances') and len(results['distances'][0]) > 0:
            for i in range(len(results['ids'][0])):
                # Similarity = 1 - distance (since we use cosine distance in qdrant wrapper)
                score = 1.0 - results['distances'][0][i]
                
                # Update max_confidence for ALL matches so UI shows the best match found
                max_confidence = max(max_confidence, score)
                
                if score > 0.70: # Lowered threshold from 0.85 to 0.70 for better robustness
                    is_protected = True
                
                matches.append(MatchResult(asset_id=results['ids'][0][i], score=score))
        
        # Refined Risk Levels for Hackathon Demo
        risk_level = "LOW"
        if max_confidence > 0.85: risk_level = "HIGH"
        elif max_confidence > 0.70: risk_level = "MEDIUM"
        
        message = "[ALERT] Copyright infringement detected!" if is_protected else "[SAFE] Asset is safe."
        print(f"Analysis Complete: {file.filename} | Similarity: {max_confidence:.2%} | Risk: {risk_level}")
        
        # GENERATE EVIDENCE USING GEMINI (STEP 4)
        ai_report = await evidence_engine.generate_risk_report(file.filename, max_confidence, risk_level)
        
        # SAVE TO DB (STEP 4)
        try:
            # For hackathon demo, ensure we have at least one user to satisfy foreign key
            demo_user = db.query(User).first()
            if not demo_user:
                demo_user = User(
                    google_id="demo_id",
                    email="demo@vaultvision.ai",
                    name="Demo User"
                )
                db.add(demo_user)
                db.commit()
                db.refresh(demo_user)
            
            new_detection = Detection(
                user_id=demo_user.id,
                asset_name=file.filename,
                similarity_score=max_confidence,
                risk_level=risk_level,
                ai_analysis=ai_report,
                status="ACTIONED" if is_protected else "PENDING",
                evidence_report={
                    "message": message,
                    "total_matches": len(matches),
                    "top_match_id": matches[0].asset_id if matches else None,
                    "timestamp": datetime.datetime.now().isoformat(),
                    "summary": ai_report[:200] + "..." if ai_report else "No analysis available."
                }
            )
            db.add(new_detection)
            db.commit()
            db.refresh(new_detection)
        except Exception as db_err:
            print(f"DATABASE ERROR in /api/analyze: {db_err}")
            db.rollback()
            # We don't fail the whole request if DB storage fails, so the user sees the AI result
            pass
        
        return AnalysisResponse(
            is_protected=is_protected,
            confidence=max_confidence,
            matches=matches,
            message=message,
            ai_analysis=ai_report
        )
    except Exception as e:
        print(f"GENERAL ERROR in /api/analyze: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_detection_history(db: Session = Depends(get_db)):
    """STEP 5: Dashboard Output - Fetch history."""
    detections = db.query(Detection).order_by(Detection.timestamp.desc()).all()
    return [{
        "id": d.id,
        "asset_name": d.asset_name,
        "similarity": f"{d.similarity_score:.1%}",
        "similarity_score": d.similarity_score,
        "risk_level": d.risk_level,
        "status": d.status,
        "timestamp": d.timestamp.isoformat(),
        "ai_analysis": d.ai_analysis
    } for d in detections]


@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """STEP 5: Dashboard Output - Fetch metrics."""
    try:
        total_detections = db.query(Detection).count()
        high_risk = db.query(Detection).filter(Detection.risk_level == "HIGH").count()
        
        protected_assets = 0
        if vector_store:
            protected_assets = vector_store.count()
        
        return {
            "total_protected": protected_assets,
            "total_detections": total_detections,
            "high_risk_alerts": high_risk,
            "success_rate": "99.9%" # Mock KPI
        }
    except Exception as e:
        print(f"Error in dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
