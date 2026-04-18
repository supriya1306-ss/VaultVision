import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

class MLService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_id = "openai/clip-vit-base-patch32"
        self.model = None
        self.processor = None

    def load_model(self):
        """Lazy load the model to save memory until the first inference."""
        if self.model is None or self.processor is None:
            print(f"Loading CLIP model on {self.device}...")
            self.model = CLIPModel.from_pretrained(self.model_id).to(self.device)
            self.processor = CLIPProcessor.from_pretrained(self.model_id)
        return self.model, self.processor

    def get_image_embedding(self, image: Image.Image) -> list[float]:
        """Extracts an image embedding vector using CLIP."""
        model, processor = self.load_model()
        
        # Preprocess image
        inputs = processor(images=image, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            # Get features
            outputs = model.get_image_features(**inputs)
            
            # Handle cases where output is a model output object instead of a raw tensor
            if isinstance(outputs, torch.Tensor):
                image_features = outputs
            elif hasattr(outputs, "image_embeds"):
                image_features = outputs.image_embeds
            elif hasattr(outputs, "pooler_output"):
                image_features = outputs.pooler_output
            else:
                # Fallback to the first output if it's a tuple-like object
                image_features = outputs[0]
            
        # Normalize the features via L2 normalization
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        
        # Convert to a standard Python list of floats for storage in vector DB
        embedding = image_features.squeeze(0).cpu().tolist()
        return embedding

# Singleton instance
ml_service = MLService()
