from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
import uuid

class VectorStore:
    def __init__(self):
        # Using memory storage for MVP local testing. 
        # Swap with cloud credentials when ready: QdrantClient(url="...", api_key="...")
        self.client = QdrantClient(":memory:")
        self.collection_name = "vaultvision_assets"
        
        # OpenAI CLIP base model outputs 512 dimensional vectors
        if not self.client.collection_exists(collection_name=self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=512, distance=Distance.COSINE),
            )

    def add_asset(self, asset_id: str, embedding: list[float], metadata: dict = None):
        """Insert an embedding vector into Qdrant database."""
        vector_id = str(uuid.uuid4())
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(
                    id=vector_id,
                    vector=embedding,
                    payload={"asset_id": asset_id, **(metadata or {})}
                )
            ]
        )
        return vector_id

    def search_similar(self, embedding: list[float], top_k: int = 3):
        """Query Qdrant database for matching assets."""
        # qdrant-client >= 1.7: use query_points() instead of deprecated search()
        response = self.client.query_points(
            collection_name=self.collection_name,
            query=embedding,
            limit=top_k,
            with_payload=True,
        )
        
        results = []
        for hit in response.points:
            results.append({
                "asset_id": hit.payload.get("asset_id", "Unknown"),
                "score": hit.score  # Cosine similarity score (1.0 is exact match)
            })
        return results

# Singleton database instance
vector_store = VectorStore()
