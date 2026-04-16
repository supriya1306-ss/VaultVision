import chromadb
import os

class VectorStore:
    def __init__(self, persist_directory="../data/chromadb"):
        os.makedirs(persist_directory, exist_ok=True)
        # Initialize chroma db
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # We create a collection (like a table) using cosine similarity
        self.collection = self.client.get_or_create_collection(
            name="protected_assets",
            metadata={"hnsw:space": "cosine"}
        )
        
    def add_asset(self, asset_id: str, embedding: list, metadata: dict = None):
        """Adds a single image embedding to the database"""
        self.collection.add(
            embeddings=[embedding],
            metadatas=[metadata] if metadata else [{}],
            ids=[asset_id]
        )
        
    def search_similar(self, query_embedding: list, top_k: int = 3):
        """Searches the database for similar images"""
        if self.collection.count() == 0:
            return {"distances": [[]], "ids": [[]], "metadatas": [[]]}

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, self.collection.count())
        )
        return results
