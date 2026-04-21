import os
import sys
from PIL import Image

# This allows us to import from our 'ml' folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.clip_engine import CLIPEngine
from ml.vector_store import VectorStore

def main():
    # 1. Initialize our ML components
    print("Initializing ML engines...")
    clip = CLIPEngine()
    
    # We tell VectorStore to save the database inside the data/chromadb folder
    current_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(current_dir, "chromadb")
    v_store = VectorStore(persist_directory=db_path)
    
    # 2. Find our sample images
    images_dir = os.path.join(current_dir, "sample_images")
    if not os.path.exists(images_dir):
        print(f"Please create the folder: {images_dir} and add some images.")
        return

    # Loop through each file in that directory
    for filename in os.listdir(images_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            file_path = os.path.join(images_dir, filename)
            print(f"Processing {filename}...")
            
            # 3. Open image and get CLIP embedding
            try:
                img = Image.open(file_path).convert("RGB")
                embedding = clip.get_image_embedding(img)
                
                # 4. Save to ChromaDB
                v_store.add_asset(
                    asset_id=filename,  # using filename as the unique ID for simplicity
                    embedding=embedding,
                    metadata={"filename": filename, "source": "initial_ingest"}
                )
                print(f"Successfully protected {filename}!")
            except Exception as e:
                print(f"Failed to process {filename}: {e}")

    print("All assets ingested successfully!")

if __name__ == "__main__":
    main()
