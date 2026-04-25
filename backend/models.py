from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from backend.database import Base

class AssetMetadata(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True) # Matches the ID in Qdrant
    filename = Column(String)
    source = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DetectionLog(Base):
    __tablename__ = "detection_logs"

    id = Column(Integer, primary_key=True, index=True)
    suspect_filename = Column(String)
    matched_asset_id = Column(String, index=True)
    similarity_score = Column(Float)
    is_protected = Column(Boolean, default=False)
    report_md = Column(Text, nullable=True) # The Gemini generated report
    created_at = Column(DateTime(timezone=True), server_default=func.now())
