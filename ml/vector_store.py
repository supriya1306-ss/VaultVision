import chromadb
import os

class VectorStore:
    def __init__(self, persist_directory="../data/chromadb", embedding_function=None):
        if not persist_directory:
            persist_directory = os.getenv("CHROMA_DB_PATH", "../data/chromadb")
        os.makedirs(persist_directory, exist_ok=True)
        # Initialize chroma db
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # We create a collection (like a table) using cosine similarity
        self.collection = self.client.get_or_create_collection(
            name="protected_assets",
            embedding_function=embedding_function,
            metadata={"hnsw:space": "cosine", "dimension": 512}
        )
        
    def add_asset(self, asset_id: str, embedding: list, metadata: dict = None):
        """Adds a single image embedding to the database"""
        assert len(embedding) == 512, f"Embedding must be 512-d (CLIP), got {len(embedding)}"
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
