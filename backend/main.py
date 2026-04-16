from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from PIL import Image
import io
import sys
import os

# Allow importing from our 'ml' folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.api import AnalysisResponse, MatchResult
from ml.clip_engine import CLIPEngine
from ml.vector_store import VectorStore

# Global variables for our ML engines
clip_engine = None
vector_store = None

# This runs exactly once when you start the server
@asynccontextmanager
async def lifespan(app: FastAPI):
    global clip_engine, vector_store
    print("Starting up ML Engines...")
    clip_engine = CLIPEngine()
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "chromadb")
    vector_store = VectorStore(persist_directory=db_path)
    print("API Server Ready!")
    yield

app = FastAPI(title="VaultVision API", lifespan=lifespan)

# Ensure Next.js (port 3000) can talk to FastAPI (port 8000) without getting blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_asset(file: UploadFile = File(...)):
    """Analyze a dragged-and-dropped image to check for copyright infringements."""
    try:
        # 1. Read the uploaded image from the frontend
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # 2. Extract the embeddings
        embedding = clip_engine.get_image_embedding(image)
        
        # 3. Query ChromaDB for closest matches
        results = vector_store.search_similar(embedding, top_k=3)
        
        matches = []
        is_protected = False
        max_confidence = 0.0
        
        # 4. Math calculation: ChromaDB returns "Distance" (0 is exact match, 1 is no match)
        # We convert it to "Similarity" score (0% to 100%)
        if results.get('distances') and len(results['distances'][0]) > 0:
            for i in range(len(results['ids'][0])):
                distance = results['distances'][0][i]
                similarity = 1.0 - distance
                
                # If similarity is above 85%, flag it as stolen/protected!
                if similarity > 0.85:
                    is_protected = True
                    max_confidence = max(max_confidence, similarity)
                
                matches.append(MatchResult(
                    asset_id=results['ids'][0][i],
                    score=similarity
                ))
        
        message = "Copyright infringement detected!" if is_protected else "Asset is safe. No infringements detected."
        
        return AnalysisResponse(
            is_protected=is_protected,
            confidence=max_confidence,
            matches=matches,
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Starts the local server
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
