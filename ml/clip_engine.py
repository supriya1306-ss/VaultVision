from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

class CLIPEngine:
    def __init__(self, model_name="openai/clip-vit-base-patch32"):
        # We tell PyTorch to use GPU if available, otherwise use CPU
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        print(f"Loading CLIP model '{model_name}' on {self.device}...")
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        print("CLIP model loaded successfully.")
    
    def get_image_embedding(self, image: Image.Image):
        # 1. Preprocess the image (resize, normalize)
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        
        # 2. Extract the features mathematically
        with torch.no_grad():
            outputs = self.model.get_image_features(**inputs)
            
            # Extract the correct tensor array from the output object
            if hasattr(outputs, 'image_embeds'):
                image_features = outputs.image_embeds
            elif hasattr(outputs, 'pooler_output'):
                image_features = outputs.pooler_output
            else:
                image_features = outputs
            
        # 3. Normalize the features (crucial for accurate matching)
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        
        # 4. Return as a plain Python list
        return image_features.cpu().numpy().tolist()[0]

