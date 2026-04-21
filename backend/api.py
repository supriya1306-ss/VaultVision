from pydantic import BaseModel
from typing import List

class MatchResult(BaseModel):
    asset_id: str
    score: float

class AnalysisResponse(BaseModel):
    is_protected: bool
    confidence: float
    matches: List[MatchResult]
    message: str
