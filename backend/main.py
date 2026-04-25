from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.api import router
from backend.database import engine, Base
import backend.models  # Import models so Base knows about them!

# Create database tables if they don't exist
if engine:
    try:
        Base.metadata.create_all(bind=engine)
        print("Successfully checked/created database tables.")
    except Exception as e:
        print(f"Warning: Could not create tables: {e}")

app = FastAPI(
    title="VaultVision API",
    description="VaultVision MVP Backend",
    version="1.0.0"
)

# Allow Next.js frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    message: str

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok", message="VaultVision API is running.")

# Include the endpoints for register/detect
app.include_router(router, prefix="/api", tags=["core"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
